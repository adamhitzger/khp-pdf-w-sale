"use server";

/**
 * Nabídka se slevou — interní protějšek `lib/actions.ts` z new-konstanta.
 *
 * Výpočetní část (`calculateBrana`, `createXlsx`, `htmlToPdf` a jejich pomocníci)
 * je odtamtud zkopírovaná 1:1, aby nabídka odeslaná obchodníkem seděla na korunu
 * s tou, kterou zákazníkovi vygeneroval konfigurátor na webu. Jediný rozdíl je
 * `sale` — procentní sleva, kterou obchodník zadá v 6. kroku a která se propíše
 * do XLSX i PDF jako dvojice řádků „Sleva“ / „Celkem se slevou“.
 *
 * Když se ceník na webu změní, tenhle soubor se aktualizuje zkopírováním
 * odpovídajících bloků z new-konstanta a znovupřidáním těch dvou řádků.
 */

import { confSchema, type ConfiguratorType } from "@/lib/schemas";
import nodemailer from "nodemailer"
import exceljs from "exceljs"
import os from 'os';
import { randomUUID } from 'crypto';
import  fs  from 'fs';
import path from "path";
import { render } from "@react-email/render"
import ConfMail from "@/components/ConfMail";
import type { ActionResponse, ConfPhotos } from "@/types";
import { sanityFetch } from "@/sanity/lib/client";
import { CONF_IMGS_QUERY } from "@/sanity/lib/queries";
import {
  type Lang,
  colorLabels,
  gateLabels,
  getLang,
  localeTags,
  motivLabels,
  povrchLabels,
  quoteContent,
  quoteItemsContent,
  sloupkyLabels,
} from "@/lib/translations";

/**
 * Popisky slevových řádků. Nejsou v `quoteItemsContent`, protože ten soubor je
 * doslovná kopie z new-konstanta, kde se sleva neuplatňuje — držíme je stranou,
 * aby `lib/translations.ts` šel dál aktualizovat prostým zkopírováním.
 */
const saleLabels: Record<Lang, { sleva: string; celkemSeSlevou: string }> = {
  cs: { sleva: "Sleva", celkemSeSlevou: "Celkem se slevou:" },
  sk: { sleva: "Zľava", celkemSeSlevou: "Celkom so zľavou:" },
  de: { sleva: "Rabatt", celkemSeSlevou: "Gesamt mit Rabatt:" },
};

let cachedExecutablePath: string | null = null;
let downloadPromise: Promise<string> | null = null;

const CHROMIUM_PACK_URL =
  `https://khp-pdf-w-sale.vercel.app/chromium-pack.tar`

async function getChromiumPath(): Promise<string> {
  if (cachedExecutablePath) return cachedExecutablePath;

  if (!downloadPromise) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    downloadPromise = chromium
      .executablePath(CHROMIUM_PACK_URL)
      .then((p) => {
        cachedExecutablePath = p;
        return p;
      })
      .catch((error) => {
        // Bez tohohle by se neúspěšné stažení zacyklilo: `downloadPromise` by
        // zůstala navždy zamítnutá a instance funkce by už PDF nikdy nevyrobila.
        downloadPromise = null;
        throw error;
      });
  }

  return downloadPromise;
}

export async function generatePdf(html: string, outputPath: string) {
  let browser;

  try {
    const isVercel = !!process.env.VERCEL_ENV;

    let puppeteer: any;
    let launchOptions: any = { headless: true };

    if (isVercel) {
      const chromium = (await import("@sparticuz/chromium-min")).default;
      puppeteer = await import("puppeteer-core");

      // Nabídka nepotřebuje WebGL a SwiftShader stojí ve funkci stovky MB paměti.
      // Musí se nastavit před přečtením `chromium.args` — ovlivňuje výsledné flagy.
      chromium.setGraphicsMode = false;

      const executablePath = await getChromiumPath();

      // Binárka z `chromium-min` je `headless_shell`. `headless: true` jí posílá
      // `--headless=new`, který neumí — prohlížeč sice naběhne, ale spadne během
      // tisku. Sparticuz proto předepisuje `headless: "shell"` i v `defaultArgs`.
      launchOptions = {
        args: await puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
        defaultViewport: { width: 1240, height: 1754, deviceScaleFactor: 1 },
        executablePath,
        headless: "shell",
      };
    } else {
      puppeteer = await import("puppeteer");
    }

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Když se ilustrační fotky nestihnou stáhnout, vytiskneme nabídku i tak —
    // text a ceny jsou důležitější. Obsah je v tu chvíli už nastavený, čekalo se
    // jen na `load`.
    await page
      .setContent(html, { waitUntil: "load", timeout: 20_000 })
      .catch((error: unknown) => {
        console.warn("PDF: obsah se nenačetl do 20 s, tiskne se bez čekání:", error);
      });

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      timeout: 60_000,
    });
  } finally {
    // Po pádu rendereru je target zavřený a `close()` hodí vlastní chybu, která
    // by přebila tu původní.
    if (browser) await browser.close().catch(() => {});
  }
}
function colorRow(ws: exceljs.Worksheet, rowNumber: number) {
  const row = ws.getRow(rowNumber);
  row.eachCell((cell,id) => {
    if(id >0){
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: "FFCCCCCC" },
    };
    cell.font = {
      color: { argb: "FFFFFFFF" } // Černá barva textu (výchozí)
    };
    }
  });
}
function smtp(){
  return nodemailer.createTransport({
        host: "smtp.seznam.cz",
        port: 587,
        secure: false,
        auth: {
         user: process.env.FROM_EMAIL!,
         pass: process.env.FROM_EMAIL_PASSWORD!,
        },
        tls: {
         ciphers: "SSLv3"
        }
      });
}

function tableHrRow(): string {
  return `
    <tr>
      <td colspan="4" style="border-top:1px solid #e6e6e6; padding:0; margin:0;"></td>
    </tr>
  `;
}

/**
 * Formátování částek podle jazyka příjemce. Měna zůstává CZK — ceník se
 * nepřepočítává, mění se jen oddělovač tisíců a zkratka měny.
 */
type Money = (value: number) => string;

function moneyFormatter(lang: Lang): Money {
  const locale = localeTags[lang] ?? localeTags.cs;
  const { currency } = quoteItemsContent[lang] ?? quoteItemsContent.cs;
  return (value: number) => `${Number(value.toFixed(0)).toLocaleString(locale)} ${currency}`;
}

function buildProductRows(money: Money, item: string, mnozstvi: number | string,cena: number, dph: number, cenaSDph: number): string {
    return`
      <tr>
        <td style="border:1px solid #ddd;">${item}</td>
        <td style="border:1px solid #ddd;">${mnozstvi} </td>
        <td style="border:1px solid #ddd;">${money(cena)}</td>
        <td style="border:1px solid #ddd;">${money(dph)}</td>
        <td style="border:1px solid #ddd;">${money(cenaSDph)}</td>
      </tr>
    `;
  ;
}
function buildProductRowsString( item: string, mnozstvi: string): string {
    return`
      <tr>
        <td style="border:1px solid #ddd;">${item}</td>
        <td style="border:1px solid #ddd; colspan: 4;">${mnozstvi}</td>
      </tr>
    `;
  ;
}

/**
 * Fotky do nabídky se zmenšují přes Sanity image CDN. V PDF mají 38 mm na výšku,
 * ale ze Studia chodí originály (6000 × 3376 px, přes 4 MB) a Chromium si každý
 * rozbalí do bitmapy kolem 80 MB. Na Vercelu, kde `chromium.args` obsahuje
 * `--single-process`, to shodí renderer i s prohlížečem a `page.pdf()` skončí na
 * `Protocol error (Page.printToPDF): Target closed`.
 * `fit=max` (ne `crop`) drží původní poměr stran — ořez si dělá CSS přes
 * `object-fit: cover`, takže se výřez oproti dosavadním nabídkám nemění, jen
 * rozlišení. 900 px na šířku vychází v tisku na ~390 dpi.
 */
const PDF_IMG = "w=900&h=1400&fit=max&auto=format";

const pdfPhoto = (url: string): string =>
  url.includes("cdn.sanity.io")
    ? `${url}${url.includes("?") ? "&" : "?"}${PDF_IMG}`
    : url;

function htmlToPdf(
  userName: string,
  userEmail: string,
  tel: string,
  address: string,
  city: string,
  photo1: string,
  photo2: string,
  photo3: string,
  productRows: string,
  sazbaDph: number,
  /** Poznámka zákazníka z konfigurátoru (`data.message`) — vykreslí se jako vlastní blok. */
  poznamka?: string,
  firma?: string,
  /** Jazyk nabídky — texty i formát data/čísel jdou podle něj. */
  lang: Lang = "cs"
): string {

  const q = quoteContent[lang] ?? quoteContent.cs;
  const locale = localeTags[lang] ?? localeTags.cs;
  /**
   * Podle čeho `hydrate()` pozná souhrnný řádek tabulky. `createXlsx` ho skládá
   * z `quoteItemsContent.<lang>.celkem`, takže marker musí jít ze stejného zdroje.
   */
  const totalMarker = (quoteItemsContent[lang] ?? quoteItemsContent.cs).celkem
    .replace(":", "")
    .trim()
    .toLowerCase();

  const esc = (v?: string) =>
    String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

  const now = new Date();
  const dat = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "numeric", year: "numeric" });
  const pad = (n: number) => String(n).padStart(2, "0");
  // Číslo nabídky: datum + čas vygenerování. Stačí na rozlišení nabídek, nepotřebuje
  // čítač v databázi.
  const cisloNabidky = `CN-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
  const platnostDo = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const photos = [photo1, photo2, photo3].filter(Boolean).map(pdfPhoto);

  // Ikony sítí — stejné cesty jako `components/social-icons.tsx`, aby PDF a web
  // ukazovaly stejný tvar. Čtverec drží barvu sítě, glyf je bílý.
  const socials = [
    {
      href: "https://www.facebook.com/Konstantahp.cz",
      label: "Facebook",
      color: "#1877F2",
      path: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`,
    },
    {
      href: "https://www.instagram.com/konstantaploty/",
      label: "Instagram",
      color: "#E4405F",
      path: `<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>`,
    },
    {
      href: "https://www.youtube.com/@KONSTANTAHP",
      label: "YouTube",
      color: "#FF0000",
      path: `<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>`,
    },
  ];

  const socialHtml = socials
    .map(
      (s) => `<a class="soc" href="${s.href}" title="${s.label}" style="background:${s.color}">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${s.path}</svg>
      </a>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8"/>
<title>${q.docTitle} ${cisloNabidky}</title>
<style>
  /* Arch si velikost stránky řídí sám (generatePdf jede s preferCSSPageSize). */
  @page { size: A4; margin: 0; }

  *, *::before, *::after { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    background: #fff;
    color: #111;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    font-size: 9.5pt;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  a { color: #ec5500; text-decoration: none; }

  /* ---------- arch ---------- */
  /* 296.8mm místo plných 297mm: arch přesně na výšku stránky by Chromu občas
     vyrobil prázdnou stránku navíc. */
  .sheet {
    position: relative;
    width: 210mm;
    height: 296.8mm;
    overflow: hidden;
    break-after: page;
    page-break-after: always;
  }
  .sheet.last { break-after: auto; page-break-after: auto; }

  /* Záhlaví je vyšší kvůli většímu logu — součet head+body+foot musí zůstat 296.8mm. */
  .sheet-head { height: 32mm; padding: 9mm 14mm 0; }
  .sheet-body { height: 248.8mm; padding: 6mm 14mm 0; overflow: hidden; }
  .sheet-foot { height: 16mm; }

  /* ---------- záhlaví ---------- */
  .head { display: flex; align-items: center; justify-content: space-between; }
  .head img { height: 20mm; width: auto; }
  .head-right { text-align: right; }
  .head-title {
    font-size: 15pt;
    font-weight: 800;
    letter-spacing: .1em;
    text-transform: uppercase;
    line-height: 1.1;
  }
  .head-meta { margin-top: 1.5mm; font-size: 7.5pt; color: #6b6b6b; letter-spacing: .02em; }
  .head-meta b { color: #111; font-weight: 600; }
  /* Dělicí linka pod hlavičkou — oranžový náběh je jediný barevný prvek nahoře. */
  .rule { display: flex; margin-top: 4mm; height: 1.2mm; }
  .rule i { display: block; width: 18mm; background: #ec5500; }
  .rule u { display: block; flex: 1; background: #111; }

  /* ---------- zápatí ---------- */
  .foot {
    height: 16mm;
    background: #111;
    color: #cfcfcf;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14mm;
    font-size: 7pt;
    letter-spacing: .02em;
  }
  .foot b { color: #fff; font-weight: 600; }
  .foot a { color: #cfcfcf; }
  .foot-left { display: flex; flex-direction: column; gap: .8mm; }
  .foot-right { display: flex; align-items: center; gap: 2.4mm; }
  .soc {
    width: 5mm;
    height: 5mm;
    border-radius: .8mm;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .soc svg { width: 3.2mm; height: 3.2mm; display: block; }
  .pageno {
    margin-left: 2mm;
    padding-left: 2.6mm;
    border-left: .3mm solid #3a3a3a;
    color: #ec5500;
    font-weight: 700;
    font-size: 7.5pt;
    white-space: nowrap;
  }

  /* ---------- bloky obsahu ---------- */
  #src { display: none; }
  .block { margin: 0 0 6mm; }
  .block:last-child { margin-bottom: 0; }

  h2 {
    margin: 0 0 2.5mm;
    font-size: 9.5pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .09em;
    padding-left: 2.5mm;
    border-left: 1mm solid #ec5500;
    line-height: 1.3;
  }

  /* meta pruh (číslo nabídky, data) */
  .meta { display: flex; gap: 3mm; }
  .meta div {
    flex: 1;
    border: .3mm solid #e2e2e2;
    border-top: 1mm solid #ec5500;
    padding: 2mm 3mm;
  }
  .meta span { display: block; font-size: 6.8pt; text-transform: uppercase; letter-spacing: .08em; color: #7a7a7a; }
  .meta strong { display: block; font-size: 10pt; font-weight: 700; margin-top: .6mm; }

  /* dodavatel / odběratel */
  .parties { display: flex; gap: 5mm; }
  .party { flex: 1; border: .3mm solid #e2e2e2; }
  .party-h {
    background: #111;
    color: #fff;
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .12em;
    padding: 1.6mm 3mm;
    border-left: 1mm solid #ec5500;
  }
  .party-b { padding: 3mm; font-size: 8.5pt; line-height: 1.65; }
  .party-b .nm { font-size: 10pt; font-weight: 700; display: block; margin-bottom: 1mm; }
  .party-b .k { display: inline-block; min-width: 17mm; color: #7a7a7a; }

  /* fotky konfigurace — pevná výška, aby měření stránkování nezáviselo na načtení */
  .photos { display: flex; gap: 3mm; }
  .photos figure { flex: 1; margin: 0; }
  .photos img {
    display: block;
    width: 100%;
    height: 38mm;
    object-fit: cover;
    border: .3mm solid #e2e2e2;
  }

  /* ---------- tabulka položek ---------- */
  /* Světle šedý vnější rámeček — jen aby byl obrys tabulky vidět; spolu se
     souhrnem pod ní tvoří jeden ohraničený blok. */
  table.items { width: 100%; border-collapse: collapse; table-layout: fixed; border: .4mm solid #c4c4c4; }
  table.items th {
    background: #111;
    color: #fff;
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .07em;
    text-align: left;
    padding: 2mm 2.5mm;
    border: 0 !important;
  }
  table.items th:first-child { border-left: 1mm solid #ec5500 !important; }
  table.items th + th { text-align: right; }
  table.items td {
    padding: 1.8mm 2.5mm !important;
    border: 0 !important;
    border-bottom: .25mm solid #ededed !important;
    font-size: 8pt;
    vertical-align: top;
    /* Popisy položek chodí s "\\n" mezi názvem a rozměrem — ať se zalomí. */
    white-space: pre-line;
    word-break: break-word;
  }
  table.items td + td { text-align: right; white-space: nowrap; }
  table.items tbody tr:nth-child(even) td { background: #fafafa; }
  table.items col.c-item { width: 43%; }
  table.items col.c-qty { width: 10%; }
  table.items col.c-num { width: 15.66%; }
  /* Oddělovač mezi produkty (tableHrRow) — jemná oranžová linka místo prázdné buňky. */
  table.items tr.sep td {
    padding: 0 !important;
    height: 1mm;
    background: #fff !important;
    border-bottom: .5mm solid #ec5500 !important;
  }
  /* Souhrnný řádek (Celkem) — běžný řádek tabulky, jen inverzní a o 1.2× větší. */
  table.items tr.total td {
    background: #111 !important;
    color: #fff;
    font-size: 9.6pt;
    font-weight: 700;
    padding: 2.2mm 2.5mm !important;
    border-bottom: 0 !important;
  }
  table.items tr.total td:first-child { border-left: 1mm solid #ec5500 !important; }
  .cont { font-size: 7pt; color: #7a7a7a; margin: 0 0 1.5mm; letter-spacing: .05em; text-transform: uppercase; }

  /* ---------- specifikace ---------- */
  .specs { display: flex; flex-wrap: wrap; gap: 2mm; }
  .specs div { border: .3mm solid #e2e2e2; border-left: 1mm solid #ec5500; padding: 1.6mm 3mm; }
  .specs span { display: block; font-size: 6.8pt; text-transform: uppercase; letter-spacing: .08em; color: #7a7a7a; }
  .specs strong { font-size: 9pt; font-weight: 700; }

  /* ---------- textové sekce ---------- */
  .cards { display: flex; gap: 5mm; }
  .card { flex: 1; border: .3mm solid #e2e2e2; padding: 3mm; }
  .card h3 {
    margin: 0 0 1.5mm;
    font-size: 8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .08em;
  }
  .card p { margin: 0; font-size: 8pt; line-height: 1.55; color: #3a3a3a; }
  .card strong { color: #111; }

  /* Termín realizace a záloha — jediné dvě karty, které nesou oranžový akcent. */
  .card.accent {
    border: .3mm solid #f5cbb0;
    border-top: 1.4mm solid #ec5500;
    background: #fff7f2;
  }
  .card.accent h3 {
    color: #ec5500;
    padding-left: 2.4mm;
    border-left: .8mm solid #ec5500;
  }
  .card.accent .badge {
    display: inline-block;
    background: #ec5500;
    color: #fff;
    font-size: 8.5pt;
    font-weight: 800;
    letter-spacing: .04em;
    padding: .9mm 2.4mm;
    margin: 0 0 2mm;
  }
  .card.accent p strong { color: #ec5500; }

  .terms { display: flex; gap: 5mm; }
  .terms > div { flex: 1; }
  .terms h3 {
    margin: 0 0 1.5mm;
    font-size: 8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .08em;
    padding-left: 2mm;
    border-left: .8mm solid #ec5500;
  }
  .terms ul { margin: 0 0 2mm; padding: 0; list-style: none; }
  .terms li {
    font-size: 8pt;
    padding: 1.2mm 0 1.2mm 4mm;
    border-bottom: .25mm solid #f0f0f0;
    position: relative;
    color: #3a3a3a;
  }
  .terms li::before { content: ""; position: absolute; left: 0; top: 3mm; width: 1.6mm; height: 1.6mm; background: #ec5500; }
  .terms li b { color: #111; font-weight: 600; }
  .terms p { margin: 2mm 0 0; font-size: 7.5pt; color: #6b6b6b; line-height: 1.55; }

  .note { border: .3mm solid #e2e2e2; border-left: 1mm solid #ec5500; padding: 3mm; }
  .note span { display: block; font-size: 6.8pt; text-transform: uppercase; letter-spacing: .08em; color: #7a7a7a; margin-bottom: 1mm; }
  .note p { margin: 0; font-size: 8.5pt; }

  .disclaimer { font-size: 7pt; color: #8a8a8a; line-height: 1.5; }
</style>
</head>
<body>

<!-- Šablony záhlaví a zápatí — skript je klonuje na každý arch. -->
<template id="tpl-head">
  <div class="head">
    <img src="https://cdn.sanity.io/files/a3wdqcta/production/28aefe7de25e70f91a0f788514e80d75bfd41b40.svg" alt="KONSTANTA - hliníkové ploty s.r.o."/>
    <div class="head-right">
      <div class="head-title">${q.docTitle}</div>
      <div class="head-meta">${q.numberPrefix} <b>${cisloNabidky}</b> &nbsp;·&nbsp; ${dat(now)}</div>
    </div>
  </div>
  <div class="rule"><i></i><u></u></div>
</template>

<template id="tpl-foot">
  <div class="foot">
    <div class="foot-left">
      <div><b>KONSTANTA - hliníkové ploty s.r.o.</b> &nbsp;·&nbsp; Maleč 36, 582 76 Maleč &nbsp;·&nbsp; IČO 21827150</div>
      <div>+420 770 169 411 &nbsp;·&nbsp; <a href="mailto:info@konstantahp.cz">info@konstantahp.cz</a> &nbsp;·&nbsp; <a href="https://www.konstantahp.cz">konstantahp.cz</a></div>
    </div>
    <div class="foot-right">
      ${socialHtml}
      <span class="pageno"></span>
    </div>
  </div>
</template>

<!-- Zdrojový obsah. Skript ho po blocích přesype do archů v #pages. -->
<div id="src">

  <section class="block">
    <div class="meta">
      <div><span>${q.metaNumber}</span><strong>${cisloNabidky}</strong></div>
      <div><span>${q.metaIssued}</span><strong>${dat(now)}</strong></div>
      <div><span>${q.metaValid}</span><strong>${dat(platnostDo)}</strong></div>
    </div>
  </section>

  <section class="block">
    <div class="parties">
      <div class="party">
        <div class="party-h">${q.supplier}</div>
        <div class="party-b">
          <span class="nm">KONSTANTA - hliníkové ploty s.r.o.</span>
          Maleč 36, 582 76 Maleč<br>
          ${q.country}<br>
          <span class="k">${q.ico}</span> 21827150<br>
          <span class="k">${q.phone}</span> +420 770 169 411<br>
          <span class="k">${q.email}</span> <a href="mailto:info@konstantahp.cz">info@konstantahp.cz</a><br>
          <span class="k">${q.web}</span> <a href="https://www.konstantahp.cz">www.konstantahp.cz</a>
        </div>
      </div>
      <div class="party">
        <div class="party-h">${q.customer}</div>
        <div class="party-b">
          <span class="nm">${esc(userName)}</span>
          ${firma && firma.trim().length > 0 ? `<span class="k">${q.company}</span> ${esc(firma)}<br>` : ""}
          ${esc(address)}<br>
          ${esc(city)}<br>
          <span class="k">${q.phone}</span> ${esc(tel)}<br>
          <span class="k">${q.email}</span> <a href="mailto:${esc(userEmail)}">${esc(userEmail)}</a>
        </div>
      </div>
    </div>
  </section>

  ${photos.length
    ? `<section class="block">
    <h2>${q.configHeading}</h2>
    <div class="photos">
      ${photos.map((p) => `<figure><img src="${esc(p)}" alt=""></figure>`).join("")}
    </div>
  </section>`
    : ""}

  <section class="block" id="b-items">
    <h2>${q.itemsHeading}</h2>
    <table class="items">
      <colgroup>
        <col class="c-item"><col class="c-qty"><col class="c-num"><col class="c-num"><col class="c-num">
      </colgroup>
      <thead>
        <tr>
          <th>${q.thItem}</th>
          <th>${q.thQty}</th>
          <th>${q.thNoVat}</th>
          <th>${q.thVat} ${sazbaDph * 100} %</th>
          <th>${q.thWithVat}</th>
        </tr>
      </thead>
      <tbody>
        ${productRows}
      </tbody>
    </table>
  </section>

  <!-- Specifikaci plní skript z dvoubuňkových řádků tabulky (viz hydrate). -->
  <section class="block" id="b-specs"><h2>${q.specsHeading}</h2><div class="specs"></div></section>

  ${poznamka && poznamka.trim()
    ? `<section class="block"><div class="note"><span>${q.noteHeading}</span><p>${esc(poznamka)}</p></div></section>`
    : ""}

  <section class="block">
    <div class="cards">
      <div class="card accent">
        <h3>${q.termHeading}</h3>
        <span class="badge">${q.termBadge}</span>
        <p>${q.termText}</p>
      </div>
      <div class="card accent">
        <h3>${q.depositHeading}</h3>
        <span class="badge">${q.depositBadge}</span>
        <p>${q.depositText}</p>
      </div>
    </div>
  </section>

  <section class="block">
    <h2>${q.termsHeading}</h2>
    <div class="terms">
      <div>
        <h3>${q.termsPersonal}</h3>
        <ul>
          ${q.termsPersonalItems.map((i) => `<li>${i}</li>`).join("")}
        </ul>
        <p>${q.termsPersonalNote}</p>
      </div>
      
    </div>
  </section>

  <section class="block">
    <p class="disclaimer">
      ${q.disclaimer} ${q.validUntil} ${dat(platnostDo)}.
    </p>
  </section>

</div>

<div id="pages"></div>

<script>
(function () {
  var src = document.getElementById('src');
  var pages = document.getElementById('pages');
  var headTpl = document.getElementById('tpl-head').innerHTML;
  var footTpl = document.getElementById('tpl-foot').innerHTML;
  var body = null;

  /**
   * Roztřídí řádky tabulky:
   *  - jednobuňkové (tableHrRow) → oddělovač mezi produkty,
   *  - dvoubuňkové (buildProductRowsString) → chipy "Specifikace",
   *  - řádek "Celkem" → zůstává v tabulce, jen dostane inverzní styl.
   * V tabulce tak zůstane jen to, co má cenu, a createXlsx se nemusí měnit.
   */
  function hydrate() {
    var table = document.querySelector('#b-items table');
    var tbody = table.tBodies[0];
    var specsBox = document.querySelector('#b-specs .specs');
    var specCount = 0;

    Array.prototype.slice.call(tbody.rows).forEach(function (tr) {
      var cells = tr.cells;
      if (cells.length === 1) { tr.className = 'sep'; return; }
      if (cells.length === 2) {
        var d = document.createElement('div');
        d.innerHTML = '<span></span><strong></strong>';
        d.querySelector('span').textContent = cells[0].textContent.trim();
        d.querySelector('strong').textContent = cells[1].textContent.trim();
        specsBox.appendChild(d);
        specCount++;
        tr.parentNode.removeChild(tr);
        return;
      }
      if (cells[0].textContent.trim().toLowerCase().indexOf('${totalMarker}') === 0) {
        tr.className = 'total';
      }
    });

    // Oddělovač na konci tabulky by visel pod posledním řádkem.
    while (tbody.rows.length && tbody.rows[tbody.rows.length - 1].className === 'sep') {
      tbody.deleteRow(tbody.rows.length - 1);
    }

    if (!specCount) { var bs = document.getElementById('b-specs'); bs.parentNode.removeChild(bs); }
  }

  function newSheet() {
    var s = document.createElement('div');
    s.className = 'sheet';
    s.innerHTML =
      '<div class="sheet-head">' + headTpl + '</div>' +
      '<div class="sheet-body"></div>' +
      '<div class="sheet-foot">' + footTpl + '</div>';
    pages.appendChild(s);
    body = s.querySelector('.sheet-body');
  }

  /** Vejde se aktuální obsah archu do jeho plochy? */
  function fits() {
    return body.scrollHeight <= body.clientHeight;
  }

  /**
   * Rozdělí přetékající tabulku po skupinách řádků. Skupina = řádky jedné položky
   * až po oddělovač (tr.sep), takže se brána nikdy neutrhne od svých příplatků.
   * Skupina delší než celý arch se v krajním případě láme po jednotlivých řádcích.
   */
  function splitTable(block, table) {
    var theadHtml = table.tHead.outerHTML;
    var colsHtml = table.querySelector('colgroup').outerHTML;
    var tbody = table.tBodies[0];

    var groups = [];
    var cur = [];
    Array.prototype.slice.call(tbody.rows).forEach(function (tr) {
      cur.push(tr);
      if (tr.className === 'sep') { groups.push(cur); cur = []; }
    });
    if (cur.length) groups.push(cur);
    // Souhrnný řádek stojí za posledním oddělovačem, takže by tvořil vlastní
    // skupinu a mohl osiřet na dalším archu — přilepit ho k předchozí.
    if (groups.length > 1) {
      var last = groups[groups.length - 1];
      if (last.length === 1 && last[0].className === 'total') {
        groups[groups.length - 2] = groups[groups.length - 2].concat(groups.pop());
      }
    }
    groups.forEach(function (g) { g.forEach(function (tr) { tr.parentNode.removeChild(tr); }); });

    // Prázdná tabulka (nadpis + hlavička) se musí vejít, jinak jde celý blok na nový arch.
    if (!fits() && body.children.length > 1) {
      body.removeChild(block);
      newSheet();
      body.appendChild(block);
    }

    var curTable = table;
    /** Oddělovač na konci archu vypadá jako utržená linka — pryč s ním. */
    function trimTrailingSep(t) {
      var b = t.tBodies[0];
      while (b.rows.length && b.rows[b.rows.length - 1].className === 'sep') {
        b.deleteRow(b.rows.length - 1);
      }
    }
    function startFragment() {
      trimTrailingSep(curTable);
      var cont = document.createElement('section');
      cont.className = 'block';
      cont.innerHTML =
        '<div class="cont">${q.itemsCont}</div>' +
        '<table class="items">' + colsHtml + theadHtml + '<tbody></tbody></table>';
      newSheet();
      body.appendChild(cont);
      curTable = cont.querySelector('table');
    }
    function push(rows) {
      var target = curTable.tBodies[0];
      rows.forEach(function (tr) { target.appendChild(tr); });
      if (fits()) return true;
      rows.forEach(function (tr) { tr.parentNode.removeChild(tr); });
      return false;
    }

    groups.forEach(function (g) {
      if (push(g)) return;
      if (curTable.tBodies[0].rows.length > 0) startFragment();
      if (push(g)) return;
      g.forEach(function (tr) {
        if (push([tr])) return;
        startFragment();
        push([tr]);
      });
    });

    trimTrailingSep(curTable);
  }

  hydrate();
  newSheet();

  Array.prototype.slice.call(src.children).forEach(function (block) {
    body.appendChild(block);
    if (fits()) return;
    var table = block.querySelector('table');
    if (table) { splitTable(block, table); return; }
    // Ostatní bloky se nelámou — pokud na archu nejsou samy, zkusí se na dalším.
    if (body.children.length > 1) {
      body.removeChild(block);
      newSheet();
      body.appendChild(block);
    }
  });

  var sheets = pages.querySelectorAll('.sheet');
  sheets[sheets.length - 1].className = 'sheet last';
  for (var i = 0; i < sheets.length; i++) {
    var no = sheets[i].querySelectorAll('.pageno');
    for (var j = 0; j < no.length; j++) no[j].textContent = (i + 1) + ' / ' + sheets.length;
  }
})();
</script>

</body>
</html>`;
}
/**
 * Ceník doplňků přidaných do konfigurátoru (kování branky).
 * Ceny jsou bez DPH za kus; drženy tady u sebe, ať jdou upravit na jednom místě.
 * Popisy k nim se berou z `quoteItemsContent`, aby šly přeložit bez zásahu do ceníku.
 */
const KOVANI_CENIK: Record<string, number> = {
  "kliky-mt": 8720,
  "madlo-300": 2000,
  "madlo-225": 2000,
  "madlo-1250": 5000,
};

/**
 * Neznámé/nevyplněné kování spadne zpět na původní nerez kliky za 1 500 Kč.
 * `null` je legitimní vstup — tak posílá react-hook-form radio skupinu, ze které
 * uživatel nic nevybral (viz `optionalRadio` v lib/schemas.tsx).
 */
const kovaniPolozka = (lang: Lang, kovani?: string | null) => {
  const ti = quoteItemsContent[lang] ?? quoteItemsContent.cs;
  const key = kovani ?? "";
  return key in KOVANI_CENIK
    ? { popis: ti.kovani[key], cena: KOVANI_CENIK[key] }
    : { popis: ti.kovaniFallback, cena: 2000 };
};

/**
 * `id` je klíč z `gateProducts` / `gateLabels` — jede podle něj cenová hladina
 * i překlad názvu, takže se ceník nerozbije změnou textu.
 */
function calculateBrana(
  id: string,
  lang: Lang,
  sazbaDph: number,
  ws:exceljs.Worksheet,
  brana?: {
    delka?: number | undefined;
    vyska?: number | undefined;
    pocet?: number | undefined;
    pohon?: boolean | undefined;
    tahoma?: boolean | undefined;
}[] | undefined,
): {bezDPH: number, html: String}{
const ti = quoteItemsContent[lang] ?? quoteItemsContent.cs;
const money = moneyFormatter(lang);
const name = (gateLabels[lang] ?? gateLabels.cs)[id] ?? gateLabels.cs[id] ?? id;
let bezDPH: number =0;
  let html = "";
  if(brana  && brana.length > 0){
  brana.forEach((r) => {
    if(r.delka && r.pocet && r.vyska){
      let vzor = 0;
    switch(id){
      case "telSam":
      case "atypicka":
        vzor = 13000;
        break;    
      case "sekcni":
      case "skladaci":
        vzor = 16000;
        break;
      case "telPoj":
      case "samonosna":
        vzor = 11000;
        break;
      case "dvoukridla":
      case "jednokridla":
      case "posuvna":
        vzor = 8000;
        break;
    }
    const plocha = (r.delka / 1000) * (r.vyska / 1000);
    const zaklad = ((plocha * vzor) * r.pocet);
    const pohonCena = r.pohon ? (id === "dvoukridla" || id === "skladaci" || id === "jednokridla" ? 23000 : 15000) : 0;
    //zastrc u kridlovych ano, u posuvnych ne
    let zastrcCena = 0;
    let zastrcMn = 0;
    if(!r.pohon){
    switch(id){
      case "telSam":
      case "atypicka":
      case "sekcni":
      case "telPoj":
      case "samonosna":
      case "posuvna":
        zastrcCena = 0;
        zastrcMn = 0;
        break;    
      case "dvoukridla":
      case "skladaci":
        zastrcCena = 3000;
        zastrcMn = 2;
        break;
      case "jednokridla":
        zastrcCena = 1500;
        zastrcMn = 1;
      }
    }
  
    const kovaniCena = r.pohon ? 0 :  2000
    const tahomaCena = r.tahoma ? r.pocet *5000 : 0;
    const brzdaCena = (id === "atypicka") ? 8000 : 0
    const montazCena = (id === "telPoj" || id === "telSam" || id === "sekcni" || id === "skladaci") ? r.pocet * 6000 : r.pocet * 4500;
    const kolejniceCena = (id === "atypicka" || id === "telPoj" || id === "posuvna" || id === "sekcni") ? 5000 : 0
    const zadlabavaciZamekCena = ((id === "samonosna" && !r.pohon) || id === "posuvna" || id === "atypicka") ? 3480 : 0
    bezDPH += zaklad+pohonCena+tahomaCena+montazCena+brzdaCena+kolejniceCena+zadlabavaciZamekCena
    
    const headerRow = ws.addRow([ti.header.produkt, ti.header.mnozstvi, ti.header.bezDph, ti.header.dph, ti.header.sDph])
    ws.addRow([`${name}: ${r.delka}x${r.vyska} mm`,r.pocet,money(zaklad),money(zaklad*sazbaDph), money(zaklad*(1+sazbaDph)) ]);
    
    html +=(buildProductRows(money, name + " \n" + `${r.delka}x${r.vyska} mm`,r.pocet,zaklad,zaklad*sazbaDph, Number((zaklad*(1+sazbaDph)).toFixed(0)) ))
    
    if(r.pohon){
      // Název pohonu jde podle typu brány: křídlové (dvoukřídlá, skládací) mají
      // Ixengo L, všechny ostatní (posuvné varianty) Elixo 500.
      const pohonNazev = (id === "dvoukridla" || id === "skladaci") ? ti.pohonKridlova : ti.pohonPosuvna;
      ws.addRow([`${pohonNazev}:`, 1,money(pohonCena), money(pohonCena*sazbaDph), money(pohonCena*(1+sazbaDph))]);
      html +=(buildProductRows(money, `${pohonNazev}:`, 1,pohonCena, pohonCena*sazbaDph, Number((pohonCena*(1+sazbaDph)).toFixed(0))))
      }else{
        if(id === "dvoukridla" || id === "jednokridla" || id === "skladaci"){
          ws.addRow([`${ti.zastrc}:`, zastrcMn,money(zastrcCena), money(zastrcCena*sazbaDph), money(zastrcCena*(1+sazbaDph))]);
          html +=(buildProductRows(money, `${ti.zastrc}:`, zastrcMn,zastrcCena, zastrcCena*sazbaDph, Number((zastrcCena*(1+sazbaDph)).toFixed(0))))
        }
        ws.addRow([`${ti.kovaniBrany}:`, 1,money(kovaniCena), money(kovaniCena*sazbaDph), money(kovaniCena*(1+sazbaDph))]);
        html +=(buildProductRows(money, `${ti.kovaniBrany}:`, 1,kovaniCena, kovaniCena*sazbaDph, Number((kovaniCena*(1+sazbaDph)).toFixed(0))))        
      }

    if(r.tahoma) {
      ws.addRow([ti.tahoma,1,money(tahomaCena),money(tahomaCena*sazbaDph),money(tahomaCena*(1+sazbaDph))]);
      html +=(buildProductRows(money, ti.tahoma,1,tahomaCena,tahomaCena*sazbaDph,tahomaCena*(1+sazbaDph)))
    }
    if(id === "atypicka"){
      ws.addRow([`${ti.brzda}:`, r.pocet, money(brzdaCena), money(brzdaCena*sazbaDph), money(brzdaCena*(1+sazbaDph))]);
      html +=(buildProductRows(money, `${ti.brzda}:`, r.pocet, brzdaCena, brzdaCena*sazbaDph, Number((brzdaCena*(1+sazbaDph)).toFixed(0))))
    }
    if(id === "atypicka" || id === "telPoj" || id === "posuvna"){ //Kolejnice
      ws.addRow([`${ti.kolejnice}:`, r.pocet, money(kolejniceCena), money(kolejniceCena*sazbaDph), money(kolejniceCena*(1+sazbaDph))]);
      html +=(buildProductRows(money, `${ti.kolejnice}:`, r.pocet, kolejniceCena, kolejniceCena*sazbaDph, Number((kolejniceCena*(1+sazbaDph)).toFixed(0))))
    }
    if(((id === "samonosna" && !r.pohon) || id === "posuvna")){
      ws.addRow([`${ti.dojezdSloupek}:`, r.pocet, money(zadlabavaciZamekCena), money(zadlabavaciZamekCena*sazbaDph), money(zadlabavaciZamekCena*(1+sazbaDph))]);
      html +=(buildProductRows(money, `${ti.dojezdSloupek}:`, r.pocet, zadlabavaciZamekCena, zadlabavaciZamekCena*sazbaDph, Number((zadlabavaciZamekCena*(1+sazbaDph)).toFixed(0))))
 
    }
    ws.addRow([`${ti.montazBrany}:`,1, money(montazCena), money(montazCena*sazbaDph), money(montazCena*(1+sazbaDph))]);
    html +=(buildProductRows(money, `${ti.montazBrany}:`,1, montazCena, montazCena*sazbaDph, Number((montazCena*(1+sazbaDph)).toFixed(0))))
    html += tableHrRow();
    colorRow(ws, headerRow.number)
  }});


 }
 return {bezDPH, html}
}

/**
 * `sale` je procentní sleva zadaná obchodníkem v posledním kroku (0 = bez slevy).
 * Zbytek funkce je doslovná kopie z new-konstanta — sleva se přičítá až na konci,
 * k už spočítanému součtu, aby se ceník nikde jinde nelišil.
 */
async function createXlsx(data: ConfiguratorType, isCompany: boolean,photo1:string,photo2:string,photo3:string, sale: number, lang: Lang = "cs") {
let celkem:number=0;
let celkovyPocetDilcu: number =0;
let dopravaCena: number = 5000;
const sazbaDph = isCompany ? 0.21 : 0.12
let rows = "";
console.log(celkem)
// Texty řádků a formát částek podle jazyka konfigurátoru — ceny se nepřepočítávají.
const ti = quoteItemsContent[lang] ?? quoteItemsContent.cs;
const money = moneyFormatter(lang);
//Excel workbook
const wb = new exceljs.Workbook();
const ws = wb.addWorksheet(ti.sheetName);

if(!data.brana){
  // `id` odpovídá klíčům v `gateLabels` — název řádku se z nich přeloží.
  // `enabled` je zaškrtnutí karty produktu. Bez něj by se do nabídky naceňovaly
  // i rozměry brány, kterou zákazník mezitím odebral: odškrtnutí sice pole rozměrů
  // maže (`ProductSection.setCount(0)`), ale `shouldUnregister` je `false`, takže na
  // tom stojí jediný `setValue`. Cena zákazníkovi odejde e-mailem, tak ji radši
  // vážeme na příznak, ne jen na to, že v poli něco zbylo.
  const brany = [
    { id: "dvoukridla", enabled: data.dvoukridla, data: data.rozmery2KBran },
    { id: "jednokridla", enabled: data.jednokridla, data: data.rozmeryKBran },
    { id: "posuvna", enabled: data.posuvna, data: data.rozmeryPBran },
    { id: "samonosna", enabled: data.samonosna, data: data.rozmerySBran },
    { id: "telSam", enabled: data.telSam, data: data.rozmeryTSBran },
    { id: "telPoj", enabled: data.telPoj, data: data.rozmeryTPBran },
    { id: "atypicka", enabled: data.atypicka, data: data.rozmeryABran },
    { id: "sekcni", enabled: data.sekcni, data: data.rozmerySekBran },
    { id: "skladaci", enabled: data.skladaci, data: data.rozmerySklBran },
  ];

  brany.forEach((b) => {
    if (!b.enabled) return;
    const result = calculateBrana(b.id, lang, sazbaDph, ws, b.data);
    celkem += result.bezDPH;
    rows+=(result.html);
  });
}
if(data.branka && data.rozmeryBranek  && data.rozmeryBranek.length > 0){
  data.rozmeryBranek.forEach((r) => {
    if(r.delka && r.pocet && r.vyska){
    const vzor = 8000;
    const plocha = (r.delka / 1000) * (r.vyska / 1000);
    const zaklad = (vzor * plocha) * r.pocet;
    const zamekCena = r.zamek ? 1500 : 0;
    const schrankaCena = r.schranka ? 5000 : 0;
    const zvonekCena = r.zvonek ? 18000 : 0;
    const montazCena = r.pocet * 1500;
    const kovani = kovaniPolozka(lang, r.kovani);
    const klikaCena = kovani.cena;
    const bezDPH = zaklad + zamekCena + schrankaCena + zvonekCena + montazCena + klikaCena;
    celkem += bezDPH;

    ws.addRow([`${ti.branka}: ${r.delka}x${r.vyska} mm`, r.pocet,money(zaklad), money(zaklad*sazbaDph), money(zaklad*(1+sazbaDph))]);
    rows+=(buildProductRows(money, ti.branka+ " \n"+`${r.delka}x${r.vyska} mm`,r.pocet,zaklad, zaklad*sazbaDph, zaklad*(1+sazbaDph)))
    if(r.zamek) {
      ws.addRow([ti.zamek, 1,money(zamekCena), money(zamekCena*sazbaDph), money(zamekCena*(1+sazbaDph))]);
      rows+=(buildProductRows(money, ti.zamek,1, zamekCena, zamekCena*sazbaDph, zamekCena*(1+sazbaDph)))
    }
    if(r.schranka){
      ws.addRow([ti.schranka,1,money(schrankaCena),money(schrankaCena*sazbaDph),money(schrankaCena*(1+sazbaDph))])
      rows+=(buildProductRows(money, ti.schranka,1,schrankaCena,schrankaCena*sazbaDph,schrankaCena*(1+sazbaDph)))
    };
    if(r.zvonek){
      ws.addRow([ti.zvonek,1, money(zvonekCena), money(zvonekCena*sazbaDph), money(zvonekCena*(1+sazbaDph))])
      rows+=(buildProductRows(money, ti.zvonek,1, zvonekCena, zvonekCena*sazbaDph, zvonekCena*(1+sazbaDph)))
    };
    ws.addRow([kovani.popis,1, money(klikaCena), money(klikaCena*sazbaDph), money(klikaCena*(1+sazbaDph))]);
    rows+=(buildProductRows(money, kovani.popis,1, klikaCena, klikaCena*sazbaDph,klikaCena*(1+sazbaDph)))
    ws.addRow([`${ti.montazBranky}:`,1, money(montazCena), money(montazCena*sazbaDph), money(montazCena*(1+sazbaDph))]);
    rows+=(buildProductRows(money, `${ti.montazBranky}:`,1, montazCena, montazCena*sazbaDph, montazCena*(1+sazbaDph)))
    rows+= tableHrRow()
  }});
 }

if(data.dilce && data.rozmeryDilcu  && data.rozmeryDilcu.length > 0){
  data.rozmeryDilcu.forEach((r) => {
    if(r.delka != null && r.pocet != null && r.vyska != null){
      let vzor = 0;
      switch (data.motiv) {
        case "o-standart":
          case "planka-60":
        case "plaka-90":
        case "planka-120":
        case "planka-150":     
          vzor = 3500;
          break;
        case "tycka":
        case "vlastní kombinace":
          vzor = 4500;
          break;
        case "kapka-mini":
        case "tahokov":
        case "kapka":
        case "vypaleni":
        case "lamela-105":
          vzor = 5500;
          break;
    }
    celkovyPocetDilcu += r.pocet;
    const plocha = (r.delka / 1000) * (r.vyska / 1000);
    const zaklad = vzor * plocha * r.pocet;
    const vypln = r.pocet * 500;
    const bezDPH = zaklad+vypln;
    celkem+=bezDPH
    ws.addRow([`${ti.dilce}: ${r.delka}x${r.vyska} mm`,r.pocet, money(zaklad), money(zaklad*sazbaDph),money(zaklad*(1+sazbaDph))]);
    rows+=(buildProductRows(money, ti.dilce+"\n"+`${r.delka}x${r.vyska} mm`,r.pocet, zaklad, zaklad*sazbaDph,zaklad*(1+sazbaDph)))
  }});
  ws.addRow([`${ti.montazDilcu}:`,celkovyPocetDilcu,money(celkovyPocetDilcu*500),money((celkovyPocetDilcu*500)*sazbaDph),money((celkovyPocetDilcu*500)*(1+sazbaDph))]);
  rows+=(buildProductRows(money, `${ti.montazDilcu}:`,celkovyPocetDilcu, (celkovyPocetDilcu*500),((celkovyPocetDilcu*500)*sazbaDph),((celkovyPocetDilcu*500)*(1+sazbaDph))))
  rows += tableHrRow()
 }

 
 // Hodnoty z konfigurátoru chodí jako CS klíče — do nabídky se překládají stejnými
 // slovníky, jaké používá UI. Co ve slovníku není, projde beze změny.
 const barvy = colorLabels[lang] ?? colorLabels.cs;
 const motivy = motivLabels[lang] ?? motivLabels.cs;
 const sloupky = sloupkyLabels[lang] ?? sloupkyLabels.cs;
 const povrchy = povrchLabels[lang] ?? povrchLabels.cs;

 /* Počet sloupků se odhaduje z počtu dílců (`× 2`) — přesný počet padne až při
    zaměření na místě. Krok „Sloupky" se v tomhle nástroji vyplňuje ručně: data.json
    z webu `typSloupku` neobsahuje, a bez něj se do nabídky žádný řádek se sloupky
    nepřidá. Musí zůstat pod blokem dílců, který `celkovyPocetDilcu` naplňuje. */
 const pocetSloupku = celkovyPocetDilcu * 2;

 if (data.typSloupku) {
   const typSloupkuLabel = sloupky[data.typSloupku] ?? data.typSloupku;
   ws.addRow([ti.typSloupku, typSloupkuLabel]);
   rows += buildProductRowsString(ti.typSloupku, typSloupkuLabel);

   if (data.typSloupku === "hliníkové") {
     /* Účtuje se 500 Kč/bm profilu (na sloupek počítáme 2 bm, proto je množství
        `pocetSloupku * 2`) a 300 Kč za krycí čepičku na kus — dohromady 1300 Kč
        na jeden sloupek. */
     const bmCena = 1000 * pocetSloupku;
     const cepickyCena = 300 * pocetSloupku;
     celkem += bmCena + cepickyCena;
     ws.addRow([ti.cenaBm, pocetSloupku * 2, money(bmCena), money(bmCena * sazbaDph), money(bmCena * (1 + sazbaDph))]);
     ws.addRow([ti.cenaCepicky, pocetSloupku, money(cepickyCena), money(cepickyCena * sazbaDph), money(cepickyCena * (1 + sazbaDph))]);
     rows += buildProductRows(money, ti.cenaBm, pocetSloupku * 2, bmCena, bmCena * sazbaDph, bmCena * (1 + sazbaDph));
     rows += buildProductRows(money, ti.cenaCepicky, pocetSloupku, cepickyCena, cepickyCena * sazbaDph, cepickyCena * (1 + sazbaDph));
     rows += tableHrRow();
   } else if (data.typSloupku === "betonové") {
     const povrchLabel = povrchy[String(data.povrchTvarnice)] ?? String(data.povrchTvarnice);
     const barvaTvarniceLabel = barvy[String(data.barvaTvarnice)] ?? String(data.barvaTvarnice);
     ws.addRow([ti.povrchTvarnice, povrchLabel]);
     ws.addRow([ti.barvaTvarnice, barvaTvarniceLabel]);
     rows += buildProductRowsString(ti.povrchTvarnice, povrchLabel);
     rows += buildProductRowsString(ti.barvaTvarnice, barvaTvarniceLabel);
   }
 }

 const barvaDilcuLabel = barvy[data.barva] ?? data.barva;
 const motivLabel = motivy[data.motiv] ?? data.motiv;
 
 celkem+= dopravaCena;

 // Sleva se počítá z celkové ceny bez DPH (včetně dopravy) a v nabídce se ukazuje
 // jako samostatný odečtený řádek — zákazník tak vidí původní cenu i to, kolik
 // ušetřil. Při `sale === 0` se oba slevové řádky vynechají úplně.
 const sl = saleLabels[lang] ?? saleLabels.cs;
 const slevaCastka = (celkem / 100) * sale;
 const celkemSeSlevou = celkem - slevaCastka;
 const slevaLabel = `${sl.sleva} ${sale} %`;

 ws.addRow([ti.barvaDilcu, barvaDilcuLabel]);
 ws.addRow([ti.motiv, motivLabel]);
 ws.addRow([ti.doprava, " ", money(dopravaCena), money(dopravaCena * sazbaDph), money(dopravaCena *(1+sazbaDph))])
 ws.addRow([ti.celkem, " ", money(celkem), money(celkem * sazbaDph), money(celkem *(1+sazbaDph))])

 rows+=(buildProductRowsString(ti.barvaDilcu, barvaDilcuLabel));
 rows+=(buildProductRowsString(ti.motiv, motivLabel));
 rows+=(buildProductRows(money, ti.doprava, " ", dopravaCena, (dopravaCena * sazbaDph), dopravaCena *(1+sazbaDph)))
 rows+=(buildProductRows(money, ti.celkem, " ", celkem, (celkem * sazbaDph), celkem *(1+sazbaDph)))

 if (sale > 0) {
   ws.addRow([slevaLabel, " ", money(-slevaCastka), money(-slevaCastka * sazbaDph), money(-slevaCastka *(1+sazbaDph))])
   ws.addRow([sl.celkemSeSlevou, " ", money(celkemSeSlevou), money(celkemSeSlevou * sazbaDph), money(celkemSeSlevou *(1+sazbaDph))])

   rows+=(buildProductRows(money, slevaLabel, " ", -slevaCastka, (-slevaCastka * sazbaDph), -slevaCastka *(1+sazbaDph)))
   rows+=(buildProductRows(money, sl.celkemSeSlevou, " ", celkemSeSlevou, (celkemSeSlevou * sazbaDph), celkemSeSlevou *(1+sazbaDph)))
 }

 ws.columns.forEach((col, index) => {
  if(index == 0){
     col.width = 40;
     col.alignment = { wrapText: true}
    }
  if(index > 0 && index < 5) col.width = 30
  if(index > 0 && index <= 3)col.alignment ={horizontal: "right"}
 })
 const fullHtml = htmlToPdf(data.fullname,data.email, data.phoneNumber, data.address, data.obec,photo1, photo2, photo3, rows, sazbaDph,data.message, data.company, lang)
 const tmpDir = os.tmpdir();
 // Jména musí být unikátní na volání: warm Vercel instance zvládne dvě poptávky
 // naráz a na pevném `kalkulace.xlsx` si navzájem přepíšou (nebo smažou) přílohy.
 // Zákazníkovi pak dorazí cizí kalkulace, nebo příloha chybí úplně.
 const tmpId = randomUUID();
 const filePath = path.join(tmpDir, `kalkulace-${tmpId}.xlsx`);
 const pdfFile = path.join(tmpDir, `kalkulace-${tmpId}.pdf`);
 const jsonPath = path.join(tmpDir, `data-${tmpId}.json`);
  ws.eachRow((row) => {
    const cell = row.getCell(1); // První sloupec (index 1)
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: "FFCCCCCC" } // Šedá barva pozadí
    };
    cell.font = {
      color: { argb: "FFFFFFFF" } // Černá barva textu (výchozí)
    };
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } }, // Bílé dolní ohraničení
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
    };
  });

  await wb.xlsx.writeFile(filePath).then(() => {
    console.log("✅ Excel vytvořen jako kalkulace.xlsx");
  });

  // Callbackové `fs.*` se nedají awaitovat — `await fs.writeFile(..., cb)` čeká na
  // `undefined` a jede dál, takže na pomalejším disku (Vercel /tmp) mohl nodemailer
  // sáhnout na ještě nenapsaný soubor. Promise API se čeká doopravdy.
  await fs.promises.writeFile(jsonPath, JSON.stringify(data, null, 2))

  // Když se PDF nevyrobí (na Vercelu např. nedostupný chromium-pack), nabídka
  // odejde bez něj — přílohu s neexistující cestou by nodemailer stejně shodil.
  let pdfOk = true
  try {
    await generatePdf(fullHtml, pdfFile)
    console.log("PDF vytvořeno!")
  } catch (error) {
    pdfOk = false
    console.error("Nepodařilo se vygenerovat PDF nabídky:", error)
  }

  return { filePath, pdfFile: pdfOk ? pdfFile : null, jsonPath }
}

// ---------------------------------------------------------------------------
// Serverové akce nástroje
// ---------------------------------------------------------------------------

export type ParseResult =
  | { success: true; data: ConfiguratorType }
  | { success: false; error: string; validationErrors?: Record<string, string[]> };

/**
 * Načtení `data.json` z e-mailu, který přišel z konfigurátoru na webu.
 *
 * Vrací rovnou hodnoty pro předvyplnění formuláře — konfigurátor se pak zobrazí
 * ve stejné podobě, v jaké ho odeslal zákazník, a obchodník v něm může cokoli
 * upravit před tím, než nabídku pošle dál.
 */
export async function parseConfJson(formData: FormData): Promise<ParseResult> {
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return { success: false, error: "Nevybrali jste žádný soubor" };
  }

  let jsonData: unknown;
  try {
    jsonData = JSON.parse(await file.text());
  } catch {
    return { success: false, error: "Soubor není platný JSON" };
  }

  const result = confSchema.safeParse(jsonData);

  if (!result.success) {
    // Poptávka z webu prošla stejným schématem, takže sem se dostane hlavně
    // starší export (jiná verze konfigurátoru) — vypsat, co konkrétně nesedí,
    // je jediná cesta, jak to poznat bez otevírání souboru v editoru.
    const validationErrors: Record<string, string[]> = {};
    for (const err of result.error.issues) {
      const key = err.path.join(".") || "(kořen)";
      (validationErrors[key] ??= []).push(err.message);
    }
    return { success: false, error: "Soubor neodpovídá schématu konfigurátoru", validationErrors };
  }

  return { success: true, data: result.data };
}

/**
 * Odeslání nabídky se slevou. Kopíruje `sendConf` z new-konstanta — stejný
 * příjemce, stejné přílohy (XLSX, PDF, data.json), stejný e-mail `ConfMail` —
 * jen navíc protahuje `sale` do `createXlsx`.
 */
export async function sendConfWithSale(
  values: ConfiguratorType,
  sale: number,
  langValue?: string
): Promise<ActionResponse<ConfiguratorType>> {
  const transporter = smtp();
  const lang = getLang(langValue);

  try {
    const validatedData = confSchema.safeParse(values);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Některá pole nejsou vyplněná dobře",
        errors: validatedData.error.flatten().fieldErrors,
        inputs: values,
      };
    }

    // Sleva chodí z formuláře jako číslo, ale i tak ji ořízneme — záporná nebo
    // stodvacetiprocentní sleva by se tiše propsala do nabídky pro zákazníka.
    const slevaPct = Number.isFinite(sale) ? Math.min(100, Math.max(0, sale)) : 0;

    const photos = await sanityFetch<ConfPhotos>({ query: CONF_IMGS_QUERY });

    const data = validatedData.data;
    const isCompany = data.company && data.company.length > 0 ? true : false;
    // Prázdná pole vrací GROQ jako null a chybějící dokument jako undefined —
    // `htmlToPdf` si prázdnou fotku odfiltruje sám.
    const brankaFoto = photos?.branka?.[0] ?? "";
    const branaFoto = photos?.dvoukridla?.[0] ?? "";
    const plotFoto = photos?.ploty?.[0] ?? "";
    if (!brankaFoto || !branaFoto || !plotFoto) {
      console.warn("CONF_IMGS_QUERY nevrátil všechny ilustrační fotky:", {
        branka: photos?.branka?.length ?? 0,
        dvoukridla: photos?.dvoukridla?.length ?? 0,
        ploty: photos?.ploty?.length ?? 0,
      });
    }

    const soubory = await createXlsx(data, isCompany, brankaFoto, branaFoto, plotFoto, slevaPct, lang);
    if (!soubory) {
      console.error("Chyba: createXlsx nevrátil platnou cestu k souboru.");
      return { success: false, message: "Nepodařilo se vytvořit soubor s kalkulací." };
    }

    const html = await render(
      ConfMail({
        userName: data.fullname,
        userEmail: data.email,
        tel: data.phoneNumber,
        address: data.address,
        city: data.obec,
        msg: data.message,
        zip: data.zip,
        company: data.company,
        photos: photos,
        data: data,
        lang,
      })
    );

    const mailOptions: any //eslint-disable-line @typescript-eslint/no-explicit-any
      = {
      from: process.env.FROM_EMAIL,
      to: "nabidky@konstantahp.cz",
      //to: "adam.hitzger@icloud.com",
      subject: `Nabídka se slevou ${slevaPct} % - ${data.fullname}`,
      html,
      attachments: [
        { filename: "kalkulace.xlsx", path: soubory.filePath },
        // `pdfFile` je null, když se PDF nevygenerovalo — přílohu s neexistující
        // cestou by nodemailer shodil, tak ji radši vynecháme.
        ...(soubory.pdfFile ? [{ filename: "kalkulace.pdf", path: soubory.pdfFile }] : []),
        { filename: "data.json", path: soubory.jsonPath },
      ],
    };

    const sendMail = await transporter.sendMail(mailOptions);

    await Promise.all(
      [soubory.filePath, soubory.pdfFile, soubory.jsonPath]
        .filter((p): p is string => Boolean(p))
        .map((p) =>
          fs.promises.unlink(p).catch((err) => {
            console.error(`Nepodařilo se smazat dočasný soubor ${p}:`, err);
          })
        )
    );

    console.log(sendMail.messageId);
    console.log(sendMail.response);

    if (sendMail.accepted) {
      return { success: true, message: `Nabídka se slevou ${slevaPct} % odeslána.` };
    }
    return { success: false, message: "Nepodařilo se odeslat e-mail. Zkuste to znovu" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Nepovedlo se odeslat nabídku" };
  }
}
