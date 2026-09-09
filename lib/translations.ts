/**
 * Statický obsah webu ve třech jazycích (cs/sk/de). Žádná i18n knihovna —
 * jazyk se čte server-side z URL parametru `?lang=` na úrovni `page.tsx`
 * a posílá se dolů jako prop `lang` do komponent. V komponentě se pak text
 * vybírá stylem:
 *
 *   const t = heroContent[lang as keyof typeof heroContent] ?? heroContent.cs
 *
 * Struktura: jeden `export const` objekt na sekci/komponentu, klíčovaný cs/sk/de.
 */

export type Lang = "cs" | "sk" | "de"

export const LANGS: Lang[] = ["cs", "sk", "de"]

export function getLang(value?: string | string[]): Lang {
  const v = Array.isArray(value) ? value[0] : value
  return v === "sk" || v === "de" ? v : "cs"
}

/**
 * Appends `?lang=` to an internal href so cross-page links (nav, footer, CTAs)
 * keep the current language instead of silently falling back to cs. `cs` is
 * the default, so it's left off. Handles hrefs that already carry a `#hash`
 * or a `?query`.
 */
export function withLang(href: string, lang: Lang): string {
  if (lang === "cs") return href
  const hashIndex = href.indexOf("#")
  const path = hashIndex === -1 ? href : href.slice(0, hashIndex)
  const hash = hashIndex === -1 ? "" : href.slice(hashIndex)
  const separator = path.includes("?") ? "&" : "?"
  return `${path}${separator}lang=${lang}${hash}`
}

/**
 * Rok založení firmy. Drží se na jednom místě, protože se z něj počítá délka
 * působení v hero badge — číslo se tak přetáčí samo každý rok a nemůže se
 * rozejít s textem „rodinná firma od roku 2022" na /o-nas.
 */
export const FOUNDED_YEAR = 2022

/** Kolik let firma funguje. Minimálně 1, ať badge nikdy neukazuje 0 nebo minus. */
export function yearsInBusiness(now: Date = new Date()): number {
  return Math.max(1, now.getFullYear() - FOUNDED_YEAR)
}

export const langNames: Record<Lang, { label: string; short: string }> = {
  cs: { label: "Čeština", short: "CZ" },
  sk: { label: "Slovenčina", short: "SK" },
  de: { label: "Deutsch", short: "DE" },
}

export const langSelectorContent = {
  cs: { aria: "Vyberte jazyk" },
  sk: { aria: "Vyberte jazyk" },
  de: { aria: "Sprache wählen" },
}

// ---------------------------------------------------------------------------
// NAV (site-header.tsx + nav/nav-data.ts)
// ---------------------------------------------------------------------------

export type NavLeafContent = { label: string; desc: string }
export type NavContent = {
  jsmeKonstanta: string
  jsmeKonstantaChildren: NavLeafContent[]
  coNabizime: string
  coNabizimeChildren: NavLeafContent[]
  realizace: string
  konfigurator: string
  proFirmy: string
  kontakty: string
  cta: string
  ctaShort: string
  openMenu: string
  closeMenu: string
  mainMenu: string
  menu: string
}

export const navContent: Record<Lang, NavContent> = {
  cs: {
    jsmeKonstanta: "Jsme Konstanta",
    jsmeKonstantaChildren: [
      { label: "Jsme Konstanta", desc: "Kdo jsme a čemu věříme" },
      { label: "Síla Konstanty", desc: "10 pilířů naší práce" },
      { label: "Co oceníte", desc: "Nejdůležitější v kostce" },
      { label: "Jak to u nás probíhá", desc: "Postup od zaměření po montáž" },
      { label: "Certifikáty a patenty", desc: "Patent, materiály, ocenění" },
      { label: "FAQ", desc: "Časté dotazy a odpovědi" },
    ],
    coNabizime: "Co nabízíme",
    coNabizimeChildren: [
      { label: "Ploty", desc: "Hliníkové ploty na míru" },
      { label: "Brány a branky", desc: "Posuvné, křídlové, s pohonem" },
      { label: "Pergoly", desc: "Bioklimatické s lamelami" },
      { label: "Přípravné práce", desc: "Základy a podezdívky" },
      { label: "Chytrá řešení", desc: "Automatizace a technologie" },
      { label: "Subdodávky", desc: "Pro firmy a partnery" },
    ],
    realizace: "Realizace",
    konfigurator: "Konfigurátor",
    proFirmy: "Pro firmy",
    kontakty: "Kontakty",
    cta: "Poptat řešení",
    ctaShort: "Poptat",
    openMenu: "Otevřít menu",
    closeMenu: "Zavřít menu",
    mainMenu: "Hlavní menu",
    menu: "Menu",
  },
  sk: {
    jsmeKonstanta: "Sme Konstanta",
    jsmeKonstantaChildren: [
      { label: "Sme Konstanta", desc: "Kto sme a čomu veríme" },
      { label: "Sila Konstanty", desc: "10 pilierov našej práce" },
      { label: "Čo oceníte", desc: "Najdôležitejšie v skratke" },
      { label: "Ako to u nás prebieha", desc: "Postup od zamerania po montáž" },
      { label: "Certifikáty a patenty", desc: "Patent, materiály, ocenenia" },
      { label: "FAQ", desc: "Časté otázky a odpovede" },
    ],
    coNabizime: "Čo ponúkame",
    coNabizimeChildren: [
      { label: "Ploty", desc: "Hliníkové ploty na mieru" },
      { label: "Brány a bránky", desc: "Posuvné, krídlové, s pohonom" },
      { label: "Pergoly", desc: "Bioklimatické s lamelami" },
      { label: "Prípravné práce", desc: "Základy a podmurovky" },
      { label: "Inteligentné riešenia", desc: "Automatizácia a technológie" },
      { label: "Subdodávky", desc: "Pre firmy a partnerov" },
    ],
    realizace: "Realizácie",
    konfigurator: "Konfigurátor",
    proFirmy: "Pre firmy",
    kontakty: "Kontakty",
    cta: "Dopytovať riešenie",
    ctaShort: "Dopytovať",
    openMenu: "Otvoriť menu",
    closeMenu: "Zavrieť menu",
    mainMenu: "Hlavné menu",
    menu: "Menu",
  },
  de: {
    jsmeKonstanta: "Wir sind Konstanta",
    jsmeKonstantaChildren: [
      { label: "Wir sind Konstanta", desc: "Wer wir sind und woran wir glauben" },
      { label: "Die Stärke von Konstanta", desc: "10 Grundsätze unserer Arbeit" },
      { label: "Das schätzen Sie", desc: "Das Wichtigste auf einen Blick" },
      { label: "Ablauf bei uns", desc: "Vom Aufmaß bis zur Montage" },
      { label: "Zertifikate und Patente", desc: "Patent, Materialien, Auszeichnungen" },
      { label: "FAQ", desc: "Häufige Fragen und Antworten" },
    ],
    coNabizime: "Unser Angebot",
    coNabizimeChildren: [
      { label: "Zäune", desc: "Maßgefertigte Aluminiumzäune" },
      { label: "Tore und Türen", desc: "Schiebe-, Flügeltore, mit Antrieb" },
      { label: "Pergolen", desc: "Bioklimatisch mit Lamellen" },
      { label: "Vorbereitende Arbeiten", desc: "Fundamente und Sockelmauern" },
      { label: "Smarte Lösungen", desc: "Automatisierung und Technik" },
      { label: "Zulieferungen", desc: "Für Firmen und Partner" },
    ],
    realizace: "Referenzen",
    konfigurator: "Konfigurator",
    proFirmy: "Für Firmen",
    kontakty: "Kontakt",
    cta: "Angebot anfragen",
    ctaShort: "Anfragen",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    mainMenu: "Hauptmenü",
    menu: "Menü",
  },
}

// ---------------------------------------------------------------------------
// PLOVOUCÍ LIŠTA POPTÁVKY (fixed-icons.tsx)
// ---------------------------------------------------------------------------

/** Popisky bočních plovoucích tlačítek — vlevo kontakt, vpravo svislá kalkulace. */
export const fixedIconsContent = {
  cs: {
    calc: "Kalkulace zdarma",
    call: "Zavolejte nám",
    write: "Napište nám",
  },
  sk: {
    calc: "Kalkulácia zdarma",
    call: "Zavolajte nám",
    write: "Napíšte nám",
  },
  de: {
    calc: "Kostenlose Kalkulation",
    call: "Rufen Sie uns an",
    write: "Schreiben Sie uns",
  },
} as const

// ---------------------------------------------------------------------------
// FOOTER (site-footer.tsx)
// ---------------------------------------------------------------------------

export const footerContent = {
  cs: {
    tagline: "Výroba a montáž moderních hliníkových plotů, bran, branek a pergol na míru po celé České republice.",
    coNabizime: "Co nabízíme",
    jsmeKonstanta: "Jsme Konstanta",
    kontakt: "Kontakt",
    fakturacniUdaje: "Fakturační údaje",
    productLinks: ["Ploty", "Brány a branky", "Pergoly", "Přípravné práce", "Chytrá řešení", "Subdodávky"],
    companyLinks: [
      "Jsme Konstanta",
      "Síla Konstanty",
      "Co oceníte",
      "Jak to u nás probíhá",
      "Certifikáty a patenty",
      "FAQ",
      "Realizace",
      "Pro firmy",
      "Kontakty",
    ],
    contactGroups: [
      { title: "Zaměření a obchod" },
      { title: "Fakturace, kalkulace, nabídky" },
      { title: "Výroba a technické řešení" },
    ],
    sidlo: "Sídlo:",
    rights: "Všechna práva vyhrazena.",
    bottomTagline: "Hliníkové ploty na míru",
  },
  sk: {
    tagline: "Výroba a montáž moderných hliníkových plotov, brán, bránok a pergol na mieru po celom Česku.",
    coNabizime: "Čo ponúkame",
    jsmeKonstanta: "Sme Konstanta",
    kontakt: "Kontakt",
    fakturacniUdaje: "Fakturačné údaje",
    productLinks: ["Ploty", "Brány a bránky", "Pergoly", "Prípravné práce", "Inteligentné riešenia", "Subdodávky"],
    companyLinks: [
      "Sme Konstanta",
      "Sila Konstanty",
      "Čo oceníte",
      "Ako to u nás prebieha",
      "Certifikáty a patenty",
      "FAQ",
      "Realizácie",
      "Pre firmy",
      "Kontakty",
    ],
    contactGroups: [
      { title: "Zameranie a obchod" },
      { title: "Fakturácia, kalkulácie, ponuky" },
      { title: "Výroba a technické riešenia" },
    ],
    sidlo: "Sídlo:",
    rights: "Všetky práva vyhradené.",
    bottomTagline: "Hliníkové ploty na mieru",
  },
  de: {
    tagline:
      "Herstellung und Montage moderner, maßgefertigter Aluminiumzäune, Tore, Türen und Pergolen in ganz Tschechien.",
    coNabizime: "Unser Angebot",
    jsmeKonstanta: "Wir sind Konstanta",
    kontakt: "Kontakt",
    fakturacniUdaje: "Rechnungsangaben",
    productLinks: ["Zäune", "Tore und Türen", "Pergolen", "Vorbereitende Arbeiten", "Smarte Lösungen", "Zulieferungen"],
    companyLinks: [
      "Wir sind Konstanta",
      "Die Stärke von Konstanta",
      "Das schätzen Sie",
      "Ablauf bei uns",
      "Zertifikate und Patente",
      "FAQ",
      "Referenzen",
      "Für Firmen",
      "Kontakt",
    ],
    contactGroups: [
      { title: "Aufmaß und Vertrieb" },
      { title: "Rechnungsstellung, Kalkulation, Angebote" },
      { title: "Fertigung und technische Lösungen" },
    ],
    sidlo: "Sitz:",
    rights: "Alle Rechte vorbehalten.",
    bottomTagline: "Maßgefertigte Aluminiumzäune",
  },
}

// ---------------------------------------------------------------------------
// HERO (hero.tsx) + HorizontalGallery.tsx (sdílí highlights/metaLeft/subtitle)
// ---------------------------------------------------------------------------

export const heroContent = {
  cs: {
    metaLeft: "KONSTANTA - hliníkové ploty s.r.o. · IČO 21827150 · CZ",
    metaRight: `Hliníkové oplocení na míru · Est. ${FOUNDED_YEAR}`,
    titleLines: ["Ploty,", "které", "vydrží."],
    subtitle:
      "Navrhujeme, vyrábíme a montujeme moderní hliníkové oplocení, brány, branky a pergoly přesně na míru vašemu domu. Bez kompromisů.",
    highlights: ["Bezúdržbový hliník", "Výroba na míru", "Montáž po celé ČR"],
    ctaPrimary: "Kalkulace zdarma",
    ctaSecondary: "Prohlédnout produkty",
    prevAlt: "Předchozí fotka",
    nextAlt: "Další fotka",
    goToAlt: (n: number) => `Přejít na fotku ${n}`,
    /** Číslo i tvar slova se počítají z FOUNDED_YEAR — badge se přetáčí sám. */
    badgeNumber: (years: number) => String(years),
    badgeText: (years: number) =>
      `${years === 1 ? "rok" : years < 5 ? "roky" : "let"} zkušeností`,
    slideAlts: [
      "Moderní hliníkový plot před rodinným domem",
      "Hliníková posuvná brána u moderního domu",
      "Hliníkový plot v dekoru dřeva kolem zahrady",
    ],
  },
  sk: {
    metaLeft: "KONSTANTA - hliníkové ploty s.r.o. · IČO 21827150 · CZ",
    metaRight: `Hliníkové oplotenie na mieru · Est. ${FOUNDED_YEAR}`,
    titleLines: ["Ploty,", "ktoré", "vydržia."],
    subtitle:
      "Navrhujeme, vyrábame a montujeme moderné hliníkové oplotenie, brány, bránky a pergoly presne na mieru vášmu domu. Bez kompromisov.",
    highlights: ["Bezúdržbový hliník", "Výroba na mieru", "Montáž po celom Česku"],
    ctaPrimary: "Kalkulácia zadarmo",
    ctaSecondary: "Prezrieť produkty",
    prevAlt: "Predchádzajúca fotka",
    nextAlt: "Ďalšia fotka",
    goToAlt: (n: number) => `Prejsť na fotku ${n}`,
    badgeNumber: (years: number) => String(years),
    badgeText: (years: number) =>
      `${years === 1 ? "rok" : years < 5 ? "roky" : "rokov"} skúseností`,
    slideAlts: [
      "Moderný hliníkový plot pred rodinným domom",
      "Hliníková posuvná brána pri modernom dome",
      "Hliníkový plot v dekore dreva okolo záhrady",
    ],
  },
  de: {
    metaLeft: "KONSTANTA - hliníkové ploty s.r.o. · IČO 21827150 · CZ",
    metaRight: `Maßgefertigte Aluminiumzäune · Seit ${FOUNDED_YEAR}`,
    titleLines: ["Zäune,", "die", "halten."],
    subtitle:
      "Wir entwerfen, fertigen und montieren moderne Aluminiumzäune, Tore, Türen und Pergolen exakt nach Maß für Ihr Zuhause. Ohne Kompromisse.",
    highlights: ["Wartungsfreies Aluminium", "Maßanfertigung", "Montage in ganz Tschechien"],
    ctaPrimary: "Kostenlose Kalkulation",
    ctaSecondary: "Produkte ansehen",
    prevAlt: "Vorheriges Bild",
    nextAlt: "Nächstes Bild",
    goToAlt: (n: number) => `Zu Bild ${n} wechseln`,
    badgeNumber: (years: number) => String(years),
    badgeText: (years: number) => (years === 1 ? "Jahr Erfahrung" : "Jahre Erfahrung"),
    slideAlts: [
      "Moderner Aluminiumzaun vor einem Einfamilienhaus",
      "Aluminium-Schiebetor an einem modernen Haus",
      "Aluminiumzaun in Holzdekor rund um den Garten",
    ],
  },
}

export const galleryContent = {
  cs: {
    titles: ["PLOTY", "BRÁNY", "BRANKY", "PERGOLY"],
    labels: ["Hliníkové ploty", "Hliníkové brány", "Hliníkové branky", "Hliníkové pergoly"],
    kicker: "Hliníkové oplocení na míru",
    cta: "Nezávazná kalkulace",
    /* Popisek klikatelného nadpisu snímku — nadpis vede rovnou na svou kategorii
       v galerii realizací, ať nikdo nemusí odscrollovat celou lištu. */
    slideCta: "Prohlédnout realizace",
  },
  sk: {
    titles: ["PLOTY", "BRÁNY", "BRÁNKY", "PERGOLY"],
    labels: ["Hliníkové ploty", "Hliníkové brány", "Hliníkové bránky", "Hliníkové pergoly"],
    kicker: "Hliníkové oplotenie na mieru",
    cta: "Nezáväzná kalkulácia",
    slideCta: "Prezrieť realizácie",
  },
  de: {
    titles: ["ZÄUNE", "TORE", "TÜREN", "PERGOLEN"],
    labels: ["Aluminiumzäune", "Aluminiumtore", "Aluminiumtüren", "Aluminiumpergolen"],
    kicker: "Maßgefertigte Aluminiumzäune",
    cta: "Unverbindliche Kalkulation",
    slideCta: "Referenzen ansehen",
  },
}

// ---------------------------------------------------------------------------
// STATS (stats.tsx)
// ---------------------------------------------------------------------------

export const statsContent = {
  cs: [
    { code: "[ 01 ]", title: "Výroba na míru", text: "Každý plot navrhujeme přesně podle vašeho pozemku a domu." },
    { code: "[ 02 ]", title: "Bezúdržbový hliník", text: "Nereziví, nehnije a barva drží roky bez nátěrů." },
    { code: "[ 03 ]", title: "Montáž po celé ČR", text: "Zaměření, doprava i montáž zajistíme kompletně sami." },
    { code: "[ 04 ]", title: "Vlastní realizace", text: "Vše máme plně v naší režii – od základů po finální montáž." },
  ],
  sk: [
    { code: "[ 01 ]", title: "Výroba na mieru", text: "Každý plot navrhujeme presne podľa vášho pozemku a domu." },
    { code: "[ 02 ]", title: "Bezúdržbový hliník", text: "Nehrdzavie, nehnije a farba vydrží roky bez náterov." },
    { code: "[ 03 ]", title: "Montáž po celom Česku", text: "Zameranie, dopravu aj montáž zabezpečíme kompletne sami." },
    { code: "[ 04 ]", title: "Vlastná realizácia", text: "Všetko máme plne vo vlastnej réžii – od základov po finálnu montáž." },
  ],
  de: [
    { code: "[ 01 ]", title: "Maßanfertigung", text: "Jeden Zaun planen wir exakt nach Ihrem Grundstück und Haus." },
    { code: "[ 02 ]", title: "Wartungsfreies Aluminium", text: "Rostet nicht, verrottet nicht, die Farbe hält jahrelang ohne Anstrich." },
    { code: "[ 03 ]", title: "Montage in ganz Tschechien", text: "Aufmaß, Transport und Montage übernehmen wir komplett selbst." },
    { code: "[ 04 ]", title: "Eigene Umsetzung", text: "Alles liegt vollständig in unserer eigenen Hand – vom Fundament bis zur finalen Montage." },
  ],
}

// ---------------------------------------------------------------------------
// PRODUCTS (products.tsx)
// ---------------------------------------------------------------------------

export const productsContent = {
  cs: {
    heading: "Kompletní hliníkové oplocení na míru",
    badge: "4 produktové řady",
    /* Hlavní konverzní akce karty — vede do konfigurátoru, proto je vysázená jako tlačítko. */
    cta: "Poptat",
    /* Sekundární akce — celá karta vede sem (galerie realizací dané kategorie). */
    galleryCta: "Prohlédnout realizace",
    items: [
      { title: "Hliníkové ploty", tags: ["Bezúdržbové", "Moderní vzhled", "Odolnost"], text: "Moderní bezúdržbové oplocení, které ochrání vaše soukromí a dodá domu reprezentativní vzhled. Vlastní patentovaný systém profilů drží pevnost i odolnost bez další péče." },
      { title: "Brány", tags: ["Posuvné", "Křídlové", "S pohonem"], text: "Vjezdové brány navrhujeme přesně na míru vašemu plotu i stavební připravenosti. Posuvná i křídlová řešení s tichými prověřenými pohony na dálkové ovládání." },
      { title: "Branky", tags: ["Na míru", "Elektrozámek", "Design"], text: "Vstupní branky sladěné s plotem i bránou do jednoho celku. Doplníme je o elektrozámek, videotelefon nebo chytrou správu přístupu." },
      { title: "Pergoly", tags: ["Bioklimatické", "Lamely", "Stínění"], text: "Bioklimatické pergoly s otočnými lamelami. Plně ovládáte stínění, proudění vzduchu i ochranu před deštěm — komfort pro celoroční pobyt venku." },
    ],
  },
  sk: {
    heading: "Kompletné hliníkové oplotenie na mieru",
    badge: "4 produktové rady",
    cta: "Dopytovať",
    galleryCta: "Prezrieť realizácie",
    items: [
      { title: "Hliníkové ploty", tags: ["Bezúdržbové", "Moderný vzhľad", "Odolnosť"], text: "Moderné bezúdržbové oplotenie, ktoré ochráni vaše súkromie a dodá domu reprezentatívny vzhľad. Vlastný patentovaný systém profilov drží pevnosť aj odolnosť bez ďalšej starostlivosti." },
      { title: "Brány", tags: ["Posuvné", "Krídlové", "S pohonom"], text: "Vjazdové brány navrhujeme presne na mieru vášmu plotu aj stavebnej pripravenosti. Posuvné aj krídlové riešenia s tichými overenými pohonmi na diaľkové ovládanie." },
      { title: "Bránky", tags: ["Na mieru", "Elektrozámok", "Dizajn"], text: "Vstupné bránky zladené s plotom aj bránou do jedného celku. Doplníme ich o elektrozámok, videotelefón alebo inteligentnú správu prístupu." },
      { title: "Pergoly", tags: ["Bioklimatické", "Lamely", "Tienenie"], text: "Bioklimatické pergoly s otočnými lamelami. Plne ovládate tienenie, prúdenie vzduchu aj ochranu pred dažďom — komfort pre celoročný pobyt vonku." },
    ],
  },
  de: {
    heading: "Komplette Aluminiumzäune nach Maß",
    badge: "4 Produktreihen",
    cta: "Anfragen",
    galleryCta: "Referenzen ansehen",
    items: [
      { title: "Aluminiumzäune", tags: ["Wartungsfrei", "Modernes Design", "Langlebig"], text: "Moderne, wartungsfreie Einfriedung, die Ihre Privatsphäre schützt und dem Haus ein repräsentatives Aussehen gibt. Unser patentiertes Profilsystem sichert Festigkeit und Widerstandsfähigkeit ganz ohne Pflege." },
      { title: "Tore", tags: ["Schiebetore", "Flügeltore", "Mit Antrieb"], text: "Einfahrtstore planen wir exakt nach Ihrem Zaun und der baulichen Vorbereitung. Schiebe- und Flügellösungen mit leisen, bewährten Antrieben und Fernbedienung." },
      { title: "Türen", tags: ["Nach Maß", "Elektroschloss", "Design"], text: "Eingangstüren, die mit Zaun und Tor eine Einheit bilden. Auf Wunsch mit Elektroschloss, Video-Türsprechanlage oder smarter Zutrittsverwaltung." },
      { title: "Pergolen", tags: ["Bioklimatisch", "Lamellen", "Beschattung"], text: "Bioklimatische Pergolen mit drehbaren Lamellen. Sie steuern Beschattung, Luftstrom und Regenschutz vollständig — Komfort für das ganze Jahr im Freien." },
    ],
  },
}

// ---------------------------------------------------------------------------
// PROCESS (process.tsx)
// ---------------------------------------------------------------------------

export const processContent = {
  cs: {
    heading: "Průběh realizace krok za krokem",
    steps: [
      { num: "01", title: "Zaměření a kalkulace", text: "První schůzku, zaměření i kalkulaci máte zcela zdarma. Projdeme si vaše představy, doporučíme vhodné řešení a navrhneme přesný rozpočet." },
      { num: "02", title: "Příprava základů", text: "Připravíme a vybetonujeme základy pro pevné a rovné osazení konstrukce, aby plot dokonale držel po celá desetiletí." },
      { num: "03", title: "Zdění", text: "Vyzdíme podezdívku a sloupky tak, aby šlo vše jednoduše a milimetrově přesně smontovat a výsledek působil čistě." },
      { num: "04", title: "Montáž", text: "Hliníkové dílce, brány a branky odborně sestavíme a osadíme přímo na místě. Dbáme na detail a perfektní funkci." },
      { num: "05", title: "Spokojený zákazník", text: "Spokojený zákazník je pro nás tou nejlepší odměnou a nejlepší referencí. Předáme hotové dílo a jsme tu i nadále k dispozici." },
    ],
  },
  sk: {
    heading: "Priebeh realizácie krok za krokom",
    steps: [
      { num: "01", title: "Zameranie a kalkulácia", text: "Prvé stretnutie, zameranie aj kalkuláciu máte úplne zadarmo. Prejdeme si vaše predstavy, odporučíme vhodné riešenie a navrhneme presný rozpočet." },
      { num: "02", title: "Príprava základov", text: "Pripravíme a vybetónujeme základy pre pevné a rovné osadenie konštrukcie, aby plot dokonale vydržal celé desaťročia." },
      { num: "03", title: "Murovanie", text: "Vymurujeme podmurovku a stĺpiky tak, aby sa dalo všetko jednoducho a milimetrovo presne zmontovať a výsledok pôsobil čisto." },
      { num: "04", title: "Montáž", text: "Hliníkové dielce, brány a bránky odborne zostavíme a osadíme priamo na mieste. Dbáme na detail a bezchybnú funkciu." },
      { num: "05", title: "Spokojný zákazník", text: "Spokojný zákazník je pre nás tou najlepšou odmenou a najlepšou referenciou. Odovzdáme hotové dielo a sme naďalej k dispozícii." },
    ],
  },
  de: {
    heading: "Der Ablauf Schritt für Schritt",
    steps: [
      { num: "01", title: "Aufmaß und Kalkulation", text: "Das erste Treffen, Aufmaß und Kalkulation sind für Sie völlig kostenlos. Wir besprechen Ihre Vorstellungen, empfehlen die passende Lösung und erstellen ein genaues Angebot." },
      { num: "02", title: "Fundament vorbereiten", text: "Wir bereiten das Fundament vor und betonieren es, damit die Konstruktion fest und gerade steht und der Zaun jahrzehntelang hält." },
      { num: "03", title: "Mauerarbeiten", text: "Wir mauern Sockel und Pfeiler so, dass sich alles einfach und millimetergenau montieren lässt und das Ergebnis sauber wirkt." },
      { num: "04", title: "Montage", text: "Aluminiumelemente, Tore und Türen bauen wir fachgerecht zusammen und montieren sie direkt vor Ort. Wir achten auf jedes Detail und perfekte Funktion." },
      { num: "05", title: "Zufriedener Kunde", text: "Ein zufriedener Kunde ist für uns die beste Belohnung und beste Referenz. Wir übergeben das fertige Werk und stehen auch danach zur Verfügung." },
    ],
  },
}

// ---------------------------------------------------------------------------
// WHY US (why-us.tsx)
// ---------------------------------------------------------------------------

export const whyUsContent = {
  cs: {
    heading: "Česká firma, která upřednostňuje kvalitu před kvantitou",
    paragraph:
      "Jsme KONSTANTA - hliníkové ploty s.r.o. – tým, který bere každou zakázku osobně. Veškeré produkty máme plně ve vlastní režii, a proto můžeme garantovat kvalitu i dlouhou životnost každého plotu.",
    reasons: [
      "Vyrábíme i montujeme vše ve vlastní režii",
      "Garance kvality a maximální spokojenosti",
      "Hliník bez nutnosti údržby a nátěrů",
      "Řešení na míru i pro atypické pozemky",
    ],
    ctaAbout: "O Konstantě",
    ctaContact: "Nezávazná kalkulace",
  },
  sk: {
    heading: "Česká firma, ktorá uprednostňuje kvalitu pred kvantitou",
    paragraph:
      "Sme KONSTANTA - hliníkové ploty s.r.o. – tím, ktorý berie každú zákazku osobne. Všetky produkty máme plne vo vlastnej réžii, a preto môžeme garantovať kvalitu aj dlhú životnosť každého plota.",
    reasons: [
      "Vyrábame aj montujeme všetko vo vlastnej réžii",
      "Garancia kvality a maximálnej spokojnosti",
      "Hliník bez nutnosti údržby a náterov",
      "Riešenia na mieru aj pre atypické pozemky",
    ],
    ctaAbout: "O Konstante",
    ctaContact: "Nezáväzná kalkulácia",
  },
  de: {
    heading: "Ein tschechisches Unternehmen, das Qualität vor Quantität stellt",
    paragraph:
      "Wir sind KONSTANTA - hliníkové ploty s.r.o. – ein Team, dem jeder Auftrag persönlich am Herzen liegt. Alle Produkte fertigen wir vollständig in Eigenregie und garantieren so Qualität und lange Lebensdauer jedes Zauns.",
    reasons: [
      "Wir fertigen und montieren alles in Eigenregie",
      "Garantierte Qualität und höchste Zufriedenheit",
      "Aluminium ganz ohne Wartung und Anstrich",
      "Maßlösungen auch für ungewöhnliche Grundstücke",
    ],
    ctaAbout: "Über Konstanta",
    ctaContact: "Unverbindliche Kalkulation",
  },
}

// ---------------------------------------------------------------------------
// REALIZACE (realizace.tsx)
// ---------------------------------------------------------------------------

export const realizaceContent = {
  cs: {
    heading: "Naše realizace",
    cta: "Všechny realizace",
    items: [
      { title: "Hliníkový plot", place: "Rodinný dům, Brno", motif: "Tahokov" },
      { title: "Plot s posuvnou bránou", place: "Novostavba, Praha-západ", motif: "Plaňka 90" },
      { title: "Plot v dekoru dřeva", place: "Vila, Olomouc", motif: "Okenice standard" },
    ],
  },
  sk: {
    heading: "Naše realizácie",
    cta: "Všetky realizácie",
    items: [
      { title: "Hliníkový plot", place: "Rodinný dom, Brno", motif: "Ťahokov" },
      { title: "Plot s posuvnou bránou", place: "Novostavba, Praha-západ", motif: "Latka 90" },
      { title: "Plot v dekore dreva", place: "Vila, Olomouc", motif: "Okenica štandard" },
    ],
  },
  de: {
    heading: "Unsere Referenzen",
    cta: "Alle Referenzen",
    items: [
      { title: "Aluminiumzaun", place: "Einfamilienhaus, Brünn", motif: "Streckmetall" },
      { title: "Zaun mit Schiebetor", place: "Neubau, Prag-West", motif: "Lamelle 90" },
      { title: "Zaun in Holzdekor", place: "Villa, Olmütz", motif: "Fensterladen Standard" },
    ],
  },
}

// ---------------------------------------------------------------------------
// REALIZACE — samostatná stránka /realizace (app/realizace/page.tsx)
// `cats` je klíčované stejnými id jako REALIZACE_CATS v lib/realizace.ts.
// ---------------------------------------------------------------------------

export const realizacePageContent = {
  cs: {
    kicker: "Realizace",
    heading: "Realizace, které stojí za podívanou",
    subtitle:
      "Reálné zakázky, ne vizualizace. Projděte si ploty, brány, pergoly i zábradlí podle motivu a výplně — a představte si, jak by to vypadalo u vás.",
    photoCount: (n: number) => `${n} ${n === 1 ? "fotka" : n < 5 ? "fotky" : "fotek"}`,
    openGallery: "Otevřít galerii",
    loadMore: (n: number) => `Zobrazit další fotky (${n})`,
    empty: "Fotky téhle kategorie právě doplňujeme.",
    emptyAll: "Fotky realizací právě doplňujeme. Ozvěte se nám, rádi vám je pošleme.",
    cats: {
      ploty: {
        tab: "Ploty",
        heading: "Realizace plotů",
        text: "Hliníkové ploty na míru představují moderní bezúdržbová řešení, které dokonale ochrání vaše soukromí a dodají nemovitosti reprezentativní vzhled. Díky vlastnímu patentovanému systému profilů vynikají maximální pevností, stabilitou a odolností vůči všem povětrnostním vlivům bez nutnosti jakékoliv další péče.",
      },
      brany: {
        tab: "Brány",
        heading: "Realizace bran",
        text: "Vjezdové brány navrhujeme přesně na míru vašemu plotu i stavební připravenosti. Nabízíme spolehlivá posuvná i křídlová řešení, a to včetně tichých a prověřených pohonů s dálkovým ovládáním či chytrou správou přístupu.",
      },
      branky: {
        tab: "Branky",
        heading: "Realizace branek",
        text: "Vstupní branky ladíme s plotem i bránou do jednoho celku — stejná výplň, stejný motiv, stejná barva. Doplníme je elektrickým zámkem, videozvonkem nebo čtečkou čipů, ať se dostanete dovnitř bez klíče a bez kompromisu ve vzhledu.",
      },
      pergoly: {
        tab: "Pergoly",
        heading: "Realizace pergol",
        text: "Bioklimatické pergoly s otočnými lamelami vám umožní plně kontrolovat stínění, proudění vzduchu i ochranu před deštěm na vaší terase. Spojují v sobě špičkový design, prvotřídní hliníkovou konstrukci a maximální komfort pro celoroční pobyt venku.",
      },
      zabradli: {
        tab: "Zábradlí",
        heading: "Realizace zábradlí",
        text: "Hliníková a skleněná zábradlí k terase, balkonu i schodišti navrhujeme tak, aby chránila, ale nebrala výhled. Kotvení, výplň i barvu ladíme s plotem a pergolou do jednoho celku — výsledkem je čistá linie bez rzi, nátěrů a každoroční údržby.",
      },
    },
    ctaHeading: "Líbí se vám některá realizace?",
    ctaText: "Pošlete nám, co se vám líbí, a my navrhneme obdobu přesně pro váš pozemek. Zaměření i kalkulace jsou zdarma.",
    cta: "Poptat řešení",
    ctaCall: "Zavolat",
  },
  sk: {
    kicker: "Realizácie",
    heading: "Realizácie, ktoré stoja za pozretie",
    subtitle:
      "Reálne zákazky, nie vizualizácie. Prejdite si ploty, brány, pergoly aj zábradlia podľa motívu a výplne — a predstavte si, ako by to vyzeralo u vás.",
    photoCount: (n: number) => `${n} ${n === 1 ? "fotka" : n < 5 ? "fotky" : "fotiek"}`,
    openGallery: "Otvoriť galériu",
    loadMore: (n: number) => `Zobraziť ďalšie fotky (${n})`,
    empty: "Fotky tejto kategórie práve dopĺňame.",
    emptyAll: "Fotky realizácií práve dopĺňame. Ozvite sa nám, radi vám ich pošleme.",
    cats: {
      ploty: {
        tab: "Ploty",
        heading: "Realizácie plotov",
        text: "Hliníkové ploty na mieru predstavujú moderné bezúdržbové riešenie, ktoré dokonale ochráni vaše súkromie a dodá nehnuteľnosti reprezentatívny vzhľad. Vďaka vlastnému patentovanému systému profilov vynikajú maximálnou pevnosťou, stabilitou a odolnosťou voči všetkým poveternostným vplyvom bez nutnosti akejkoľvek ďalšej starostlivosti.",
      },
      brany: {
        tab: "Brány",
        heading: "Realizácie brán",
        text: "Vjazdové brány navrhujeme presne na mieru vášmu plotu aj stavebnej pripravenosti. Ponúkame spoľahlivé posuvné aj krídlové riešenia, a to vrátane tichých a overených pohonov s diaľkovým ovládaním či inteligentnou správou prístupu.",
      },
      branky: {
        tab: "Bránky",
        heading: "Realizácie bránok",
        text: "Vstupné bránky ladíme s plotom aj bránou do jedného celku — rovnaká výplň, rovnaký motív, rovnaká farba. Doplníme ich elektrickým zámkom, videozvončekom alebo čítačkou čipov, aby ste sa dostali dnu bez kľúča a bez kompromisu vo vzhľade.",
      },
      pergoly: {
        tab: "Pergoly",
        heading: "Realizácie pergol",
        text: "Bioklimatické pergoly s otočnými lamelami vám umožnia plne kontrolovať tienenie, prúdenie vzduchu aj ochranu pred dažďom na vašej terase. Spájajú v sebe špičkový dizajn, prvotriednu hliníkovú konštrukciu a maximálny komfort pre celoročný pobyt vonku.",
      },
      zabradli: {
        tab: "Zábradlia",
        heading: "Realizácie zábradlí",
        text: "Hliníkové a sklenené zábradlia k terase, balkónu aj schodisku navrhujeme tak, aby chránili, ale nebrali výhľad. Kotvenie, výplň aj farbu ladíme s plotom a pergolou do jedného celku — výsledkom je čistá línia bez hrdze, náterov a každoročnej údržby.",
      },
    },
    ctaHeading: "Páči sa vám niektorá realizácia?",
    ctaText: "Pošlite nám, čo sa vám páči, a my navrhneme obdobu presne pre váš pozemok. Zameranie aj kalkulácia sú zadarmo.",
    cta: "Dopytovať riešenie",
    ctaCall: "Zavolať",
  },
  de: {
    kicker: "Referenzen",
    heading: "Referenzen, die sich sehen lassen",
    subtitle:
      "Echte Aufträge, keine Visualisierungen. Sehen Sie sich Zäune, Tore, Pergolen und Geländer nach Motiv und Füllung an — und stellen Sie sich vor, wie es bei Ihnen aussehen könnte.",
    photoCount: (n: number) => `${n} ${n === 1 ? "Foto" : "Fotos"}`,
    openGallery: "Galerie öffnen",
    loadMore: (n: number) => `Weitere Fotos anzeigen (${n})`,
    empty: "Die Fotos dieser Kategorie ergänzen wir gerade.",
    emptyAll: "Die Referenzfotos ergänzen wir gerade. Melden Sie sich, wir senden sie Ihnen gerne zu.",
    cats: {
      ploty: {
        tab: "Zäune",
        heading: "Umgesetzte Zäune",
        text: "Maßgefertigte Aluminiumzäune sind eine moderne, wartungsfreie Lösung, die Ihre Privatsphäre zuverlässig schützt und der Immobilie ein repräsentatives Aussehen verleiht. Dank unseres eigenen patentierten Profilsystems überzeugen sie mit höchster Festigkeit, Stabilität und Widerstandsfähigkeit gegen alle Witterungseinflüsse — ganz ohne weitere Pflege.",
      },
      brany: {
        tab: "Tore",
        heading: "Umgesetzte Tore",
        text: "Einfahrtstore planen wir exakt nach Ihrem Zaun und der baulichen Vorbereitung. Wir bieten zuverlässige Schiebe- und Flügellösungen, einschließlich leiser, bewährter Antriebe mit Fernbedienung oder smarter Zutrittsverwaltung.",
      },
      branky: {
        tab: "Türen",
        heading: "Umgesetzte Eingangstüren",
        text: "Eingangstüren stimmen wir mit Zaun und Tor zu einer Einheit ab — gleiche Füllung, gleiches Motiv, gleiche Farbe. Auf Wunsch ergänzen wir Elektroschloss, Videosprechanlage oder Chipleser, damit Sie ohne Schlüssel hineinkommen, ohne Abstriche beim Aussehen.",
      },
      pergoly: {
        tab: "Pergolen",
        heading: "Umgesetzte Pergolen",
        text: "Bioklimatische Pergolen mit drehbaren Lamellen lassen Sie Beschattung, Luftstrom und Regenschutz auf Ihrer Terrasse vollständig steuern. Sie vereinen erstklassiges Design, hochwertige Aluminiumkonstruktion und maximalen Komfort für das ganze Jahr im Freien.",
      },
      zabradli: {
        tab: "Geländer",
        heading: "Umgesetzte Geländer",
        text: "Geländer aus Aluminium und Glas für Terrasse, Balkon und Treppe planen wir so, dass sie schützen, ohne die Aussicht zu nehmen. Befestigung, Füllung und Farbe stimmen wir mit Zaun und Pergola zu einer Einheit ab — das Ergebnis ist eine klare Linie ohne Rost, Anstrich und jährliche Wartung.",
      },
    },
    ctaHeading: "Gefällt Ihnen eine der Umsetzungen?",
    ctaText: "Schicken Sie uns, was Ihnen gefällt, und wir entwerfen eine Entsprechung genau für Ihr Grundstück. Aufmaß und Kalkulation sind kostenlos.",
    cta: "Angebot anfragen",
    ctaCall: "Anrufen",
  },
}

// ---------------------------------------------------------------------------
// TESTIMONIALS (testimonials.tsx) — jména necháváme, překládá se jen text
// ---------------------------------------------------------------------------

// Recenze samotné chodí ze Sanity (`REVIEWS_QUERY` → `buildReviews`), tady zůstávají
// jen texty okolo. Fotka u recenze je záběr realizace daného zákazníka, ne portrét.
export const testimonialsContent = {
  cs: {
    heading: "Hodnocení od našich klientů",
    photoAlt: (name: string) => `Realizace pro zákazníka ${name}`,
    ratingAlt: (rating: number) => `Hodnoceno ${rating} z 5 hvězdiček`,
    sourceLink: "Zobrazit na Google",
    sourceAlt: (name: string) => `Zobrazit hodnocení od ${name} na Google`,
  },
  sk: {
    heading: "Hodnotenia od našich klientov",
    photoAlt: (name: string) => `Realizácia pre zákazníka ${name}`,
    ratingAlt: (rating: number) => `Hodnotené ${rating} z 5 hviezdičiek`,
    sourceLink: "Zobraziť na Google",
    sourceAlt: (name: string) => `Zobraziť hodnotenie od ${name} na Google`,
  },
  de: {
    heading: "Bewertungen unserer Kunden",
    photoAlt: (name: string) => `Projekt für Kunde ${name}`,
    ratingAlt: (rating: number) => `Mit ${rating} von 5 Sternen bewertet`,
    sourceLink: "Auf Google ansehen",
    sourceAlt: (name: string) => `Bewertung von ${name} auf Google ansehen`,
  },
}

// ---------------------------------------------------------------------------
// SOCIAL (social.tsx)
// ---------------------------------------------------------------------------

export const socialContent = {
  cs: {
    heading: "Jsme i na sociálních sítích",
    subtitle: "Podívejte se na naše nejnovější realizace, novinky a inspiraci na hliníkové ploty, brány a pergoly.",
    emailLabel: "E-mail",
    igAriaPrefix: "Otevřít příspěvek na Instagramu:",
    igPostAlt: "Příspěvek KONSTANTA - hliníkové ploty s.r.o. na Instagramu",
    galleryAlts: [
      "Hliníkový plot s vodorovnými lamelami",
      "Posuvná hliníková brána",
      "Detail hliníkových lamel",
      "Hliníková branka",
      "Hliníková pergola",
      "Plot s imitací dřeva",
      "Plot s integrovanou schránkou",
      "Montáž plotu",
      "Dům s osvětleným plotem",
    ],
  },
  sk: {
    heading: "Sme aj na sociálnych sieťach",
    subtitle: "Pozrite si naše najnovšie realizácie, novinky a inšpiráciu na hliníkové ploty, brány a pergoly.",
    emailLabel: "E-mail",
    igAriaPrefix: "Otvoriť príspevok na Instagrame:",
    igPostAlt: "Príspevok KONSTANTA - hliníkové ploty s.r.o. na Instagrame",
    galleryAlts: [
      "Hliníkový plot s vodorovnými lamelami",
      "Posuvná hliníková brána",
      "Detail hliníkových lamel",
      "Hliníková bránka",
      "Hliníková pergola",
      "Plot s imitáciou dreva",
      "Plot s integrovanou schránkou",
      "Montáž plota",
      "Dom s osvetleným plotom",
    ],
  },
  de: {
    heading: "Wir sind auch in sozialen Netzwerken",
    subtitle:
      "Entdecken Sie unsere neuesten Projekte, Neuigkeiten und Inspiration rund um Aluminiumzäune, Tore und Pergolen.",
    emailLabel: "E-Mail",
    igAriaPrefix: "Instagram-Beitrag öffnen:",
    igPostAlt: "Instagram-Beitrag von KONSTANTA - hliníkové ploty s.r.o.",
    galleryAlts: [
      "Aluminiumzaun mit horizontalen Lamellen",
      "Aluminium-Schiebetor",
      "Detailansicht der Aluminiumlamellen",
      "Aluminiumtür",
      "Aluminiumpergola",
      "Zaun in Holzoptik",
      "Zaun mit integriertem Briefkasten",
      "Zaunmontage",
      "Haus mit beleuchtetem Zaun",
    ],
  },
}

// ---------------------------------------------------------------------------
// CONTACT (contact.tsx)
// ---------------------------------------------------------------------------

export const contactContent = {
  cs: {
    heading: "Pojďme naplánovat váš nový plot",
    paragraph: "Vyplňte formulář a my se vám ozveme s nezávaznou kalkulací zdarma. Zaměření i návrh řešení je u nás samozřejmostí.",
    groups: [
      { title: "Zaměření a obchod" },
      { title: "Fakturace, kalkulace, nabídky" },
      { title: "Výroba a technické řešení" },
    ],
    fakturacniUdaje: "Fakturační údaje",
    sidlo: "Sídlo:",
    successTitle: "Děkujeme!",
    successText: "Vaši poptávku jsme přijali. Brzy se vám ozveme.",
    labels: { name: "Jméno a příjmení", phone: "Telefon", email: "E-mail", company: "Firma", message: "Co potřebujete?" },
    placeholders: { name: "Jan Novák", phone: "+420 000 000 000", email: "jan@email.cz", company: "Firma s.r.o.", message: "Mám zájem o plot a posuvnou bránu..." },
    submit: "Odeslat poptávku",
    consent: "Odesláním souhlasíte se zpracováním osobních údajů za účelem vyřízení poptávky.",
    mapTitle: "Mapa - KONSTANTA hliníkové ploty, Maleč 36",
  },
  sk: {
    heading: "Poďme naplánovať váš nový plot",
    paragraph: "Vyplňte formulár a my sa vám ozveme s nezáväznou kalkuláciou zadarmo. Zameranie aj návrh riešenia je u nás samozrejmosťou.",
    groups: [
      { title: "Zameranie a obchod" },
      { title: "Fakturácia, kalkulácie, ponuky" },
      { title: "Výroba a technické riešenia" },
    ],
    fakturacniUdaje: "Fakturačné údaje",
    sidlo: "Sídlo:",
    successTitle: "Ďakujeme!",
    successText: "Váš dopyt sme prijali. Čoskoro sa vám ozveme.",
    labels: { name: "Meno a priezvisko", phone: "Telefón", email: "E-mail", company: "Firma", message: "Čo potrebujete?" },
    placeholders: { name: "Ján Novák", phone: "+420 000 000 000", email: "jan@email.sk", company: "Firma s.r.o.", message: "Mám záujem o plot a posuvnú bránu..." },
    submit: "Odoslať dopyt",
    consent: "Odoslaním súhlasíte so spracovaním osobných údajov na účely vybavenia dopytu.",
    mapTitle: "Mapa - KONSTANTA hliníkové ploty, Maleč 36",
  },
  de: {
    heading: "Lassen Sie uns Ihren neuen Zaun planen",
    paragraph:
      "Füllen Sie das Formular aus, und wir melden uns bei Ihnen mit einer kostenlosen, unverbindlichen Kalkulation. Aufmaß und Lösungsvorschlag sind bei uns selbstverständlich.",
    groups: [
      { title: "Aufmaß und Vertrieb" },
      { title: "Rechnungsstellung, Kalkulation, Angebote" },
      { title: "Fertigung und technische Lösungen" },
    ],
    fakturacniUdaje: "Rechnungsangaben",
    sidlo: "Sitz:",
    successTitle: "Vielen Dank!",
    successText: "Ihre Anfrage ist bei uns eingegangen. Wir melden uns in Kürze bei Ihnen.",
    labels: { name: "Vor- und Nachname", phone: "Telefon", email: "E-Mail", company: "Firma", message: "Was benötigen Sie?" },
    placeholders: { name: "Max Mustermann", phone: "+420 000 000 000", email: "max@email.de", company: "Firma GmbH", message: "Ich interessiere mich für einen Zaun und ein Schiebetor..." },
    submit: "Anfrage senden",
    consent: "Mit dem Absenden stimmen Sie der Verarbeitung Ihrer personenbezogenen Daten zur Bearbeitung der Anfrage zu.",
    mapTitle: "Karte – KONSTANTA hliníkové ploty, Maleč 36",
  },
}

// ---------------------------------------------------------------------------
// O NÁS — profile-hero.tsx
// ---------------------------------------------------------------------------

export const profileHeroContent = {
  cs: {
    kicker: "O nás",
    titleLines: ["Jsme", "Konstanta"],
    subtitle: "Váš parťák pro precizní ploty, brány a pergoly. Sázíme na kvalitu, která přežije generace.",
    stats: [
      { yearPrefix: "od ", label: "rok vzniku" },
      { suffix: " h", label: "montáž do" },
      { suffix: "×", label: "patentovaný systém" },
    ],
    cta: "Poptat řešení",
    captionLeft: "Hliníkový plot na míru",
    captionRight: "Komorové profily · hliník EN-AW",
  },
  sk: {
    kicker: "O nás",
    titleLines: ["Sme", "Konstanta"],
    subtitle: "Váš parťák pre precízne ploty, brány a pergoly. Staviame na kvalite, ktorá prežije generácie.",
    stats: [
      { yearPrefix: "od ", label: "rok vzniku" },
      { suffix: " h", label: "montáž do" },
      { suffix: "×", label: "patentovaný systém" },
    ],
    cta: "Dopytovať riešenie",
    captionLeft: "Hliníkový plot na mieru",
    captionRight: "Komorové profily · hliník EN-AW",
  },
  de: {
    kicker: "Über uns",
    titleLines: ["Wir sind", "Konstanta"],
    subtitle: "Ihr Partner für präzise Zäune, Tore und Pergolen. Wir setzen auf Qualität, die Generationen überdauert.",
    stats: [
      { yearPrefix: "seit ", label: "Gründungsjahr" },
      { suffix: " Std.", label: "Montage in" },
      { suffix: "×", label: "patentiertes System" },
    ],
    cta: "Angebot anfragen",
    captionLeft: "Maßgefertigter Aluminiumzaun",
    captionRight: "Kammerprofile · Aluminium EN-AW",
  },
}

export const storyContent = {
  cs: {
    kicker: "Náš příběh",
    heading: "Konstanta = stabilita a spolehlivost",
    paragraphs: [
      "KONSTANTA – rodinná firma, kterou jsme založili v roce 2022. Začínali jsme v celkem divoké době, ale poctivé řemeslo si cestu vždycky najde. Měli jsme jasný plán a chuť dělat věci pořádně a jinak. Dnes máme za sebou přes stovky hotových projektů, a hlavně čisté svědomí, že za námi zůstává dobrá práce, která přežije generace.",
      "Název KONSTANTA nevznikl náhodou. Je to symbol stability a spolehlivosti. A přesně tím chceme být pro naše zákazníky. Naše věci navrhujeme a montujeme tak, aby vydržely – bez kompromisů. Nehoníme se za rekordy v počtu zakázek, svou práci děláme precizně a kvalita je u nás vždy na prvním místě.",
      "A přesně takové jsou naše ploty, brány a pergoly – prostě drží, nesesypou se po první zimě a budou vám dělat radost spoustu let.",
      "Pokud chcete parťáky, kteří se s vámi lidsky domluví, drží slovo a udělají precizní práci, jsme tu pro vás.",
    ],
    badgeYear: "2022",
    badgeLabel: "rodinná firma",
  },
  sk: {
    kicker: "Náš príbeh",
    heading: "Konstanta = stabilita a spoľahlivosť",
    paragraphs: [
      "KONSTANTA – rodinná firma, ktorú sme založili v roku 2022. Začínali sme v pomerne divokej dobe, ale poctivé remeslo si cestu vždy nájde. Mali sme jasný plán a chuť robiť veci poriadne a inak. Dnes máme za sebou stovky hotových projektov, a hlavne čisté svedomie, že za nami zostáva dobrá práca, ktorá prežije generácie.",
      "Názov KONSTANTA nevznikol náhodou. Je to symbol stability a spoľahlivosti. A presne tým chceme byť pre našich zákazníkov. Naše výrobky navrhujeme a montujeme tak, aby vydržali – bez kompromisov. Nehoníme sa za rekordami v počte zákaziek, svoju prácu robíme precízne a kvalita je u nás vždy na prvom mieste.",
      "A presne také sú naše ploty, brány a pergoly – jednoducho vydržia, nezrútia sa po prvej zime a budú vám robiť radosť veľa rokov.",
      "Ak chcete partnerov, ktorí sa s vami ľudsky dohodnú, dodržia slovo a odvedú precíznu prácu, sme tu pre vás.",
    ],
    badgeYear: "2022",
    badgeLabel: "rodinná firma",
  },
  de: {
    kicker: "Unsere Geschichte",
    heading: "Konstanta = Stabilität und Zuverlässigkeit",
    paragraphs: [
      "KONSTANTA – ein Familienunternehmen, das wir 2022 gegründet haben. Wir haben in einer ziemlich turbulenten Zeit angefangen, aber ehrliches Handwerk setzt sich immer durch. Wir hatten einen klaren Plan und Lust, die Dinge gründlich und anders zu machen. Heute haben wir Hunderte abgeschlossene Projekte hinter uns – und vor allem ein reines Gewissen, dass von uns gute Arbeit bleibt, die Generationen überdauert.",
      "Der Name KONSTANTA ist kein Zufall. Er ist ein Symbol für Stabilität und Zuverlässigkeit. Und genau das wollen wir für unsere Kunden sein. Wir entwerfen und montieren unsere Produkte so, dass sie halten – ohne Kompromisse. Wir jagen keinen Auftragsrekorden hinterher, sondern arbeiten präzise, und Qualität steht bei uns immer an erster Stelle.",
      "Und genau so sind unsere Zäune, Tore und Pergolen – sie halten einfach, fallen nicht nach dem ersten Winter auseinander und werden Ihnen viele Jahre lang Freude bereiten.",
      "Wenn Sie Partner suchen, die sich menschlich mit Ihnen verständigen, ihr Wort halten und präzise Arbeit leisten, sind wir für Sie da.",
    ],
    badgeYear: "2022",
    badgeLabel: "Familienunternehmen",
  },
}

export const sectionNavContent = {
  cs: { links: ["Jsme Konstanta", "Síla Konstanty", "Co oceníte", "Jak to probíhá", "Certifikáty", "FAQ"] },
  sk: { links: ["Sme Konstanta", "Sila Konstanty", "Čo oceníte", "Ako to prebieha", "Certifikáty", "FAQ"] },
  de: { links: ["Wir sind Konstanta", "Die Stärke von Konstanta", "Das schätzen Sie", "Wie es abläuft", "Zertifikate", "FAQ"] },
}

export const silaKonstantyContent = {
  cs: {
    kicker: "Proč my",
    headingLines: ["Síla", "Konstanty"],
    points: [
      { t: "Komplexní řešení bez starostí", d: "Zajistíme celý proces od návrhu až po montáž. Nemusíte řešit žádné koordinace mezi firmami." },
      { t: "Vždy myslíme dopředu", d: "Už při návrhu počítáme s budoucím využitím a návazností na další prvky jako pergoly, garáže, brány nebo technologie." },
      { t: "Promyšlená atypická řešení", d: "Umíme pracovat se svažitým terénem, omezeným prostorem i nestandardními požadavky. Každý projekt hledá vlastní řešení." },
      { t: "Vlastní patentovaný systém", d: "Používáme vlastní konstrukční systém založený na komorových profilech, který zvyšuje pevnost a stabilitu." },
      { t: "Bezkonkurenčně kvalitní materiály", d: "Pracujeme s hliníkovými systémy od ověřeného španělského dodavatele. Levné kompromisy nepoužíváme." },
      { t: "Mimořádný důraz na detail", d: "Čisté spoje, nerezové prvky a lakování v barvě konstrukce. Věci, které nejsou na první pohled vidět, rozhodují nejvíc." },
      { t: "Důsledná kontrola kvality", d: "Každý díl prochází kontrolou ještě před montáží. Co nesplní nároky, se dál nepouští." },
      { t: "Montáž v rekordním čase do 24 hodin", d: "Díky přípravě a sehranému týmu zvládáme většinu zakázek dokončit během jednoho dne." },
      { t: "Snadný servis i po letech", d: "Konstrukce jsou navržené tak, aby šly snadno rozebrat a opravit po částech." },
      { t: "Normální lidský přístup", d: "Zakládáme si na dlouhodobé spolupráci a odpovědnosti za odvedenou práci." },
    ],
  },
  sk: {
    kicker: "Prečo my",
    headingLines: ["Sila", "Konstanty"],
    points: [
      { t: "Komplexné riešenie bez starostí", d: "Zabezpečíme celý proces od návrhu až po montáž. Nemusíte riešiť žiadnu koordináciu medzi firmami." },
      { t: "Vždy myslíme dopredu", d: "Už pri návrhu počítame s budúcim využitím a nadväznosťou na ďalšie prvky ako pergoly, garáže, brány alebo technológie." },
      { t: "Premyslené atypické riešenia", d: "Vieme pracovať so svahovitým terénom, obmedzeným priestorom aj neštandardnými požiadavkami. Pre každý projekt hľadáme vlastné riešenie." },
      { t: "Vlastný patentovaný systém", d: "Používame vlastný konštrukčný systém založený na komorových profiloch, ktorý zvyšuje pevnosť a stabilitu." },
      { t: "Bezkonkurenčne kvalitné materiály", d: "Pracujeme s hliníkovými systémami od overeného španielskeho dodávateľa. Lacné kompromisy nepoužívame." },
      { t: "Mimoriadny dôraz na detail", d: "Čisté spoje, nerezové prvky a lakovanie vo farbe konštrukcie. Veci, ktoré nie sú na prvý pohľad vidieť, rozhodujú najviac." },
      { t: "Dôsledná kontrola kvality", d: "Každý diel prechádza kontrolou ešte pred montážou. Čo nespĺňa nároky, sa ďalej nepoužije." },
      { t: "Montáž v rekordnom čase do 24 hodín", d: "Vďaka príprave a zohratému tímu zvládame väčšinu zákaziek dokončiť počas jedného dňa." },
      { t: "Jednoduchý servis aj po rokoch", d: "Konštrukcie sú navrhnuté tak, aby sa dali jednoducho rozobrať a opraviť po častiach." },
      { t: "Normálny ľudský prístup", d: "Zakladáme si na dlhodobej spolupráci a zodpovednosti za odvedenú prácu." },
    ],
  },
  de: {
    kicker: "Warum wir",
    headingLines: ["Die Stärke", "von Konstanta"],
    points: [
      { t: "Komplettlösung ohne Aufwand für Sie", d: "Wir übernehmen den gesamten Prozess vom Entwurf bis zur Montage. Sie müssen keine Koordination zwischen mehreren Firmen übernehmen." },
      { t: "Wir denken immer voraus", d: "Schon beim Entwurf berücksichtigen wir die künftige Nutzung und den Anschluss an weitere Elemente wie Pergolen, Garagen, Tore oder Technik." },
      { t: "Durchdachte Speziallösungen", d: "Wir arbeiten mit Hanglagen, begrenztem Platz und ungewöhnlichen Anforderungen. Für jedes Projekt finden wir eine eigene Lösung." },
      { t: "Eigenes patentiertes System", d: "Wir verwenden ein eigenes Konstruktionssystem auf Basis von Kammerprofilen, das Festigkeit und Stabilität erhöht." },
      { t: "Unschlagbar hochwertige Materialien", d: "Wir arbeiten mit Aluminiumsystemen eines bewährten spanischen Lieferanten. Auf billige Kompromisse verzichten wir." },
      { t: "Außergewöhnlicher Blick fürs Detail", d: "Saubere Verbindungen, Edelstahlelemente und Lackierung im Farbton der Konstruktion. Details, die man nicht sofort sieht, entscheiden am meisten." },
      { t: "Konsequente Qualitätskontrolle", d: "Jedes Teil wird noch vor der Montage geprüft. Was den Anforderungen nicht entspricht, wird nicht verbaut." },
      { t: "Montage in Rekordzeit – innerhalb von 24 Stunden", d: "Dank guter Vorbereitung und eines eingespielten Teams schaffen wir die meisten Aufträge an einem Tag." },
      { t: "Einfacher Service auch nach Jahren", d: "Die Konstruktionen sind so konzipiert, dass sie sich leicht zerlegen und teilweise reparieren lassen." },
      { t: "Ganz normaler menschlicher Umgang", d: "Uns ist langfristige Zusammenarbeit und Verantwortung für die geleistete Arbeit wichtig." },
    ],
  },
}

export const coOceniteContent = {
  cs: {
    kicker: "Co oceníte",
    heading: "Nejdůležitější v kostce",
    benefits: [
      { title: "Zakázka v rekordním čase", text: "Vše vyřízeno obvykle do 4 týdnů." },
      { title: "Finální realizace do 24 hodin", text: "Montáž dílců a bran za jeden den." },
      { title: "Komplexní řešení bez starostí", text: "Zajistíme vše od návrhu až po montáž." },
      { title: "Vlastní patentovaný systém", text: "Vyšší pevnost, stabilita a odolnost." },
    ],
  },
  sk: {
    kicker: "Čo oceníte",
    heading: "Najdôležitejšie v skratke",
    benefits: [
      { title: "Zákazka v rekordnom čase", text: "Všetko vybavené obvykle do 4 týždňov." },
      { title: "Finálna realizácia do 24 hodín", text: "Montáž dielcov a brán za jeden deň." },
      { title: "Komplexné riešenie bez starostí", text: "Zabezpečíme všetko od návrhu až po montáž." },
      { title: "Vlastný patentovaný systém", text: "Vyššia pevnosť, stabilita a odolnosť." },
    ],
  },
  de: {
    kicker: "Das schätzen Sie",
    heading: "Das Wichtigste auf einen Blick",
    benefits: [
      { title: "Auftrag in Rekordzeit", text: "Alles in der Regel innerhalb von 4 Wochen erledigt." },
      { title: "Endmontage innerhalb von 24 Stunden", text: "Elemente und Tore an einem Tag montiert." },
      { title: "Komplettlösung ohne Aufwand für Sie", text: "Wir übernehmen alles vom Entwurf bis zur Montage." },
      { title: "Eigenes patentiertes System", text: "Höhere Festigkeit, Stabilität und Widerstandsfähigkeit." },
    ],
  },
}

export const procesFlowContent = {
  cs: {
    kicker: "Postup",
    heading: "Jak to u nás probíhá",
    krokLabel: (n: string) => `Krok ${n}`,
    steps: [
      { title: "Komunikace + zaměření", text: "Sejdeme se, projdeme vaše představy a přesně zaměříme pozemek." },
      { title: "Návrh a poptávka řešení", text: "Navrhneme řešení na míru a připravíme jasnou nabídku bez skrytých položek." },
      { title: "Příprava základů", text: "Připravíme pevné a rovné základy pro dlouhou životnost konstrukce." },
      { title: "Výroba a kontrola kvality", text: "Díly vyrobíme z komorových profilů a každý zkontrolujeme ještě před montáží." },
      { title: "Montáž do 24 hodin", text: "Sehraný tým osadí většinu zakázek během jednoho dne, čistě a přesně." },
      { title: "Hotovo a servis", text: "Předáme hotové dílo a zůstáváme k dispozici i po letech." },
    ],
  },
  sk: {
    kicker: "Postup",
    heading: "Ako to u nás prebieha",
    krokLabel: (n: string) => `Krok ${n}`,
    steps: [
      { title: "Komunikácia a zameranie", text: "Stretneme sa, prejdeme vaše predstavy a presne zameriame pozemok." },
      { title: "Návrh a ponuka riešenia", text: "Navrhneme riešenie na mieru a pripravíme jasnú ponuku bez skrytých položiek." },
      { title: "Príprava základov", text: "Pripravíme pevné a rovné základy pre dlhú životnosť konštrukcie." },
      { title: "Výroba a kontrola kvality", text: "Diely vyrobíme z komorových profilov a každý skontrolujeme ešte pred montážou." },
      { title: "Montáž do 24 hodín", text: "Zohratý tím osadí väčšinu zákaziek počas jedného dňa, čisto a presne." },
      { title: "Hotovo a servis", text: "Odovzdáme hotové dielo a zostávame k dispozícii aj po rokoch." },
    ],
  },
  de: {
    kicker: "Ablauf",
    heading: "Wie es bei uns abläuft",
    krokLabel: (n: string) => `Schritt ${n}`,
    steps: [
      { title: "Kommunikation und Aufmaß", text: "Wir treffen uns, besprechen Ihre Vorstellungen und vermessen das Grundstück genau." },
      { title: "Entwurf und Angebot", text: "Wir entwerfen eine Lösung nach Maß und erstellen ein klares Angebot ohne versteckte Posten." },
      { title: "Fundament vorbereiten", text: "Wir bereiten ein festes, gerades Fundament für eine lange Lebensdauer der Konstruktion vor." },
      { title: "Fertigung und Qualitätskontrolle", text: "Die Teile fertigen wir aus Kammerprofilen und prüfen jedes einzelne vor der Montage." },
      { title: "Montage innerhalb von 24 Stunden", text: "Unser eingespieltes Team montiert die meisten Aufträge an einem Tag, sauber und präzise." },
      { title: "Fertig und Service", text: "Wir übergeben das fertige Werk und stehen auch nach Jahren zur Verfügung." },
    ],
  },
}

export const certifikatyContent = {
  cs: {
    kicker: "Certifikáty a patenty",
    heading: "Kvalitu máme podloženou úředně",
    intro: "Certifikáty, patenty a doklady k materiálům, se kterými pracujeme. Vše ke stažení, bez hvězdiček.",
    download: "Stáhnout",
    empty: "Doklady právě doplňujeme. Napište si o ně a pošleme vám je.",
  },
  sk: {
    kicker: "Certifikáty a patenty",
    heading: "Kvalitu máme podloženú úradne",
    intro: "Certifikáty, patenty a doklady k materiálom, s ktorými pracujeme. Všetko na stiahnutie, bez hviezdičiek.",
    download: "Stiahnuť",
    empty: "Doklady práve dopĺňame. Napíšte si o ne a pošleme vám ich.",
  },
  de: {
    kicker: "Zertifikate und Patente",
    heading: "Unsere Qualität ist amtlich belegt",
    intro: "Zertifikate, Patente und Nachweise zu den Materialien, mit denen wir arbeiten. Alles zum Download, ohne Kleingedrucktes.",
    download: "Herunterladen",
    empty: "Die Unterlagen ergänzen wir gerade. Schreiben Sie uns, wir senden sie Ihnen zu.",
  },
}

export const faqContent = {
  cs: {
    kicker: "FAQ",
    heading: "Časté dotazy",
    intro: "Nenašli jste odpověď? Napište nebo zavolejte, rádi to probereme lidsky.",
    faqs: [
      { q: "Jakou dáváte záruku?", a: "Na konstrukci i montáž dáváme písemnou záruku a stojíme si za ní. A když se něco přihodí i po jejím vypršení, ozvěte se – k odvedené práci se hlásíme." },
      { q: "Za jak dlouho zvládnete montáž?", a: "Většinu zakázek osadíme během jednoho dne, tedy do 24 hodin. Přesný termín potvrdíme podle přípravy základů a rozsahu projektu." },
      { q: "Zvládnete i atypický nebo svažitý terén?", a: "Ano. Svažitý terén, omezený prostor i nestandardní požadavky jsou pro nás běžná práce – každý projekt řešíme individuálně a hledáme pro něj vlastní řešení." },
      { q: "Poradíte si se servisem po letech?", a: "Konstrukce navrhujeme jako rozebíratelné, takže je jde snadno opravit po částech. Nemusíte kvůli jednomu detailu měnit celý plot." },
      { q: "Z jakého materiálu ploty vyrábíte?", a: "Pracujeme s hliníkovými systémy od ověřeného španělského dodavatele a s vlastním patentovaným komorovým profilem. Levné kompromisy nepoužíváme." },
      { q: "Vyrábíte také ploty z oceli?", a: "Ploty z oceli nevyrábíme. Naše společnost se specializuje výhradně na výrobu a montáž hliníkového bezúdržbového oplocení. Pro hliník jsme se rozhodli záměrně – na rozdíl od oceli totiž nikdy nerezne, nekoroduje a nevyžaduje žádné opakované nátěry ani údržbu. Investice do hliníkového plotu vám tak ušetří čas i peníze do budoucna, přičemž plot si zachová svůj luxusní a stálý vzhled po desítky let." },
      { q: "Děláte ploty na klíč?", a: "Zajistíme pro vás kompletní realizaci oplocení. Postaráme se o vše od zaměření a zemních prací až po precizní montáž posledního dílce. S námi získáváte plot na klíč a stoprocentní klid během celé stavby." },
      { q: "Kde působíte?", a: "Realizujeme zakázky po celé České republice. Napište nám lokalitu a domluvíme se na termínu zaměření." },
    ],
  },
  sk: {
    kicker: "FAQ",
    heading: "Časté otázky",
    intro: "Nenašli ste odpoveď? Napíšte alebo zavolajte, radi to preberieme osobne.",
    faqs: [
      { q: "Akú dávate záruku?", a: "Na konštrukciu aj montáž dávame písomnú záruku a stojíme si za ňou. A keď sa niečo prihodí aj po jej uplynutí, ozvite sa – k odvedenej práci sa hlásime." },
      { q: "Za ako dlho zvládnete montáž?", a: "Väčšinu zákaziek osadíme počas jedného dňa, teda do 24 hodín. Presný termín potvrdíme podľa prípravy základov a rozsahu projektu." },
      { q: "Zvládnete aj atypický alebo svahovitý terén?", a: "Áno. Svahovitý terén, obmedzený priestor aj neštandardné požiadavky sú pre nás bežná práca – každý projekt riešime individuálne a hľadáme preň vlastné riešenie." },
      { q: "Poradíte si so servisom aj po rokoch?", a: "Konštrukcie navrhujeme ako rozoberateľné, takže sa dajú jednoducho opraviť po častiach. Nemusíte kvôli jednému detailu meniť celý plot." },
      { q: "Z akého materiálu ploty vyrábiate?", a: "Pracujeme s hliníkovými systémami od overeného španielskeho dodávateľa a s vlastným patentovaným komorovým profilom. Lacné kompromisy nepoužívame." },
      { q: "Vyrábiate aj ploty z ocele?", a: "Ploty z ocele nevyrábame. Naša spoločnosť sa špecializuje výhradne na výrobu a montáž hliníkového bezúdržbového oplotenia. Pre hliník sme sa rozhodli zámerne – na rozdiel od ocele totiž nikdy nehrdzavie, nekoroduje a nevyžaduje žiadne opakované nátery ani údržbu. Investícia do hliníkového plota vám tak ušetrí čas aj peniaze do budúcna, pričom plot si zachová svoj luxusný a stály vzhľad na desiatky rokov." },
      { q: "Robíte ploty na kľúč?", a: "Zabezpečíme pre vás kompletnú realizáciu oplotenia. Postaráme sa o všetko od zamerania a zemných prác až po precíznu montáž posledného dielca. S nami získavate plot na kľúč a stopercentný pokoj počas celej stavby." },
      { q: "Kde pôsobíte?", a: "Realizujeme zákazky po celom Česku. Napíšte nám lokalitu a dohodneme sa na termíne zamerania." },
    ],
  },
  de: {
    kicker: "FAQ",
    heading: "Häufige Fragen",
    intro: "Keine passende Antwort gefunden? Schreiben oder rufen Sie an, wir besprechen es gerne persönlich.",
    faqs: [
      { q: "Welche Garantie geben Sie?", a: "Auf Konstruktion und Montage geben wir eine schriftliche Garantie, zu der wir stehen. Und sollte auch nach Ablauf etwas passieren, melden Sie sich – wir stehen zu unserer Arbeit." },
      { q: "Wie lange dauert die Montage?", a: "Die meisten Aufträge montieren wir innerhalb eines Tages, also 24 Stunden. Den genauen Termin bestätigen wir je nach Fundamentvorbereitung und Projektumfang." },
      { q: "Schaffen Sie auch untypisches oder abschüssiges Gelände?", a: "Ja. Hanglagen, begrenzter Platz und untypische Anforderungen sind für uns Alltag – jedes Projekt behandeln wir individuell und finden dafür eine eigene Lösung." },
      { q: "Kümmern Sie sich auch nach Jahren um den Service?", a: "Wir konzipieren die Konstruktionen zerlegbar, sodass sie sich leicht in Teilen reparieren lassen. Sie müssen wegen eines Details nicht den ganzen Zaun austauschen." },
      { q: "Aus welchem Material fertigen Sie die Zäune?", a: "Wir arbeiten mit Aluminiumsystemen eines bewährten spanischen Lieferanten und einem eigenen patentierten Kammerprofil. Auf billige Kompromisse verzichten wir." },
      { q: "Fertigen Sie auch Zäune aus Stahl?", a: "Zäune aus Stahl fertigen wir nicht. Unser Unternehmen ist ausschließlich auf die Herstellung und Montage wartungsfreier Aluminiumzäune spezialisiert. Für Aluminium haben wir uns bewusst entschieden – anders als Stahl rostet es nie, korrodiert nicht und braucht weder wiederholte Anstriche noch Pflege. Die Investition in einen Aluminiumzaun spart Ihnen künftig Zeit und Geld, und der Zaun behält sein hochwertiges, gleichbleibendes Aussehen über Jahrzehnte." },
      { q: "Bauen Sie Zäune schlüsselfertig?", a: "Wir übernehmen die komplette Realisierung Ihres Zauns. Wir kümmern uns um alles – vom Aufmaß über die Erdarbeiten bis zur präzisen Montage des letzten Elements. Bei uns bekommen Sie einen schlüsselfertigen Zaun und volle Ruhe während der gesamten Bauzeit." },
      { q: "Wo sind Sie tätig?", a: "Wir realisieren Aufträge in ganz Tschechien. Schreiben Sie uns Ihren Standort, und wir vereinbaren einen Termin für das Aufmaß." },
    ],
  },
}

export const zaverCtaContent = {
  cs: {
    heading: "Uděláme to pořádně. Ozvěte se.",
    paragraph: "Parťáci, kteří se s vámi lidsky domluví, drží slovo a udělají precizní práci.",
    ctaSolution: "Poptat řešení",
    ctaCall: "Zavolat",
  },
  sk: {
    heading: "Urobíme to poriadne. Ozvite sa.",
    paragraph: "Partneri, ktorí sa s vami ľudsky dohodnú, dodržia slovo a odvedú precíznu prácu.",
    ctaSolution: "Dopytovať riešenie",
    ctaCall: "Zavolať",
  },
  de: {
    heading: "Wir machen es richtig. Melden Sie sich.",
    paragraph: "Partner, die sich menschlich mit Ihnen verständigen, ihr Wort halten und präzise Arbeit leisten.",
    ctaSolution: "Angebot anfragen",
    ctaCall: "Anrufen",
  },
}

// ---------------------------------------------------------------------------
// CHYTRÁ ŘEŠENÍ (app/chytra-reseni/page.tsx)
// Pořadí `items` je svázané s polem ikon v app/chytra-reseni/page.tsx.
// ---------------------------------------------------------------------------

export const chytraReseniContent = {
  cs: {
    kicker: "Chytrá řešení",
    heading: "Detaily, které dělají rozdíl",
    subtitle:
      "Posuňte svůj domov a exteriér o krok dál pomocí moderních technologií a automatizace. Chytrá řešení propojují ovládání bran, osvětlení a stínění do jednoho intuitivního systému, který vám ušetří čas a zajistí maximální bezpečí i pohodlí.",
    items: [
      { title: "Integrovaná schránka", text: "Máme rádi čistý design, proto schránku integrujeme přímo do plotu. Splyne s ním tak přirozeně, že na první pohled ani nepoznáte, kde končí plot a začíná prostor pro poštu." },
      { title: "Elektrozámek", text: "Znáte to – jdete v dešti k brance, hledáte klíče, chvátáte a jako naschvál je nemůžete najít. S elektrozámkem tohle odpadá. Branku si z pohodlí domova nebo pomocí čipu otevřete během vteřiny. Maximální bezpečí a komfort." },
      { title: "Dvířka HUP", text: "Plynoměry a elektroměry nejsou zrovna ozdobou domu. Proto dvířka HUP vyrobíme ve stejném stylu, jako je váš plot. Schováme je tak, že o nich nebudete ani vědět." },
      { title: "Kované číslo popisné", text: "Číslo popisné je jako podpis vašeho domova. Když ladí s celým plotem, působí to jako drobnost, která ale dává celému vstupu na dům úplně jiný šmrnc." },
      { title: "Ovládání přes aplikaci TaHoma", text: "Dnes máme telefon pořád v ruce, tak proč ho nevyužít? Inteligentní správa vstupu ve vašem telefonu. Otevírejte, zavírejte a kontrolujte bránu odkudkoliv na světě. Je to svoboda, na kterou si rychle zvyknete." },
      { title: "Výstražný maják", text: "Vizuální garance bezpečnosti. Výstražný maják vás i vaše okolí včas upozorní na pohyb brány, hlavně za ztížených světelných podmínek. Kvalitní doplněk pro bezstarostný provoz." },
      { title: "Kódová klávesnice", text: "Klíče a ovladače se rády ztrácejí – svoboda pohybu bez nich je paráda. Vstup pro hosty nebo dodavatele řízený číselným kódem: prostě jim pošlete kód a víc neřešíte. Celý systém navíc propojíme bezdrátově, instalace je díky tomu čistá, rychlá a bez stavebních zásahů do hotového pozemku." },
      { title: "Poštovní panel", text: "Není to jen díra na poštu, ale detail, který dělá celek. Náš poštovní panel spojuje vysokou užitnou hodnotu s precizním řemeslným zpracováním. Zabudovat do něj můžeme box na balíky, číslo popisné i videotelefon – vše sladěné s architekturou vašeho oplocení." },
      { title: "Točna na popelnici", text: "Chytrá manipulace bez námahy. S naším otočným mechanismem se manipulace s těžkými popelnicemi stává snadnou záležitostí. Vzhledné řešení, které nenarušuje celkový design brány." },
      { title: "Videotelefon", text: "Pocit bezpečí je k nezaplacení. S videotelefonem přesně vidíte, kdo u vás zvoní nebo se okolo pohybuje, ať už jste v obýváku, nebo zrovna v práci. Díky propojení s aplikací v mobilu máte dokonalý přehled a klid v každé situaci." },
    ],
    tags: ["iOS", "Android"],
    ctaHeading: "Nevíte, co se k vašemu vstupu hodí?",
    ctaText: "Projdeme to s vámi na místě a doporučíme jen to, co dává smysl. Nic navíc.",
    cta: "Poptat řešení",
  },
  sk: {
    kicker: "Inteligentné riešenia",
    heading: "Detaily, ktoré robia rozdiel",
    subtitle:
      "Posuňte svoj domov a exteriér o krok ďalej pomocou moderných technológií a automatizácie. Inteligentné riešenia prepájajú ovládanie brán, osvetlenia a tienenia do jedného intuitívneho systému, ktorý vám ušetrí čas a zaistí maximálnu bezpečnosť aj pohodlie.",
    items: [
      { title: "Integrovaná schránka", text: "Máme radi čistý dizajn, preto schránku integrujeme priamo do plota. Splynie s ním tak prirodzene, že na prvý pohľad ani nespoznáte, kde končí plot a začína priestor pre poštu." },
      { title: "Elektrozámok", text: "Poznáte to – idete v daždi k bránke, hľadáte kľúče, ponáhľate sa a ako naschvál ich neviete nájsť. S elektrozámkom toto odpadá. Bránku si z pohodlia domova alebo pomocou čipu otvoríte za sekundu. Maximálna bezpečnosť a komfort." },
      { title: "Dvierka HUP", text: "Plynomery a elektromery nie sú práve ozdobou domu. Preto dvierka HUP vyrobíme v rovnakom štýle ako váš plot. Schováme ich tak, že o nich ani nebudete vedieť." },
      { title: "Kované súpisné číslo", text: "Súpisné číslo je ako podpis vášho domova. Keď ladí s celým plotom, pôsobí to ako drobnosť, ktorá ale dáva celému vstupu na dom úplne iný šmrnc." },
      { title: "Ovládanie cez aplikáciu TaHoma", text: "Dnes máme telefón stále v ruke, tak prečo ho nevyužiť? Inteligentná správa vstupu vo vašom telefóne. Otvárajte, zatvárajte a kontrolujte bránu odkiaľkoľvek na svete. Je to sloboda, na ktorú si rýchlo zvyknete." },
      { title: "Výstražný maják", text: "Vizuálna garancia bezpečnosti. Výstražný maják vás aj vaše okolie včas upozorní na pohyb brány, hlavne za zhoršených svetelných podmienok. Kvalitný doplnok pre bezstarostnú prevádzku." },
      { title: "Kódová klávesnica", text: "Kľúče a ovládače sa radi strácajú – sloboda pohybu bez nich je paráda. Vstup pre hostí alebo dodávateľov riadený číselným kódom: jednoducho im pošlete kód a viac neriešite. Celý systém navyše prepojíme bezdrôtovo, inštalácia je vďaka tomu čistá, rýchla a bez stavebných zásahov do hotového pozemku." },
      { title: "Poštový panel", text: "Nie je to len diera na poštu, ale detail, ktorý robí celok. Náš poštový panel spája vysokú úžitkovú hodnotu s precíznym remeselným spracovaním. Zabudovať doň môžeme box na balíky, súpisné číslo aj videotelefón – všetko zladené s architektúrou vášho oplotenia." },
      { title: "Točňa na smetnú nádobu", text: "Inteligentná manipulácia bez námahy. S naším otočným mechanizmom sa manipulácia s ťažkými smetnými nádobami stáva jednoduchou záležitosťou. Vzhľadné riešenie, ktoré nenarúša celkový dizajn brány." },
      { title: "Videotelefón", text: "Pocit bezpečia je na nezaplatenie. S videotelefónom presne vidíte, kto u vás zvoní alebo sa okolo pohybuje, či už ste v obývačke, alebo práve v práci. Vďaka prepojeniu s aplikáciou v mobile máte dokonalý prehľad a pokoj v každej situácii." },
    ],
    tags: ["iOS", "Android"],
    ctaHeading: "Neviete, čo sa k vášmu vstupu hodí?",
    ctaText: "Prejdeme to s vami na mieste a odporučíme len to, čo dáva zmysel. Nič navyše.",
    cta: "Dopytovať riešenie",
  },
  de: {
    kicker: "Smarte Lösungen",
    heading: "Details, die den Unterschied machen",
    subtitle:
      "Bringen Sie Ihr Zuhause und Ihren Außenbereich mit moderner Technik und Automatisierung einen Schritt weiter. Smarte Lösungen verbinden die Steuerung von Toren, Beleuchtung und Beschattung zu einem intuitiven System, das Ihnen Zeit spart und höchste Sicherheit und Bequemlichkeit bietet.",
    items: [
      { title: "Integrierter Briefkasten", text: "Wir mögen klares Design, deshalb integrieren wir den Briefkasten direkt in den Zaun. Er fügt sich so natürlich ein, dass man auf den ersten Blick nicht erkennt, wo der Zaun endet und die Post beginnt." },
      { title: "Elektroschloss", text: "Sie kennen das – Sie gehen im Regen zur Gartentür, suchen die Schlüssel, haben es eilig und finden sie wie zum Trotz nicht. Mit dem Elektroschloss entfällt das. Die Tür öffnen Sie bequem von zu Hause oder per Chip in Sekunden. Höchste Sicherheit und Komfort." },
      { title: "HUP-Klappe", text: "Gas- und Stromzähler sind nicht gerade eine Zierde des Hauses. Deshalb fertigen wir die HUP-Klappe im gleichen Stil wie Ihren Zaun. Wir verstecken sie so, dass Sie gar nichts davon merken." },
      { title: "Geschmiedete Hausnummer", text: "Die Hausnummer ist wie die Unterschrift Ihres Zuhauses. Passt sie zum gesamten Zaun, wirkt es wie eine Kleinigkeit, die dem ganzen Eingang einen völlig anderen Charakter gibt." },
      { title: "Steuerung über die TaHoma-App", text: "Heute haben wir das Handy ohnehin ständig in der Hand – warum es also nicht nutzen? Intelligente Zutrittsverwaltung auf Ihrem Telefon. Öffnen, schließen und kontrollieren Sie das Tor von überall auf der Welt. Eine Freiheit, an die man sich schnell gewöhnt." },
      { title: "Warnleuchte", text: "Sichtbare Sicherheitsgarantie. Die Warnleuchte macht Sie und Ihre Umgebung rechtzeitig auf die Torbewegung aufmerksam, besonders bei schlechten Lichtverhältnissen. Ein hochwertiges Zubehör für den sorgenfreien Betrieb." },
      { title: "Codetastatur", text: "Schlüssel und Handsender gehen gerne verloren – Bewegungsfreiheit ohne sie ist großartig. Zutritt für Gäste oder Lieferanten per Zahlencode: Sie schicken einfach den Code und müssen sich um nichts weiter kümmern. Das System verbinden wir zudem drahtlos, die Installation bleibt dadurch sauber, schnell und ohne bauliche Eingriffe in Ihr fertiges Grundstück." },
      { title: "Postpaneel", text: "Es ist nicht nur ein Loch für die Post, sondern das Detail, das das Ganze ausmacht. Unser Postpaneel verbindet hohen Nutzwert mit präziser handwerklicher Verarbeitung. Wir können eine Paketbox, die Hausnummer und die Video-Türsprechanlage einbauen – alles abgestimmt auf die Architektur Ihrer Einfriedung." },
      { title: "Mülltonnen-Drehteller", text: "Clevere Handhabung ohne Kraftaufwand. Mit unserem Drehmechanismus wird der Umgang mit schweren Mülltonnen zur einfachen Sache. Eine ansehnliche Lösung, die das Gesamtdesign des Tores nicht stört." },
      { title: "Video-Türsprechanlage", text: "Ein Gefühl von Sicherheit ist unbezahlbar. Mit der Video-Türsprechanlage sehen Sie genau, wer klingelt oder sich draußen bewegt – ob Sie im Wohnzimmer sitzen oder gerade auf der Arbeit sind. Dank der Verbindung mit der Handy-App haben Sie den vollen Überblick und Ruhe in jeder Situation." },
    ],
    tags: ["iOS", "Android"],
    ctaHeading: "Sie wissen nicht, was zu Ihrem Eingang passt?",
    ctaText: "Wir gehen es vor Ort mit Ihnen durch und empfehlen nur, was wirklich Sinn ergibt. Nichts darüber hinaus.",
    cta: "Angebot anfragen",
  },
}

// ---------------------------------------------------------------------------
// PŘÍPRAVNÉ PRÁCE (app/pripravne-prace/page.tsx)
// `services` = přehled navazujících prací, `phases` = detailní stavební příprava.
// ---------------------------------------------------------------------------

export const pripravneContent = {
  cs: {
    kicker: "Přípravné práce",
    heading: "Pevné základy pro celý projekt",
    subtitle:
      "Kvalitní a dlouhodobě stabilní plot či pergola vyžadují pevné základy. Kompletní přípravné práce, jako jsou výkopy, betonáž základů a realizace podezdívek, zajistíme profesionálně od A do Z, aby na sebe vše dokonale navazovalo.",
    intro:
      "Nezajišťujeme pouze vlastní výrobu a montáž. Postaráme se také o všechny navazující práce a koordinaci potřebných profesí. Nemusíte hledat další dodavatele ani řešit termíny jednotlivých řemeslníků.",
    servicesTitle: "Podle rozsahu zakázky pro vás zajistíme například:",
    services: [
      "Úpravy terénu před i po dokončení montáže",
      "Zemní a výkopové práce",
      "Hutnění a srovnání terénu",
      "Stavební a zednické práce",
      "Betonování základů a patek",
      "Přípravu základů pro posuvné brány",
      "Protažení kabelových rozvodů",
      "Elektroinstalaci pro pohony bran, osvětlení a videotelefony",
      "Odvoz zeminy a suti po dokončení prací",
      "Koordinaci všech navazujících profesí",
    ],
    outro:
      "Díky tomu máte po celou dobu realizace pouze jednoho partnera a jeden kontakt – KONSTANTU. O vše se postaráme my.",
    phasesKicker: "Stavební příprava krok za krokem",
    phasesHeading: "Co všechno se stihne, než přijde hliník",
    phases: [
      {
        title: "Zaměření a trasování",
        lead: "Než se kopne do země, je potřeba terén dokonale připravit a zkontrolovat.",
        items: [
          { t: "Laserové vytyčení tras a výšek", d: "Přesné určení linie plotu a nulové výšky, aby byl plot v rovině i v mírném svahu." },
          { t: "Detekce inženýrských sítí", d: "Ověříme, případně ručními sondami zkontrolujeme, zda v místě výkopu nevedou staré kabely, plyn nebo vodovod." },
          { t: "Demontáž a likvidace starého oplocení", d: "Odstraníme původní pletivo, dřevěná plotová pole i staré ocelové sloupky včetně jejich ekologické likvidace." },
        ],
      },
      {
        title: "Výkopové a zemní práce",
        lead: "Tady se definuje pevný základ celého plotu.",
        items: [
          { t: "Strojní vrtání děr pro sloupky", d: "Zemním vrtákem vyvrtáme čisté díry do nezámrzné hloubky, standardně 70–80 cm." },
          { t: "Výkop průběžného základového pásu", d: "Rýha pro betonový základ pod podezdívku nebo pod samonosnou bránu, kde je potřeba masivní betonový blok." },
          { t: "Terénní úpravy a odvoz zeminy", d: "Srovnáme terén v linii plotu a přebytečnou zeminu i kamení naložíme a odvezeme na skládku." },
        ],
      },
      {
        title: "Betonářské a zednické práce",
        lead: "Příprava podkladů, na které se pak montuje hliník.",
        items: [
          { t: "Armování", d: "Ocelové armovací koše a dráty do betonu, aby základ v zimě nepopraskal a udržel váhu těžké brány." },
          { t: "Betonáž základů", d: "Lití a hutnění betonu do vyvrtaných děr nebo do základových pasů." },
          { t: "Zdění a betonáž KB bloků a ztraceného bednění", d: "Pokud nechcete sloupky přímo do země, ale zděnou podezdívku nebo betonové sloupky, tvárnice založíme, vystavíme a vylijeme betonem." },
          { t: "Betonování hliníkových sloupků", d: "S kompletním hliníkovým motivem získáte sladěný plot, bránu i sloupky v jednotném designu. Hliník nerezaví, nehnije a nemusí se natírat – sloupky odborně zabetonujeme a vy přebíráte hotové dílo." },
          { t: "Osazení betonových podhrabových desek", d: "Montáž držáků a usazení desek mezi sloupky – ideální řešení místo podezdívky, které chrání hliníkový dílec při sekání trávy." },
        ],
      },
      {
        title: "Elektro příprava",
        lead: "Hliníkový plot bývá spojený s automatizací a chytrou domácností. Bez kabelů to nepůjde.",
        items: [
          { t: "Výkopové rýhy pro chráničky", d: "Trasy pro kabely pod zemí – mezi domem a bránou i mezi sloupky brány navzájem." },
          { t: "Pokládka husích krků a chrániček", d: "Plastové chráničky, kterými se následně protáhnou kabely, aby byly chráněné před vlhkostí a tlakem země." },
          { t: "Příprava kabeláže pro periferie", d: "Motor brány (silový kabel 230 V), bezpečnostní fotobuňky na obě strany průjezdu, výstražný LED maják, venkovní klika s kódovou klávesnicí nebo čtečkou čipů a videotelefon u branky." },
        ],
      },
      {
        title: "Začištění a předání díla",
        lead: "Aby po odjezdu firmy zahrada nevypadala jako po výbuchu.",
        items: [
          { t: "Obsyp a hutnění", d: "Zásyp prostorů kolem betonových základů okrasným kačírkem, štěrkem nebo původní zeminou." },
          { t: "Hrubé urovnání terénu", d: "Okolí plotu uvedeme do stavu, kdy můžete rovnou zasít trávu." },
          { t: "Zaškolení a předvedení", d: "Při předání vám vše názorně ukážeme a vysvětlíme. Budete přesně vědět, jak plotový systém používat, abyste předešli jeho poškození a zajistili bezproblémový chod na desítky let." },
        ],
      },
    ],
    ctaHeading: "Nemáte hotové základy ani podezdívku?",
    ctaText: "Vyřešíme to postupně. Popište nám situaci a přiložte fotku nebo nákres – ozveme se, zaměříme a naceníme.",
    cta: "Poptat stavební přípravu",
  },
  sk: {
    kicker: "Prípravné práce",
    heading: "Pevné základy pre celý projekt",
    subtitle:
      "Kvalitný a dlhodobo stabilný plot či pergola vyžadujú pevné základy. Kompletné prípravné práce, ako sú výkopy, betonáž základov a realizácia podmuroviek, zabezpečíme profesionálne od A po Z, aby na seba všetko dokonale nadväzovalo.",
    intro:
      "Nezabezpečujeme len vlastnú výrobu a montáž. Postaráme sa aj o všetky nadväzujúce práce a koordináciu potrebných profesií. Nemusíte hľadať ďalších dodávateľov ani riešiť termíny jednotlivých remeselníkov.",
    servicesTitle: "Podľa rozsahu zákazky pre vás zabezpečíme napríklad:",
    services: [
      "Úpravy terénu pred aj po dokončení montáže",
      "Zemné a výkopové práce",
      "Hutnenie a zrovnanie terénu",
      "Stavebné a murárske práce",
      "Betónovanie základov a pätiek",
      "Prípravu základov pre posuvné brány",
      "Pretiahnutie káblových rozvodov",
      "Elektroinštaláciu pre pohony brán, osvetlenie a videotelefóny",
      "Odvoz zeminy a sute po dokončení prác",
      "Koordináciu všetkých nadväzujúcich profesií",
    ],
    outro:
      "Vďaka tomu máte počas celej realizácie iba jedného partnera a jeden kontakt – KONSTANTU. O všetko sa postaráme my.",
    phasesKicker: "Stavebná príprava krok za krokom",
    phasesHeading: "Čo všetko sa stihne, kým príde hliník",
    phases: [
      {
        title: "Zameranie a trasovanie",
        lead: "Skôr než sa kopne do zeme, treba terén dokonale pripraviť a skontrolovať.",
        items: [
          { t: "Laserové vytýčenie trás a výšok", d: "Presné určenie línie plota a nulovej výšky, aby bol plot v rovine aj v miernom svahu." },
          { t: "Detekcia inžinierskych sietí", d: "Overíme, prípadne ručnými sondami skontrolujeme, či v mieste výkopu nevedú staré káble, plyn alebo vodovod." },
          { t: "Demontáž a likvidácia starého oplotenia", d: "Odstránime pôvodné pletivo, drevené plotové polia aj staré oceľové stĺpiky vrátane ich ekologickej likvidácie." },
        ],
      },
      {
        title: "Výkopové a zemné práce",
        lead: "Tu sa definuje pevný základ celého plota.",
        items: [
          { t: "Strojné vŕtanie dier pre stĺpiky", d: "Zemným vrtákom vyvŕtame čisté diery do nezámrznej hĺbky, štandardne 70–80 cm." },
          { t: "Výkop priebežného základového pásu", d: "Ryha pre betónový základ pod podmurovku alebo pod samonosnú bránu, kde je potrebný masívny betónový blok." },
          { t: "Terénne úpravy a odvoz zeminy", d: "Zrovnáme terén v línii plota a prebytočnú zeminu aj kamene naložíme a odvezieme na skládku." },
        ],
      },
      {
        title: "Betonárske a murárske práce",
        lead: "Príprava podkladov, na ktoré sa potom montuje hliník.",
        items: [
          { t: "Armovanie", d: "Oceľové armovacie koše a drôty do betónu, aby základ v zime nepopraskal a udržal váhu ťažkej brány." },
          { t: "Betonáž základov", d: "Liatie a hutnenie betónu do vyvŕtaných dier alebo do základových pásov." },
          { t: "Murovanie a betonáž KB blokov a strateného debnenia", d: "Ak nechcete stĺpiky priamo do zeme, ale murovanú podmurovku alebo betónové stĺpiky, tvárnice založíme, vystaviame a vylejeme betónom." },
          { t: "Betónovanie hliníkových stĺpikov", d: "S kompletným hliníkovým motívom získate zladený plot, bránu aj stĺpiky v jednotnom dizajne. Hliník nehrdzavie, nehnije a netreba ho natierať – stĺpiky odborne zabetónujeme a vy preberáte hotové dielo." },
          { t: "Osadenie betónových podhrabových dosiek", d: "Montáž držiakov a usadenie dosiek medzi stĺpiky – ideálne riešenie namiesto podmurovky, ktoré chráni hliníkový dielec pri kosení trávy." },
        ],
      },
      {
        title: "Elektro príprava",
        lead: "Hliníkový plot býva spojený s automatizáciou a inteligentnou domácnosťou. Bez káblov to nepôjde.",
        items: [
          { t: "Výkopové ryhy pre chráničky", d: "Trasy pre káble pod zemou – medzi domom a bránou aj medzi stĺpikmi brány navzájom." },
          { t: "Pokládka husích krkov a chráničiek", d: "Plastové chráničky, ktorými sa následne pretiahnu káble, aby boli chránené pred vlhkosťou a tlakom zeme." },
          { t: "Príprava kabeláže pre periférie", d: "Motor brány (silový kábel 230 V), bezpečnostné fotobunky na obe strany prejazdu, výstražný LED maják, vonkajšia kľučka s kódovou klávesnicou alebo čítačkou čipov a videotelefón pri bránke." },
        ],
      },
      {
        title: "Začistenie a odovzdanie diela",
        lead: "Aby po odchode firmy záhrada nevyzerala ako po výbuchu.",
        items: [
          { t: "Obsyp a hutnenie", d: "Zásyp priestorov okolo betónových základov okrasným kačírkom, štrkom alebo pôvodnou zeminou." },
          { t: "Hrubé urovnanie terénu", d: "Okolie plota uvedieme do stavu, keď môžete rovno zasiať trávu." },
          { t: "Zaškolenie a predvedenie", d: "Pri odovzdaní vám všetko názorne ukážeme a vysvetlíme. Budete presne vedieť, ako plotový systém používať, aby ste predišli jeho poškodeniu a zaistili bezproblémový chod na desiatky rokov." },
        ],
      },
    ],
    ctaHeading: "Nemáte hotové základy ani podmurovku?",
    ctaText: "Vyriešime to postupne. Opíšte nám situáciu a priložte fotku alebo nákres – ozveme sa, zameriame a naceníme.",
    cta: "Dopytovať stavebnú prípravu",
  },
  de: {
    kicker: "Vorbereitende Arbeiten",
    heading: "Ein festes Fundament für das ganze Projekt",
    subtitle:
      "Ein hochwertiger, dauerhaft stabiler Zaun oder eine Pergola brauchen ein festes Fundament. Die kompletten vorbereitenden Arbeiten – Aushub, Betonieren der Fundamente und Sockelmauern – übernehmen wir professionell von A bis Z, damit alles perfekt ineinandergreift.",
    intro:
      "Wir kümmern uns nicht nur um Fertigung und Montage, sondern auch um alle anschließenden Arbeiten und die Koordination der nötigen Gewerke. Sie müssen keine weiteren Lieferanten suchen und keine Termine einzelner Handwerker abstimmen.",
    servicesTitle: "Je nach Auftragsumfang übernehmen wir für Sie zum Beispiel:",
    services: [
      "Geländeanpassungen vor und nach der Montage",
      "Erd- und Aushubarbeiten",
      "Verdichten und Einebnen des Geländes",
      "Bau- und Maurerarbeiten",
      "Betonieren von Fundamenten und Punktfundamenten",
      "Vorbereitung der Fundamente für Schiebetore",
      "Verlegen der Kabelleitungen",
      "Elektroinstallation für Torantriebe, Beleuchtung und Video-Türsprechanlagen",
      "Abtransport von Erde und Bauschutt nach Abschluss der Arbeiten",
      "Koordination aller beteiligten Gewerke",
    ],
    outro:
      "So haben Sie während der gesamten Umsetzung nur einen Partner und einen Ansprechpartner – KONSTANTA. Um alles Weitere kümmern wir uns.",
    phasesKicker: "Bauvorbereitung Schritt für Schritt",
    phasesHeading: "Was alles passiert, bevor das Aluminium kommt",
    phases: [
      {
        title: "Aufmaß und Absteckung",
        lead: "Bevor der erste Spatenstich erfolgt, muss das Gelände gründlich vorbereitet und geprüft werden.",
        items: [
          { t: "Laserabsteckung von Trassen und Höhen", d: "Genaue Festlegung der Zaunlinie und der Nullhöhe, damit der Zaun auch am leichten Hang in Waage steht." },
          { t: "Ortung von Versorgungsleitungen", d: "Wir prüfen, gegebenenfalls mit Handsondierungen, ob im Aushubbereich alte Kabel, Gas- oder Wasserleitungen verlaufen." },
          { t: "Demontage und Entsorgung des alten Zauns", d: "Wir entfernen altes Drahtgeflecht, Holzzaunfelder und alte Stahlpfosten inklusive fachgerechter Entsorgung." },
        ],
      },
      {
        title: "Aushub- und Erdarbeiten",
        lead: "Hier entsteht das feste Fundament des gesamten Zauns.",
        items: [
          { t: "Maschinelles Bohren der Pfostenlöcher", d: "Mit dem Erdbohrer bohren wir saubere Löcher bis in frostfreie Tiefe, standardmäßig 70–80 cm." },
          { t: "Aushub des durchgehenden Streifenfundaments", d: "Graben für das Betonfundament unter der Sockelmauer oder unter einem freitragenden Tor, wo ein massiver Betonblock nötig ist." },
          { t: "Geländearbeiten und Abtransport der Erde", d: "Wir ebnen das Gelände entlang der Zaunlinie ein und fahren überschüssige Erde und Steine zur Deponie ab." },
        ],
      },
      {
        title: "Beton- und Maurerarbeiten",
        lead: "Vorbereitung der Untergründe, auf die anschließend das Aluminium montiert wird.",
        items: [
          { t: "Bewehrung", d: "Stahlbewehrungskörbe und -drähte im Beton, damit das Fundament im Winter nicht reißt und das Gewicht eines schweren Tors trägt." },
          { t: "Betonieren der Fundamente", d: "Einbringen und Verdichten des Betons in den gebohrten Löchern oder Streifenfundamenten." },
          { t: "Mauern und Betonieren von KB-Steinen und Schalungssteinen", d: "Wenn Sie keine Pfosten direkt im Boden, sondern eine gemauerte Sockelmauer oder Betonpfeiler wünschen, setzen, mauern und verfüllen wir die Steine mit Beton." },
          { t: "Einbetonieren der Aluminiumpfosten", d: "Mit dem durchgängigen Aluminiummotiv erhalten Sie Zaun, Tor und Pfosten in einheitlichem Design. Aluminium rostet nicht, verrottet nicht und muss nicht gestrichen werden – die Pfosten betonieren wir fachgerecht ein, Sie übernehmen das fertige Werk." },
          { t: "Einbau von Betonunterbauplatten", d: "Montage der Halter und Einsetzen der Platten zwischen die Pfosten – die ideale Alternative zur Sockelmauer, die das Aluminiumelement beim Rasenmähen schützt." },
        ],
      },
      {
        title: "Elektrovorbereitung",
        lead: "Ein Aluminiumzaun ist meist mit Automatisierung und Smart Home verbunden. Ohne Kabel geht das nicht.",
        items: [
          { t: "Gräben für Leerrohre", d: "Kabeltrassen unter der Erde – zwischen Haus und Tor sowie zwischen den Torpfosten." },
          { t: "Verlegen von Wellrohren und Leerrohren", d: "Kunststoffrohre, durch die anschließend die Kabel gezogen werden, damit sie vor Feuchtigkeit und Erddruck geschützt sind." },
          { t: "Vorbereitung der Verkabelung für die Peripherie", d: "Torantrieb (230-V-Leitung), Sicherheitslichtschranken auf beiden Seiten der Durchfahrt, LED-Warnleuchte, Außendrücker mit Codetastatur oder Chipleser und Video-Türsprechanlage an der Gartentür." },
        ],
      },
      {
        title: "Endarbeiten und Übergabe",
        lead: "Damit der Garten nach unserer Abfahrt nicht aussieht wie nach einer Explosion.",
        items: [
          { t: "Verfüllen und Verdichten", d: "Verfüllen der Bereiche um die Betonfundamente mit Zierkies, Schotter oder dem ursprünglichen Erdreich." },
          { t: "Grobes Einebnen des Geländes", d: "Wir bringen die Umgebung des Zauns in einen Zustand, in dem Sie direkt Rasen säen können." },
          { t: "Einweisung und Vorführung", d: "Bei der Übergabe zeigen und erklären wir Ihnen alles anschaulich. Sie wissen dann genau, wie das Zaunsystem zu bedienen ist, um Schäden zu vermeiden und einen störungsfreien Betrieb über Jahrzehnte zu sichern." },
        ],
      },
    ],
    ctaHeading: "Sie haben noch kein Fundament und keine Sockelmauer?",
    ctaText: "Wir lösen das Schritt für Schritt. Beschreiben Sie uns die Situation und fügen Sie ein Foto oder eine Skizze bei – wir melden uns, messen auf und kalkulieren.",
    cta: "Bauvorbereitung anfragen",
  },
}

// ---------------------------------------------------------------------------
// PRO FIRMY (app/pro-firmy/page.tsx)
// Pořadí `segments` je svázané s polem ikon v app/pro-firmy/page.tsx.
// ---------------------------------------------------------------------------

export const proFirmyContent = {
  cs: {
    kicker: "Pro firmy",
    heading: "Pro firmy, developery a projektové partnery",
    subtitle:
      "Pomáháme převést návrh do reality tak, aby se během realizace neobjevovaly zbytečné problémy. Od prvního technického řešení až po montáž máme celý proces pod kontrolou.",
    claimLabel: "KONSTANTA",
    segments: [
      {
        title: "Architekti",
        lead: "Dobrý návrh nekončí u výkresu. Musí fungovat i po technické stránce.",
        text: "Konzultujeme řešení ještě před realizací a pomáháme najít detaily, které mohou později komplikovat montáž nebo provoz. Díky tomu není potřeba složitě hledat kompromisy mezi návrhem a skutečným provedením.",
        claim: "Aby váš návrh vypadal a fungoval dobře i po dokončení stavby.",
      },
      {
        title: "Developeři",
        lead: "Na stavbě rozhodují termíny, koordinace a schopnost věci dotáhnout bez komplikací.",
        text: "Dodáváme ploty, brány i související prvky jako jeden celek. Nemusíte koordinovat několik dodavatelů ani řešit, kdo za co odpovídá. Díky tomu se realizace zjednoduší a je pod větší kontrolou.",
        claim: "Méně koordinace, méně rizik, plynulejší průběh stavby.",
      },
      {
        title: "Výrobní firmy a průmyslové areály",
        lead: "V provozu není prostor pro časté opravy nebo zbytečné odstávky.",
        text: "Navrhujeme řešení, která zvládnou každodenní zatížení a nevyžadují neustálou pozornost. Pokud nastane problém, umíme reagovat rychle a servis řešit přímo na místě.",
        claim: "Zařízení, které slouží, funguje, a navíc je hezké.",
      },
      {
        title: "Obce a veřejné projekty",
        lead: "Investice by měla dávat smysl nejen při převzetí, ale i za několik let.",
        text: "Dodáváme řešení s potřebnou dokumentací, certifikací a jasně definovanými parametry. Důraz klademe na dlouhou životnost a rozumné náklady na provoz i údržbu.",
        claim: "Řešení, která fungují dlouhodobě a bez zbytečných výdajů navíc.",
      },
      {
        title: "Generální dodavatelé",
        lead: "Každá část projektu musí navazovat na další.",
        text: "Umíme se přizpůsobit harmonogramu stavby, koordinovat návaznosti s ostatními profesemi a dodat řešení v dohodnutém termínu i kvalitě.",
        claim: "Spolehlivá součást každého dobře řízeného projektu.",
      },
    ],
    subdodavkyTitle: "Subdodávky",
    subdodavkyText:
      "Pro firemní zákazníky, stavební firmy a partnery zajišťujeme spolehlivé subdodávky hliníkových profilů, systémů a komponentů. Zakládáme si na precizním zpracování, dodržování termínů a produktech, na které se můžete ve svých projektech plně spolehnout.",
    qualityKicker: "Konstanta — sázíme na kvalitu",
    qualityHeading: "Na čem si zakládáme",
    qualityPoints: [
      "Konzultujeme řešení už ve fázi návrhu",
      "Dodáváme kompletní řešení od výroby po montáž",
      "Umíme si poradit i se složitými a atypickými podmínkami na stavbě",
      "Dodržujeme domluvené termíny a postupy",
      "Myslíme na dlouhodobé fungování, nejen na předání díla",
    ],
    ctaHeading: "Chcete jistotu?",
    ctaText: "Potřebujete konzultovat projekt nebo připravit řešení pro konkrétní stavbu? Kontaktujte nás.",
    cta: "Kontaktovat",
    ctaCall: "Zavolat",
  },
  sk: {
    kicker: "Pre firmy",
    heading: "Pre firmy, developerov a projektových partnerov",
    subtitle:
      "Pomáhame previesť návrh do reality tak, aby sa počas realizácie neobjavovali zbytočné problémy. Od prvého technického riešenia až po montáž máme celý proces pod kontrolou.",
    claimLabel: "KONSTANTA",
    segments: [
      {
        title: "Architekti",
        lead: "Dobrý návrh nekončí pri výkrese. Musí fungovať aj po technickej stránke.",
        text: "Konzultujeme riešenie ešte pred realizáciou a pomáhame nájsť detaily, ktoré môžu neskôr komplikovať montáž alebo prevádzku. Vďaka tomu netreba zložito hľadať kompromisy medzi návrhom a skutočným prevedením.",
        claim: "Aby váš návrh vyzeral a fungoval dobre aj po dokončení stavby.",
      },
      {
        title: "Developeri",
        lead: "Na stavbe rozhodujú termíny, koordinácia a schopnosť veci dotiahnuť bez komplikácií.",
        text: "Dodávame ploty, brány aj súvisiace prvky ako jeden celok. Nemusíte koordinovať niekoľko dodávateľov ani riešiť, kto za čo zodpovedá. Vďaka tomu sa realizácia zjednoduší a je pod väčšou kontrolou.",
        claim: "Menej koordinácie, menej rizík, plynulejší priebeh stavby.",
      },
      {
        title: "Výrobné firmy a priemyselné areály",
        lead: "V prevádzke nie je priestor na časté opravy alebo zbytočné odstávky.",
        text: "Navrhujeme riešenia, ktoré zvládnu každodenné zaťaženie a nevyžadujú neustálu pozornosť. Ak nastane problém, vieme reagovať rýchlo a servis riešiť priamo na mieste.",
        claim: "Zariadenie, ktoré slúži, funguje a navyše je pekné.",
      },
      {
        title: "Obce a verejné projekty",
        lead: "Investícia by mala dávať zmysel nielen pri prevzatí, ale aj o niekoľko rokov.",
        text: "Dodávame riešenia s potrebnou dokumentáciou, certifikáciou a jasne definovanými parametrami. Dôraz kladieme na dlhú životnosť a rozumné náklady na prevádzku aj údržbu.",
        claim: "Riešenia, ktoré fungujú dlhodobo a bez zbytočných výdavkov navyše.",
      },
      {
        title: "Generálni dodávatelia",
        lead: "Každá časť projektu musí nadväzovať na ďalšiu.",
        text: "Vieme sa prispôsobiť harmonogramu stavby, koordinovať nadväznosti s ostatnými profesiami a dodať riešenie v dohodnutom termíne aj kvalite.",
        claim: "Spoľahlivá súčasť každého dobre riadeného projektu.",
      },
    ],
    subdodavkyTitle: "Subdodávky",
    subdodavkyText:
      "Pre firemných zákazníkov, stavebné firmy a partnerov zabezpečujeme spoľahlivé subdodávky hliníkových profilov, systémov a komponentov. Zakladáme si na precíznom spracovaní, dodržiavaní termínov a produktoch, na ktoré sa môžete vo svojich projektoch plne spoľahnúť.",
    qualityKicker: "Konstanta — stavíme na kvalite",
    qualityHeading: "Na čom si zakladáme",
    qualityPoints: [
      "Konzultujeme riešenie už vo fáze návrhu",
      "Dodávame kompletné riešenie od výroby po montáž",
      "Vieme si poradiť aj so zložitými a atypickými podmienkami na stavbe",
      "Dodržiavame dohodnuté termíny a postupy",
      "Myslíme na dlhodobé fungovanie, nielen na odovzdanie diela",
    ],
    ctaHeading: "Chcete istotu?",
    ctaText: "Potrebujete konzultovať projekt alebo pripraviť riešenie pre konkrétnu stavbu? Kontaktujte nás.",
    cta: "Kontaktovať",
    ctaCall: "Zavolať",
  },
  de: {
    kicker: "Für Firmen",
    heading: "Für Firmen, Bauträger und Projektpartner",
    subtitle:
      "Wir helfen, den Entwurf so in die Realität zu überführen, dass während der Umsetzung keine unnötigen Probleme auftreten. Von der ersten technischen Lösung bis zur Montage haben wir den gesamten Prozess im Griff.",
    claimLabel: "KONSTANTA",
    segments: [
      {
        title: "Architekten",
        lead: "Ein guter Entwurf endet nicht bei der Zeichnung. Er muss auch technisch funktionieren.",
        text: "Wir beraten zur Lösung schon vor der Umsetzung und helfen, Details zu finden, die später Montage oder Betrieb erschweren könnten. So müssen Sie keine mühsamen Kompromisse zwischen Entwurf und tatsächlicher Ausführung suchen.",
        claim: "Damit Ihr Entwurf auch nach Fertigstellung gut aussieht und gut funktioniert.",
      },
      {
        title: "Bauträger",
        lead: "Auf der Baustelle entscheiden Termine, Koordination und die Fähigkeit, Dinge ohne Komplikationen zu Ende zu bringen.",
        text: "Wir liefern Zäune, Tore und zugehörige Elemente als ein Gesamtpaket. Sie müssen weder mehrere Lieferanten koordinieren noch klären, wer wofür verantwortlich ist. Das vereinfacht die Umsetzung und macht sie besser steuerbar.",
        claim: "Weniger Koordination, weniger Risiken, ein reibungsloserer Bauablauf.",
      },
      {
        title: "Produktionsbetriebe und Industrieareale",
        lead: "Im laufenden Betrieb ist kein Platz für häufige Reparaturen oder unnötige Stillstände.",
        text: "Wir entwickeln Lösungen, die der täglichen Belastung standhalten und keine ständige Aufmerksamkeit erfordern. Tritt ein Problem auf, reagieren wir schnell und lösen den Service direkt vor Ort.",
        claim: "Anlagen, die dienen, funktionieren – und dazu noch gut aussehen.",
      },
      {
        title: "Gemeinden und öffentliche Projekte",
        lead: "Eine Investition sollte nicht nur bei der Übernahme Sinn ergeben, sondern auch nach einigen Jahren.",
        text: "Wir liefern Lösungen mit der nötigen Dokumentation, Zertifizierung und klar definierten Parametern. Unser Fokus liegt auf langer Lebensdauer und vernünftigen Betriebs- und Wartungskosten.",
        claim: "Lösungen, die langfristig funktionieren – ohne unnötige Zusatzkosten.",
      },
      {
        title: "Generalunternehmer",
        lead: "Jeder Projektabschnitt muss an den nächsten anschließen.",
        text: "Wir passen uns dem Bauzeitenplan an, koordinieren die Schnittstellen mit den anderen Gewerken und liefern die Lösung im vereinbarten Termin und in vereinbarter Qualität.",
        claim: "Ein verlässlicher Baustein jedes gut geführten Projekts.",
      },
    ],
    subdodavkyTitle: "Zulieferungen",
    subdodavkyText:
      "Für Firmenkunden, Bauunternehmen und Partner liefern wir zuverlässig Aluminiumprofile, Systeme und Komponenten zu. Wir legen Wert auf präzise Verarbeitung, eingehaltene Termine und Produkte, auf die Sie sich in Ihren Projekten voll verlassen können.",
    qualityKicker: "Konstanta — wir setzen auf Qualität",
    qualityHeading: "Worauf wir Wert legen",
    qualityPoints: [
      "Wir beraten zur Lösung bereits in der Entwurfsphase",
      "Wir liefern die Komplettlösung von der Fertigung bis zur Montage",
      "Wir kommen auch mit schwierigen und untypischen Bedingungen auf der Baustelle zurecht",
      "Wir halten vereinbarte Termine und Abläufe ein",
      "Wir denken an den langfristigen Betrieb, nicht nur an die Übergabe",
    ],
    ctaHeading: "Wollen Sie Sicherheit?",
    ctaText: "Sie möchten ein Projekt besprechen oder eine Lösung für ein konkretes Bauvorhaben vorbereiten? Kontaktieren Sie uns.",
    cta: "Kontakt aufnehmen",
    ctaCall: "Anrufen",
  },
}

// ---------------------------------------------------------------------------
// ZÁKLADY A PŘÍPRAVA (app/konf/zaklady/page.tsx)
// Samostatná větev konfigurátoru pro zákazníky bez hotových základů —
// místo kroků se sbírá popis situace a příloha (foto / nákres).
// ---------------------------------------------------------------------------

export const zakladyContent = {
  cs: {
    eyebrow: "Konfigurátor zdarma",
    heading: "Základy a příprava",
    subtitle: "Příprava terénu, podezdívky a stavební práce před montáží.",
    paragraphs: [
      "Nemáte ještě hotové základy nebo podezdívku? Nevadí, vyřešíme to postupně. Než si začnete vybírat konkrétní podobu plotu v konfigurátoru, je potřeba mít připravený pevný základ. Pokud váš pozemek ještě nemá vyzděné sloupky, podezdívku nebo potřebuje kompletní stavební přípravu, zastavte se na chvíli tady.",
      "Napište nám v kostce, co vás čeká, popište situaci do formuláře nebo přiložte fotku místa či nákres pro lepší představu. My se vám ozveme, domluvíme osobní schůzku, vše na místě zaměříme, navrhneme ideální stavební řešení a naceníme — vše do posledního detailu a bez jakéhokoliv navýšení ceny po dokončení realizace.",
    ],
    highlightTitle: "Kompletní realizace od A do Z",
    highlightText:
      "Když si vyberete nás, získáte plný servis pod jednou střechou. Zabezpečíme pro vás kompletní stavbu oplocení — od návrhu přes dodávku materiálu až po samotnou stavbu. Nemusíte ztrácet čas hledáním dalších profesí nebo koordinací různých řemeslníků. My neseme odpovědnost za celý projekt, vy jen převezmete hotové dílo.",
    formHeading: "Chci poptat stavební přípravu a základy",
    formIntro: "Popište nám situaci vlastními slovy. Čím víc detailů, tím přesnější odhad vám připravíme.",
    labels: {
      name: "Jméno a příjmení",
      email: "E-mail",
      phone: "Telefon",
      misto: "Místo realizace",
      sluzby: "Co pro vás máme zajistit?",
      message: "Popis situace",
      files: "Fotky nebo nákres",
    },
    placeholders: {
      name: "Jan Novák",
      email: "jan@email.cz",
      phone: "+420 777 123 456",
      misto: "Obec nebo adresa pozemku",
      message: "Např. pozemek ve svahu, staré pletivo na odstranění, chybí podezdívka po celé délce cca 40 m…",
    },
    filesHint: "Až 5 souborů (JPG, PNG, PDF), max. 5 MB každý.",
    /** Klíče musí sedět se `ZAKLADY_SLUZBY` v lib/schemas.tsx — chodí do FormData i do e-mailu. */
    sluzbyHint: "Zaškrtněte vše, co u vás připadá v úvahu. Upřesníme to na místě.",
    sluzby: [
      { id: "zamereni", label: "Zaměření", desc: "Vytyčíme trasu, výšky a zkontrolujeme sítě." },
      { id: "zaklady", label: "Příprava základů", desc: "Výkopy, vrtání pro sloupky a betonáž." },
      { id: "zdeni", label: "Zdění", desc: "Podezdívka, KB bloky nebo ztracené bednění." },
      { id: "montaz", label: "Montáž", desc: "Osazení plotu, brány a branky na hotový základ." },
    ],
    filesButton: "Vybrat soubory",
    filesEmpty: "Zatím nic nevybráno",
    filesRemove: "Odebrat",
    submit: "Odeslat poptávku",
    consent: "Odesláním souhlasíte se zpracováním osobních údajů pro účely vyřízení poptávky.",
    successTitle: "Poptávka odeslána",
    successText: "Ozveme se vám co nevidět a domluvíme termín zaměření.",
    newSitePre: "Web máme spuštěný teprve necelý měsíc. Všechny poptávky z konfigurátoru chodí na ",
    newSitePost: " — kdyby vám odpověď nedorazila, napište nám prosím rovnou na tuhle adresu.",
    backToPicker: "Zpět na výběr konfigurátoru",
  },
  sk: {
    eyebrow: "Konfigurátor zadarmo",
    heading: "Základy a príprava",
    subtitle: "Príprava terénu, podmurovky a stavebné práce pred montážou.",
    paragraphs: [
      "Nemáte ešte hotové základy alebo podmurovku? Nevadí, vyriešime to postupne. Skôr než si začnete vyberať konkrétnu podobu plota v konfigurátore, je potrebné mať pripravený pevný základ. Ak váš pozemok ešte nemá vymurované stĺpiky, podmurovku alebo potrebuje kompletnú stavebnú prípravu, zastavte sa na chvíľu tu.",
      "Napíšte nám v skratke, čo vás čaká, opíšte situáciu do formulára alebo priložte fotku miesta či nákres pre lepšiu predstavu. My sa vám ozveme, dohodneme osobné stretnutie, všetko na mieste zameriame, navrhneme ideálne stavebné riešenie a naceníme — všetko do posledného detailu a bez akéhokoľvek navýšenia ceny po dokončení realizácie.",
    ],
    highlightTitle: "Kompletná realizácia od A po Z",
    highlightText:
      "Keď si vyberiete nás, získate plný servis pod jednou strechou. Zabezpečíme pre vás kompletnú stavbu oplotenia — od návrhu cez dodávku materiálu až po samotnú stavbu. Nemusíte strácať čas hľadaním ďalších profesií alebo koordináciou rôznych remeselníkov. My nesieme zodpovednosť za celý projekt, vy len preberiete hotové dielo.",
    formHeading: "Chcem dopytovať stavebnú prípravu a základy",
    formIntro: "Opíšte nám situáciu vlastnými slovami. Čím viac detailov, tým presnejší odhad vám pripravíme.",
    labels: {
      name: "Meno a priezvisko",
      email: "E-mail",
      phone: "Telefón",
      misto: "Miesto realizácie",
      sluzby: "Čo pre vás máme zabezpečiť?",
      message: "Opis situácie",
      files: "Fotky alebo nákres",
    },
    placeholders: {
      name: "Ján Novák",
      email: "jan@email.sk",
      phone: "+421 900 123 456",
      misto: "Obec alebo adresa pozemku",
      message: "Napr. pozemok vo svahu, staré pletivo na odstránenie, chýba podmurovka po celej dĺžke cca 40 m…",
    },
    filesHint: "Až 5 súborov (JPG, PNG, PDF), max. 5 MB každý.",
    sluzbyHint: "Zaškrtnite všetko, čo u vás prichádza do úvahy. Upresníme to na mieste.",
    sluzby: [
      { id: "zamereni", label: "Zameranie", desc: "Vytýčime trasu, výšky a skontrolujeme siete." },
      { id: "zaklady", label: "Príprava základov", desc: "Výkopy, vŕtanie pre stĺpiky a betonáž." },
      { id: "zdeni", label: "Murovanie", desc: "Podmurovka, KB bloky alebo stratené debnenie." },
      { id: "montaz", label: "Montáž", desc: "Osadenie plota, brány a bránky na hotový základ." },
    ],
    filesButton: "Vybrať súbory",
    filesEmpty: "Zatiaľ nič nevybrané",
    filesRemove: "Odobrať",
    submit: "Odoslať dopyt",
    consent: "Odoslaním súhlasíte so spracovaním osobných údajov na účely vybavenia dopytu.",
    successTitle: "Dopyt odoslaný",
    successText: "Ozveme sa vám čoskoro a dohodneme termín zamerania.",
    newSitePre: "Web máme spustený sotva mesiac. Všetky dopyty z konfigurátora chodia na ",
    newSitePost: " — keby vám odpoveď nedorazila, napíšte nám prosím rovno na túto adresu.",
    backToPicker: "Späť na výber konfigurátora",
  },
  de: {
    eyebrow: "Kostenloser Konfigurator",
    heading: "Fundament und Vorbereitung",
    subtitle: "Geländevorbereitung, Sockelmauern und Bauarbeiten vor der Montage.",
    paragraphs: [
      "Sie haben noch kein Fundament und keine Sockelmauer? Kein Problem, wir lösen das Schritt für Schritt. Bevor Sie im Konfigurator die konkrete Zaunform auswählen, muss ein festes Fundament vorbereitet sein. Wenn Ihr Grundstück noch keine gemauerten Pfeiler oder Sockelmauer hat oder eine komplette Bauvorbereitung braucht, halten Sie hier kurz an.",
      "Schreiben Sie uns kurz, was ansteht, beschreiben Sie die Situation im Formular oder fügen Sie ein Foto des Ortes oder eine Skizze bei. Wir melden uns, vereinbaren einen persönlichen Termin, messen alles vor Ort auf, entwerfen die ideale bauliche Lösung und kalkulieren sie — bis ins letzte Detail und ohne jede Preiserhöhung nach Abschluss der Arbeiten.",
    ],
    highlightTitle: "Komplette Umsetzung von A bis Z",
    highlightText:
      "Wenn Sie sich für uns entscheiden, erhalten Sie den vollen Service aus einer Hand. Wir übernehmen den kompletten Zaunbau — vom Entwurf über die Materiallieferung bis zur eigentlichen Ausführung. Sie müssen keine Zeit mit der Suche nach weiteren Gewerken oder der Koordination verschiedener Handwerker verlieren. Wir tragen die Verantwortung für das gesamte Projekt, Sie übernehmen nur das fertige Werk.",
    formHeading: "Ich möchte Bauvorbereitung und Fundament anfragen",
    formIntro: "Beschreiben Sie uns die Situation in eigenen Worten. Je mehr Details, desto genauer wird unsere Einschätzung.",
    labels: {
      name: "Vor- und Nachname",
      email: "E-Mail",
      phone: "Telefon",
      misto: "Ort der Umsetzung",
      sluzby: "Was sollen wir für Sie übernehmen?",
      message: "Beschreibung der Situation",
      files: "Fotos oder Skizze",
    },
    placeholders: {
      name: "Max Mustermann",
      email: "max@email.de",
      phone: "+420 777 123 456",
      misto: "Gemeinde oder Adresse des Grundstücks",
      message: "Z. B. Grundstück in Hanglage, altes Drahtgeflecht zu entfernen, Sockelmauer fehlt auf ganzer Länge von ca. 40 m…",
    },
    filesHint: "Bis zu 5 Dateien (JPG, PNG, PDF), max. 5 MB pro Datei.",
    sluzbyHint: "Kreuzen Sie alles an, was für Sie infrage kommt. Details klären wir vor Ort.",
    sluzby: [
      { id: "zamereni", label: "Aufmaß", desc: "Wir stecken Verlauf und Höhen ab und prüfen Leitungen." },
      { id: "zaklady", label: "Fundamentvorbereitung", desc: "Aushub, Bohrungen für Pfosten und Betonage." },
      { id: "zdeni", label: "Mauerarbeiten", desc: "Sockelmauer, KB-Steine oder verlorene Schalung." },
      { id: "montaz", label: "Montage", desc: "Zaun, Tor und Tür auf dem fertigen Fundament setzen." },
    ],
    filesButton: "Dateien auswählen",
    filesEmpty: "Noch nichts ausgewählt",
    filesRemove: "Entfernen",
    submit: "Anfrage senden",
    consent: "Mit dem Absenden stimmen Sie der Verarbeitung Ihrer personenbezogenen Daten zur Bearbeitung der Anfrage zu.",
    successTitle: "Anfrage gesendet",
    successText: "Wir melden uns in Kürze und vereinbaren einen Aufmaßtermin.",
    newSitePre: "Unsere Website ist noch keinen Monat online. Alle Anfragen aus dem Konfigurator laufen unter ",
    newSitePost: " ein — sollte unsere Antwort ausbleiben, schreiben Sie uns bitte direkt an diese Adresse.",
    backToPicker: "Zurück zur Konfiguratorauswahl",
  },
}

// ---------------------------------------------------------------------------
// KONFIGURÁTOR — picker (app/konf/page.tsx)
// ---------------------------------------------------------------------------

export const konfPickerContent = {
  cs: {
    eyebrow: "Konfigurátor zdarma",
    heading: "Váš design, vaše pravidla",
    subtitle: "Zvolte si oplocení, pergolu nebo zábradlí a poskládejte si ideální řešení, které odráží vaši představivost. Na konci vám pošleme kalkulaci.",
    cards: [
      { title: "Oplocení", description: "Brána, branka, sloupky, dílce a motiv na míru vašemu pozemku." },
      { title: "Pergoly", description: "Bioklimatická pergola, zimní zahrada nebo přístřešek se stíněním." },
      { title: "Zábradlí", description: "Skleněné nebo hliníkové zábradlí k terase, balkonu i schodišti." },
      { title: "Základy", description: "Příprava terénu, podezdívky a stavební práce před montáží." },
    ],
    cta: "Spustit konfigurátor",
  },
  sk: {
    eyebrow: "Konfigurátor zadarmo",
    heading: "Váš dizajn, vaše pravidlá",
    subtitle: "Zvoľte si oplotenie, pergolu alebo zábradlie a poskladajte si ideálne riešenie, ktoré odráža vašu predstavivosť. Na konci vám pošleme kalkuláciu.",
    cards: [
      { title: "Oplotenie", description: "Brána, bránka, stĺpiky, dielce a motív na mieru vášmu pozemku." },
      { title: "Pergoly", description: "Bioklimatická pergola, zimná záhrada alebo prístrešok so tienením." },
      { title: "Zábradlie", description: "Sklenené alebo hliníkové zábradlie k terase, balkónu aj schodisku." },
      { title: "Základy", description: "Príprava terénu, podmurovky a stavebné práce pred montážou." },
    ],
    cta: "Spustiť konfigurátor",
  },
  de: {
    eyebrow: "Kostenloser Konfigurator",
    heading: "Ihr Design, Ihre Regeln",
    subtitle: "Wählen Sie Zaun, Pergola oder Geländer und stellen Sie sich die ideale Lösung zusammen, die Ihre Vorstellung widerspiegelt. Am Ende senden wir Ihnen eine Kalkulation.",
    cards: [
      { title: "Zaun", description: "Tor, Tür, Pfosten, Elemente und Motiv nach Maß für Ihr Grundstück." },
      { title: "Pergolen", description: "Bioklimatische Pergola, Wintergarten oder überdachter Unterstand mit Beschattung." },
      { title: "Geländer", description: "Glas- oder Aluminiumgeländer für Terrasse, Balkon und Treppe." },
      { title: "Fundament", description: "Geländevorbereitung, Sockelmauern und Bauarbeiten vor der Montage." },
    ],
    cta: "Konfigurator starten",
  },
}

// ---------------------------------------------------------------------------
// KONFIGURÁTOR OPLOCENÍ — konfCopy / konfSteps / validace
// ---------------------------------------------------------------------------

export const konfContent = {
  cs: {
    heading: "Nakonfigurujte si své oplocení",
    subheading: "Projděte pár kroků a sestavte si bránu, branku, sloupky, plotové dílce i motiv plotu přesně podle sebe. Na konci vám pošleme nezávaznou kalkulaci.",
    next: "Další krok",
    back: "Zpět",
    sendText: "Odeslat poptávku",
    dimensionLabels: { vyska: "Výška (mm)", delka: "Šířka průjezdu (mm)", pocet: "Počet (ks)" },
    steps: ["Brána", "Branka", "Sloupky", "Dílce", "Motiv", "Barva", "Kontakt"],
    validation: {
      brana: "Zvolte typ brány, nebo zaškrtněte, že vjezdovou bránu nechcete.",
      branka: "Zvolte, zda chcete v plotu branku, nebo zaškrtněte, že ji nechcete.",
      /** `{product}` se nahradí názvem vybraného produktu s nevyplněnými rozměry. */
      rozmery: "Vyplňte prosím všechny rozměry u produktu: {product}",
      sloupky: "Vyberte, zda má zákazník vlastní sloupky, nebo je chce od nás.",
      /* Uchycení i provedení určují cenu za bm a betonování — bez nich nejde sloupky nacenit. */
      uchyceniSloupku: "Vyberte alespoň jeden způsob, jak se hliníkové sloupky ukotví do země.",
      provedeniSloupku: "Vyberte, zda betonování sloupků provedeme my, nebo si ho zákazník udělá svépomocí.",
      dilce: "Zvolte, zda chcete plotové dílce, nebo zaškrtněte, že je nechcete.",
      motiv: "Vyberte motiv oplocení.",
      barva: "Vyberte barvu oplocení.",
      invalidBarva: "Nezadali jste barvu oplocení",
      invalidMotiv: "Nevybrali jste motiv oplocení",
      invalidSloupky: "Nevybrali jste, zda má zákazník vlastní sloupky, nebo je chce od nás",
      invalidContact: "Zkontrolujte prosím kontaktní údaje",
      /** Záchranná hláška pro chyby validace, na které tu není vlastní text. */
      invalidOther: "Formulář se nepodařilo odeslat, zkontrolujte prosím vyplněné údaje",
    },
  },
  sk: {
    heading: "Nakonfigurujte si svoje oplotenie",
    subheading: "Prejdite pár krokmi a zostavte si bránu, bránku, stĺpiky, plotové dielce aj motív plota presne podľa seba. Na konci vám pošleme nezáväznú kalkuláciu.",
    next: "Ďalší krok",
    back: "Späť",
    sendText: "Odoslať dopyt",
    dimensionLabels: { vyska: "Výška (mm)", delka: "Šírka prejazdu (mm)", pocet: "Počet (ks)" },
    steps: ["Brána", "Bránka", "Stĺpiky", "Dielce", "Motív", "Farba", "Kontakt"],
    validation: {
      brana: "Zvoľte typ brány, alebo zaškrtnite, že vjazdovú bránu nechcete.",
      branka: "Zvoľte, či chcete v plote bránku, alebo zaškrtnite, že ju nechcete.",
      rozmery: "Vyplňte, prosím, všetky rozmery pri produkte: {product}",
      sloupky: "Vyberte, či má zákazník vlastné stĺpiky, alebo ich chce od nás.",
      uchyceniSloupku: "Vyberte aspoň jeden spôsob, ako sa hliníkové stĺpiky ukotvia do zeme.",
      provedeniSloupku: "Vyberte, či betónovanie stĺpikov urobíme my, alebo si ho zákazník urobí svojpomocne.",
      dilce: "Zvoľte, či chcete plotové dielce, alebo zaškrtnite, že ich nechcete.",
      motiv: "Vyberte motív oplotenia.",
      barva: "Vyberte farbu oplotenia.",
      invalidBarva: "Nezadali ste farbu oplotenia",
      invalidMotiv: "Nevybrali ste motív oplotenia",
      invalidSloupky: "Nevybrali ste, či má zákazník vlastné stĺpiky, alebo ich chce od nás",
      invalidContact: "Skontrolujte, prosím, kontaktné údaje",
      invalidOther: "Formulár sa nepodarilo odoslať, skontrolujte, prosím, vyplnené údaje",
    },
  },
  de: {
    heading: "Konfigurieren Sie Ihren Zaun",
    subheading: "Durchlaufen Sie ein paar Schritte und stellen Sie sich Tor, Tür, Pfosten, Zaunelemente und Zaunmotiv genau nach Ihren Wünschen zusammen. Am Ende senden wir Ihnen eine unverbindliche Kalkulation.",
    next: "Nächster Schritt",
    back: "Zurück",
    sendText: "Anfrage senden",
    dimensionLabels: { vyska: "Höhe (mm)", delka: "Durchfahrtsbreite (mm)", pocet: "Anzahl (Stk.)" },
    steps: ["Tor", "Tür", "Pfosten", "Elemente", "Motiv", "Farbe", "Kontakt"],
    validation: {
      brana: "Wählen Sie einen Tortyp oder markieren Sie, dass Sie kein Einfahrtstor möchten.",
      branka: "Wählen Sie, ob Sie eine Tür im Zaun möchten, oder markieren Sie, dass Sie keine möchten.",
      rozmery: "Bitte füllen Sie alle Maße beim Produkt aus: {product}",
      sloupky: "Wählen Sie, ob der Kunde eigene Pfosten hat oder sie von uns möchte.",
      uchyceniSloupku: "Wählen Sie mindestens eine Art, wie die Aluminiumpfosten im Boden verankert werden.",
      provedeniSloupku: "Wählen Sie, ob wir die Pfosten betonieren oder der Kunde es in Eigenleistung übernimmt.",
      dilce: "Wählen Sie, ob Sie Zaunelemente möchten, oder markieren Sie, dass Sie keine möchten.",
      motiv: "Wählen Sie das Zaunmotiv.",
      barva: "Wählen Sie die Zaunfarbe.",
      invalidBarva: "Sie haben keine Zaunfarbe angegeben",
      invalidMotiv: "Sie haben kein Zaunmotiv ausgewählt",
      invalidSloupky: "Sie haben nicht angegeben, ob der Kunde eigene Pfosten hat oder sie von uns möchte",
      invalidContact: "Bitte überprüfen Sie Ihre Kontaktdaten",
      invalidOther: "Das Formular konnte nicht gesendet werden, bitte überprüfen Sie Ihre Angaben",
    },
  },
}

// gate/product labels — klíčované podle `gate.id` z lib/konf-content.ts
export const gateLabels: Record<Lang, Record<string, string>> = {
  cs: {
    dvoukridla: "Otočná brána dvoukřídlá",
    jednokridla: "Otočná brána jednokřídlá",
    samonosna: "Samonosná posuvná brána",
    posuvna: "Brána posuvná po kolejnici",
    telSam: "Brána teleskopická samonosná",
    telPoj: "Brána teleskopická pojízdná",
    atypicka: "Brána atypická",
    skladaci: "Brána skládací",
    sekcni: "Brána sekční",
  },
  sk: {
    dvoukridla: "Otváracia brána dvojkrídlová",
    jednokridla: "Otváracia brána jednokrídlová",
    samonosna: "Samonosná posuvná brána",
    posuvna: "Brána posuvná po koľajnici",
    telSam: "Brána teleskopická samonosná",
    telPoj: "Brána teleskopická pojazdná",
    atypicka: "Brána atypická",
    skladaci: "Brána skladacia",
    sekcni: "Brána sekčná",
  },
  de: {
    dvoukridla: "Drehflügeltor zweiflügelig",
    jednokridla: "Drehflügeltor einflügelig",
    samonosna: "Freitragendes Schiebetor",
    posuvna: "Schiebetor mit Laufschiene",
    telSam: "Teleskoptor freitragend",
    telPoj: "Teleskoptor fahrbar",
    atypicka: "Sonderanfertigung Tor",
    skladaci: "Falttor",
    sekcni: "Sektionaltor",
  },
}

export const gateExtrasLabels: Record<Lang, { pohon: string; tahoma: string }> = {
  cs: { pohon: "Automatický pohon", tahoma: "Tahoma Switch" },
  sk: { pohon: "Automatický pohon", tahoma: "Tahoma Switch" },
  de: { pohon: "Automatischer Antrieb", tahoma: "Tahoma Switch" },
}

export const brankaExtrasLabels: Record<Lang, { zamek: string; schranka: string; zvonek: string }> = {
  cs: { zamek: "El. zámek", schranka: "Integrovaná schránka", zvonek: "Videozvonek" },
  sk: { zamek: "El. zámok", schranka: "Integrovaná schránka", zvonek: "Videozvonok" },
  de: { zamek: "Elektroschloss", schranka: "Integrierter Briefkasten", zvonek: "Video-Türklingel" },
}

/**
 * Kování branky. `title` je popisek skupiny, `options` jsou klíčované hodnotami
 * z `brankaKovaniOptions` — vybrat lze vždy jen jednu (radio).
 */
export const brankaKovaniLabels: Record<Lang, { title: string; options: Record<string, string> }> = {
  cs: {
    title: "Kování",
    options: {
      "kliky-mt": "Kliky M&T",
      "madlo-300": "Madlo 300 mm",
      "madlo-225": "Madlo 225 mm",
      "madlo-1250": "Madlo 1250 mm",
    },
  },
  sk: {
    title: "Kovanie",
    options: {
      "kliky-mt": "Kľučky M&T",
      "madlo-300": "Madlo 300 mm",
      "madlo-225": "Madlo 225 mm",
      "madlo-1250": "Madlo 1250 mm",
    },
  },
  de: {
    title: "Beschlag",
    options: {
      "kliky-mt": "Drückergarnitur M&T",
      "madlo-300": "Stoßgriff 300 mm",
      "madlo-225": "Stoßgriff 225 mm",
      "madlo-1250": "Stoßgriff 1250 mm",
    },
  },
}

// barvy — sdílený slovník napříč konfigurátory, klíčovaný podle CS názvu (kanonický klíč)
export const colorLabels: Record<Lang, Record<string, string>> = {
  cs: {
    "Přírodní": "Přírodní",
    "Červená": "Červená",
    "Karamelová": "Karamelová",
    "Písková": "Písková",
    "Okrová": "Okrová",
    "Hnědá": "Hnědá",
    "Černá": "Černá",
    "Melír Přírodní": "Melír Přírodní",
    "Melír Latte": "Melír Latte",
    "Melír Písková": "Melír Písková",
    "Melír Marmo": "Melír Marmo",
    "Melír Scatola": "Melír Scatola",
    "Zelená": "Zelená",
    "Šedá": "Šedá",
    "Bílá": "Bílá",
    "Antracit": "Antracit",
    "Dřevodekor": "Dřevodekor",
  },
  sk: {
    "Přírodní": "Prírodná",
    "Červená": "Červená",
    "Karamelová": "Karamelová",
    "Písková": "Piesková",
    "Okrová": "Okrová",
    "Hnědá": "Hnedá",
    "Černá": "Čierna",
    "Melír Přírodní": "Melír Prírodná",
    "Melír Latte": "Melír Latte",
    "Melír Písková": "Melír Pieskový",
    "Melír Marmo": "Melír Marmo",
    "Melír Scatola": "Melír Scatola",
    "Zelená": "Zelená",
    "Šedá": "Sivá",
    "Bílá": "Biela",
    "Antracit": "Antracit",
    "Dřevodekor": "Dekor dreva",
  },
  de: {
    "Přírodní": "Natur",
    "Červená": "Rot",
    "Karamelová": "Karamell",
    "Písková": "Sandfarben",
    "Okrová": "Ocker",
    "Hnědá": "Braun",
    "Černá": "Schwarz",
    "Melír Přírodní": "Melange Natur",
    "Melír Latte": "Melange Latte",
    "Melír Písková": "Melange Sand",
    "Melír Marmo": "Melange Marmo",
    "Melír Scatola": "Melange Scatola",
    "Zelená": "Grün",
    "Šedá": "Grau",
    "Bílá": "Weiß",
    "Antracit": "Anthrazit",
    "Dřevodekor": "Holzdekor",
  },
}

// motivy — klíčované podle `m.src` z lib/konf-content.ts
export const motivLabels: Record<Lang, Record<string, string>> = {
  cs: {
    "o-standart": "Okenice standard",
    kapka: "Okenice kapka",
    "kapka-mini": "Okenice kapka mini",
    "planka-60": "Plaňka 60",
    "plaka-90": "Plaňka 90",
    "planka-120": "Plaňka 120",
    "planka-150": "Plaňka 150",
    tycka: "Tyčka",
    tahokov: "Tahokov",
    "lamela-105": "Lamela Z",
    vypaleni: "Vypálení plochy",
    "vlastní kombinace": "Vlastní kombinace",
    drevodekor: "Dřevodekor",
    sklo: "Sklo",
  },
  sk: {
    "o-standart": "Okenica štandard",
    kapka: "Okenica kvapka",
    "kapka-mini": "Okenica kvapka mini",
    "planka-60": "Latka 60",
    "plaka-90": "Latka 90",
    "planka-120": "Latka 120",
    "planka-150": "Latka 150",
    tycka: "Tyčka",
    tahokov: "Ťahokov",
    "lamela-105": "Lamela Z",
    vypaleni: "Vypálenie plochy",
    "vlastní kombinace": "Vlastná kombinácia",
    drevodekor: "Drevodekor",
    sklo: "Sklo",
  },
  de: {
    "o-standart": "Fensterladen Standard",
    kapka: "Fensterladen Tropfen",
    "kapka-mini": "Fensterladen Tropfen mini",
    "planka-60": "Lamelle 60",
    "plaka-90": "Lamelle 90",
    "planka-120": "Lamelle 120",
    "planka-150": "Lamelle 150",
    tycka: "Stab",
    tahokov: "Streckmetall",
    "lamela-105": "Jalousielamelle Z",
    vypaleni: "Flächenausschnitt",
    "vlastní kombinace": "Eigene Kombination",
    drevodekor: "Holzdekor",
    sklo: "Glas",
  },
}

/** UI texty galerie reálných fotek (ProductSection, PergolaTypeTile, PhotoLightbox). */
export const photoGalleryContent: Record<
  Lang,
  {
    openGallery: string
    viewPhotosOf: string
    photoSingular: string
    photoPlural: string
    morePhotos: string
    motivHeading: string
    prevPhoto: string
    nextPhoto: string
    photoAt: string
    /** Slovo v `alt` fotky realizace: „<název produktu> — realizace 3“. */
    realization: string
  }
> = {
  cs: {
    openGallery: "Prohlédnout galerii",
    viewPhotosOf: "Zobrazit fotografie realizací",
    photoSingular: "fotka",
    photoPlural: "fotek",
    morePhotos: "dalších fotek",
    motivHeading: "Motiv",
    prevPhoto: "Předchozí fotka",
    nextPhoto: "Další fotka",
    photoAt: "Fotka",
    realization: "realizace",
  },
  sk: {
    openGallery: "Pozrieť galériu",
    viewPhotosOf: "Zobraziť fotografie realizácií",
    photoSingular: "fotka",
    photoPlural: "fotiek",
    morePhotos: "ďalších fotiek",
    motivHeading: "Motív",
    prevPhoto: "Predchádzajúca fotka",
    nextPhoto: "Ďalšia fotka",
    photoAt: "Fotka",
    realization: "realizácia",
  },
  de: {
    openGallery: "Galerie ansehen",
    viewPhotosOf: "Fotos der Umsetzungen ansehen",
    photoSingular: "Foto",
    photoPlural: "Fotos",
    morePhotos: "weitere Fotos",
    motivHeading: "Motiv",
    prevPhoto: "Vorheriges Foto",
    nextPhoto: "Nächstes Foto",
    photoAt: "Foto",
    realization: "Umsetzung",
  },
}

/** UI texty odkazu a popupu „Podrobnější informace“ (ProductInfoDialog). */
export const productInfoContent: Record<Lang, { trigger: string; close: string; photosAlt: string }> = {
  cs: {
    trigger: "Podrobnější informace",
    close: "Zavřít",
    photosAlt: "fotka produktu",
  },
  sk: {
    trigger: "Podrobnejšie informácie",
    close: "Zavrieť",
    photosAlt: "fotka produktu",
  },
  de: {
    trigger: "Ausführlichere Informationen",
    close: "Schließen",
    photosAlt: "Produktfoto",
  },
}

/** UI texty výběrového checkboxu na produktové kartě (ProductSection). */
export const productSelectContent: Record<
  Lang,
  {
    select: string
    selected: string
    addedToast: string
    sizeLabel: string
    addSize: string
    removeLast: string
    /** Tlačítko pod vyplněnými rozměry, které posune uživatele na další krok konfigurátoru. */
    continueStep: string
  }
> = {
  cs: {
    select: "Vybrat",
    selected: "Máte zvoleno",
    addedToast: "přidáno do výběru",
    sizeLabel: "Rozměr",
    addSize: "Přidat další rozměr",
    removeLast: "Odebrat poslední",
    continueStep: "Pokračovat na další krok",
  },
  sk: {
    select: "Vybrať",
    selected: "Máte zvolené",
    addedToast: "pridané do výberu",
    sizeLabel: "Rozmer",
    addSize: "Pridať ďalší rozmer",
    removeLast: "Odobrať posledný",
    continueStep: "Pokračovať na ďalší krok",
  },
  de: {
    select: "Auswählen",
    selected: "Ausgewählt",
    addedToast: "zur Auswahl hinzugefügt",
    sizeLabel: "Maß",
    addSize: "Weiteres Maß hinzufügen",
    removeLast: "Letztes entfernen",
    continueStep: "Weiter zum nächsten Schritt",
  },
}

export const formControlsContent = {
  cs: { customSolution: "Vlastní řešení", noPreview: "Náhled připravujeme" },
  sk: { customSolution: "Vlastné riešenie", noPreview: "Náhľad pripravujeme" },
  de: { customSolution: "Eigene Lösung", noPreview: "Vorschau in Vorbereitung" },
}

/**
 * Texty sdílené oběma konfigurátory (oplocení i pergoly), které nejsou vázané
 * na konkrétní krok — postranní přehled kroků a zavírání popupů.
 */
export const konfCommonContent: Record<Lang, { progressLabel: string; close: string }> = {
  cs: { progressLabel: "Průběh konfigurace", close: "Zavřít" },
  sk: { progressLabel: "Priebeh konfigurácie", close: "Zavrieť" },
  de: { progressLabel: "Konfigurationsfortschritt", close: "Schließen" },
}

export const stepBranaContent = {
  cs: { titlePre: "Chcete ", titleAccent: "vjezdovou bránu", titlePost: "?", desc: "Vyberte jeden nebo víc typů bran, které vás zajímají, a doplňte rozměry. Klidně jich zvolte i víc najednou.", decline: "Nechci vjezdovou bránu" },
  sk: { titlePre: "Chcete ", titleAccent: "vjazdovú bránu", titlePost: "?", desc: "Vyberte jeden alebo viac typov brán, ktoré vás zaujímajú, a doplňte rozmery. Pokojne ich zvoľte aj viac naraz.", decline: "Nechcem vjazdovú bránu" },
  de: { titlePre: "Möchten Sie ein ", titleAccent: "Einfahrtstor", titlePost: "?", desc: "Wählen Sie einen oder mehrere Tortypen, die Sie interessieren, und ergänzen Sie die Maße. Sie können auch mehrere gleichzeitig auswählen.", decline: "Ich möchte kein Einfahrtstor" },
}

export const stepBrankaContent = {
  cs: { titlePre: "Chcete v plotu ", titleAccent: "branku", titlePost: "?", desc: "Branka pro pěší vstup na pozemek, samostatně od vjezdové brány.", decline: "Nechci v plotu branku", productTitle: "Branka v oplocení", dimensionLabels: { vyska: "Výška branky (mm)", delka: "Šířka branky (mm)", pocet: "Počet branek (ks)" } },
  sk: { titlePre: "Chcete v plote ", titleAccent: "bránku", titlePost: "?", desc: "Bránka pre peší vstup na pozemok, samostatne od vjazdovej brány.", decline: "Nechcem v plote bránku", productTitle: "Bránka v oplotení", dimensionLabels: { vyska: "Výška bránky (mm)", delka: "Šírka bránky (mm)", pocet: "Počet bránok (ks)" } },
  de: { titlePre: "Möchten Sie eine ", titleAccent: "Tür im Zaun", titlePost: "?", desc: "Tür für den Fußgängerzugang zum Grundstück, unabhängig vom Einfahrtstor.", decline: "Ich möchte keine Tür im Zaun", productTitle: "Tür im Zaun", dimensionLabels: { vyska: "Türhöhe (mm)", delka: "Türbreite (mm)", pocet: "Anzahl Türen (Stk.)" } },
}

export const sloupkyLabels: Record<Lang, Record<string, string>> = {
  cs: { vlastni: "Mám své", "hliníkové": "Hliníkové" },
  sk: { vlastni: "Mám vlastné", "hliníkové": "Hliníkové" },
  de: { vlastni: "Ich habe eigene", "hliníkové": "Aluminium" },
}

/** 3. krok — sloupky: typ, u hliníkových spodní uchycení a rozměrové sady sloupků. */
export const stepSloupkyContent = {
  cs: {
    titlePre: "Chcete ",
    titleAccent: "sloupky",
    titlePost: "?",
    desc: "Zákazník si je buď dodá sám, nebo mu je dodáme v hliníku sladěném se zbytkem oplocení.",
    uchyceniTitlePre: "Spodní ",
    uchyceniTitleAccent: "uchycení sloupků",
    uchyceniTitlePost: "",
    uchyceniDesc: "Způsob, jakým se sloupky ukotví do země. Můžete zvolit i oba naráz — každý má vlastní rozměry. Zaměření je vždy na nás.",
    provedeniLabel: "Provedení",
    rozmerLabel: "Rozměry sloupků",
    /** Popisek nad radiem s profilem uvnitř jedné rozměrové sady. */
    profilLabel: "Profil sloupku",
    delkaLabel: "Délka sloupku (mm)",
    pocetLabel: "Počet sloupků (ks)",
    cepickyLabel: "Krycí čepičky",
    pocetCepicekLabel: "Počet čepiček (ks)",
  },
  sk: {
    titlePre: "Chcete ",
    titleAccent: "stĺpiky",
    titlePost: "?",
    desc: "Zákazník si ich buď dodá sám, alebo mu ich dodáme v hliníku zladenom so zvyškom oplotenia.",
    uchyceniTitlePre: "Spodné ",
    uchyceniTitleAccent: "uchytenie stĺpikov",
    uchyceniTitlePost: "",
    uchyceniDesc: "Spôsob, akým sa stĺpiky ukotvia do zeme. Môžete zvoliť aj oba naraz — každý má vlastné rozmery. Zameranie je vždy na nás.",
    provedeniLabel: "Prevedenie",
    rozmerLabel: "Rozmery stĺpikov",
    profilLabel: "Profil stĺpika",
    delkaLabel: "Dĺžka stĺpika (mm)",
    pocetLabel: "Počet stĺpikov (ks)",
    cepickyLabel: "Krycie čiapočky",
    pocetCepicekLabel: "Počet čiapočiek (ks)",
  },
  de: {
    titlePre: "Möchten Sie ",
    titleAccent: "Pfosten",
    titlePost: "?",
    desc: "Der Kunde stellt sie selbst bei, oder wir liefern sie in Aluminium passend zum übrigen Zaun.",
    uchyceniTitlePre: "Untere ",
    uchyceniTitleAccent: "Pfostenbefestigung",
    uchyceniTitlePost: "",
    uchyceniDesc: "Art der Verankerung der Pfosten im Boden. Sie können auch beide wählen — jede hat eigene Maße. Das Aufmaß übernehmen immer wir.",
    provedeniLabel: "Ausführung",
    rozmerLabel: "Pfostenmaße",
    profilLabel: "Pfostenprofil",
    delkaLabel: "Pfostenlänge (mm)",
    pocetLabel: "Anzahl Pfosten (Stk.)",
    cepickyLabel: "Abdeckkappen",
    pocetCepicekLabel: "Anzahl Kappen (Stk.)",
  },
}

/** Popisky způsobů spodního uchycení sloupků (`uchyceniSloupkuOptions`). */
export const uchyceniSloupkuLabels: Record<Lang, Record<string, { label: string; desc: string }>> = {
  cs: {
    nabetonovani: { label: "Betonování sloupků", desc: "Sloupek se osadí a zabetonuje přímo do země." },
    patka: { label: "Sloupek na patce", desc: "Sloupek se přišroubuje na kotevní patku — na hotovou betonovou plochu." },
  },
  sk: {
    nabetonovani: { label: "Betónovanie stĺpikov", desc: "Stĺpik sa osadí a zabetónuje priamo do zeme." },
    patka: { label: "Stĺpik na pätke", desc: "Stĺpik sa priskrutkuje na kotviacu pätku — na hotovú betónovú plochu." },
  },
  de: {
    nabetonovani: { label: "Betonieren der Pfosten", desc: "Der Pfosten wird gesetzt und direkt im Boden einbetoniert." },
    patka: { label: "Pfosten auf Fußplatte", desc: "Der Pfosten wird auf eine Ankerplatte geschraubt — auf fertige Betonfläche." },
  },
}

/**
 * Přepínač „uděláme my / svépomocí“ u betonování sloupků. Klíčovaný podle volby
 * uchycení, aby šlo přidat další variantu s vlastním slovesem bez zásahu do UI.
 */
export const provedeniLabels: Record<Lang, Record<string, { vcetne: string; svepomoci: string }>> = {
  cs: {
    nabetonovani: { vcetne: "Včetně betonování", svepomoci: "Betonování svépomocí" },
  },
  sk: {
    nabetonovani: { vcetne: "Vrátane betónovania", svepomoci: "Betónovanie svojpomocne" },
  },
  de: {
    nabetonovani: { vcetne: "Inklusive Betonieren", svepomoci: "Betonieren in Eigenleistung" },
  },
}

/** 4. krok — plotové dílce a jejich rozměry. Motiv se vybírá až v dalším kroku. */
export const stepDilceContent = {
  cs: { titlePre: "Chcete ", titleAccent: "plotové dílce", titlePost: "?", desc: "Vyplňte rozměry dílců, pokud je chcete objednat spolu s bránou.", decline: "Nechci plotové dílce", productTitle: "Plotové dílce", dimensionLabels: { vyska: "Výška dílců (mm)", delka: "Délka dílců (mm)", pocet: "Počet dílců (ks)" } },
  sk: { titlePre: "Chcete ", titleAccent: "plotové dielce", titlePost: "?", desc: "Vyplňte rozmery dielcov, ak ich chcete objednať spolu s bránou.", decline: "Nechcem plotové dielce", productTitle: "Plotové dielce", dimensionLabels: { vyska: "Výška dielcov (mm)", delka: "Dĺžka dielcov (mm)", pocet: "Počet dielcov (ks)" } },
  de: { titlePre: "Möchten Sie ", titleAccent: "Zaunelemente", titlePost: "?", desc: "Geben Sie die Maße der Elemente an, wenn Sie sie zusammen mit dem Tor bestellen möchten.", decline: "Ich möchte keine Zaunelemente", productTitle: "Zaunelemente", dimensionLabels: { vyska: "Höhe der Elemente (mm)", delka: "Länge der Elemente (mm)", pocet: "Anzahl Elemente (Stk.)" } },
}

/** 5. krok — motiv výplně, samostatná stránka konfigurátoru. */
export const stepMotivContent = {
  cs: { titlePre: "Zvolte ", titleAccent: "motiv oplocení", titlePost: "", desc: "Motiv určuje tvar výplně plotových dílců." },
  sk: { titlePre: "Zvoľte ", titleAccent: "motív oplotenia", titlePost: "", desc: "Motív určuje tvar výplne plotových dielcov." },
  de: { titlePre: "Wählen Sie das ", titleAccent: "Zaunmotiv", titlePost: "", desc: "Das Motiv bestimmt die Form der Füllung der Zaunelemente." },
}

export const stepBarvaContent = {
  cs: {
    titlePre: "Jakou si přejete ",
    titleAccent: "barvu",
    titlePost: "?",
    desc: "Vyberte jednu z běžných barev, nebo zadejte vlastní RAL kód.",
    ralLabel: "Vlastní RAL kód",
    ralPlaceholder: "např. RAL 7016",
  },
  sk: {
    titlePre: "Akú ",
    titleAccent: "farbu",
    titlePost: " si želáte?",
    desc: "Vyberte jednu z bežných farieb, alebo zadajte vlastný RAL kód.",
    ralLabel: "Vlastný RAL kód",
    ralPlaceholder: "napr. RAL 7016",
  },
  de: {
    titlePre: "Welche ",
    titleAccent: "Farbe",
    titlePost: " wünschen Sie?",
    desc: "Wählen Sie eine der gängigen Farben oder geben Sie einen eigenen RAL-Code ein.",
    ralLabel: "Eigener RAL-Code",
    ralPlaceholder: "z. B. RAL 7016",
  },
}

/** Zábradlí — produktová část 1. kroku konfigurátoru zábradlí (/konf/zabradli). */
export const stepZabradliContent = {
  cs: {
    titlePre: "Chcete ",
    titleAccent: "zábradlí",
    titlePost: "?",
    productTitle: "Zábradlí",
    dimensionLabels: { vyska: "Výška zábradlí (mm)", delka: "Šířka zábradlí (mm)", pocet: "Počet (ks)" },
    materialLabel: "Výplň zábradlí",
  },
  sk: {
    titlePre: "Chcete ",
    titleAccent: "zábradlie",
    titlePost: "?",
    productTitle: "Zábradlie",
    dimensionLabels: { vyska: "Výška zábradlia (mm)", delka: "Šírka zábradlia (mm)", pocet: "Počet (ks)" },
    materialLabel: "Výplň zábradlia",
  },
  de: {
    titlePre: "Möchten Sie ein ",
    titleAccent: "Geländer",
    titlePost: "?",
    productTitle: "Geländer",
    dimensionLabels: { vyska: "Höhe des Geländers (mm)", delka: "Breite des Geländers (mm)", pocet: "Anzahl (Stk.)" },
    materialLabel: "Geländerfüllung",
  },
}

export const zabradliMaterialLabels: Record<Lang, Record<string, string>> = {
  cs: { sklo: "Sklo", "hliník": "Hliník" },
  sk: { sklo: "Sklo", "hliník": "Hliník" },
  de: { sklo: "Glas", "hliník": "Aluminium" },
}

export const zabradliSkloLabels: Record<Lang, Record<string, string>> = {
  cs: { "Čiré": "Čiré", "Matné": "Matné", Antracit: "Antracit" },
  sk: { "Čiré": "Číre", "Matné": "Matné", Antracit: "Antracit" },
  de: { "Čiré": "Klar", "Matné": "Satiniert", Antracit: "Anthrazit" },
}

/**
 * Potvrzení po úspěšném odeslání — sdílí ho všechny tři konfigurátory.
 * Záměrně bez rozpisu dalších kroků („poptávka přijata → zpracování → …"):
 * poptávky nikde neukládáme, takže bychom stav nemohli nijak posouvat.
 */
/**
 * Mezikrok mezi odesláním a potvrzením — zabere celou kartu konfigurátoru po dobu,
 * kdy běží server action (nahrání příloh do Sanity + odeslání e-mailu trvá pár vteřin).
 * Bez něj by uživatel koukal na nezměněný formulář a klikal na „Odeslat" znovu.
 */
export const konfPendingContent = {
  cs: {
    eyebrow: "Odesíláme",
    heading: "Zpracováváme vaši poptávku",
    desc: "Ukládáme vaši konfiguraci a posíláme ji našim specialistům. Chvilku to potrvá — nezavírejte prosím stránku.",
    note: "Nemusíte nikam klikat, jakmile bude hotovo, přepneme vás dál sami.",
  },
  sk: {
    eyebrow: "Odosielame",
    heading: "Spracovávame váš dopyt",
    desc: "Ukladáme vašu konfiguráciu a posielame ju našim špecialistom. Chvíľu to potrvá — nezatvárajte, prosím, stránku.",
    note: "Nemusíte nikam klikať, hneď ako bude hotovo, prepneme vás ďalej sami.",
  },
  de: {
    eyebrow: "Wird gesendet",
    heading: "Wir verarbeiten Ihre Anfrage",
    desc: "Wir speichern Ihre Konfiguration und leiten sie an unsere Spezialisten weiter. Das dauert einen Moment — bitte schließen Sie die Seite nicht.",
    note: "Sie müssen nichts weiter tun, sobald es fertig ist, leiten wir Sie automatisch weiter.",
  },
}

/**
 * Adresa, na kterou `sendConf` / `sendPerg` / `sendZab` posílají poptávky
 * (viz `to:` v lib/actions.ts). Drží se tady, ať ji potvrzovací obrazovky
 * nemusí psát natvrdo každá zvlášť.
 */
export const POPTAVKY_EMAIL = "nabidky@konstantahp.cz"

export const konfSuccessContent = {
  cs: {
    eyebrow: "Máme to",
    heading: "Poptávka byla úspěšně odeslána",
    desc: "Vaše poptávka dorazila našim specialistům. Projdou si zadání a ozvou se vám na uvedený e-mail nebo telefon — zpravidla do dvou pracovních dnů.",
    note: "Kopii poptávky jsme vám poslali na e-mail. Kdyby vás mezitím něco napadlo, stačí odpovědět na něj, nebo nám zavolat.",
    newSitePre: "Web máme spuštěný teprve necelý měsíc. Všechny poptávky z konfigurátoru chodí na ",
    newSitePost: " — kdyby vám odpověď nedorazila, napište nám prosím rovnou na tuhle adresu.",
    home: "Zpět na hlavní stránku",
    again: "Odeslat další poptávku",
  },
  sk: {
    eyebrow: "Máme to",
    heading: "Dopyt bol úspešne odoslaný",
    desc: "Váš dopyt dorazil našim špecialistom. Prejdú si zadanie a ozvú sa vám na uvedený e-mail alebo telefón — spravidla do dvoch pracovných dní.",
    note: "Kópiu dopytu sme vám poslali na e-mail. Ak vás medzitým niečo napadne, stačí naň odpovedať, alebo nám zavolať.",
    newSitePre: "Web máme spustený sotva mesiac. Všetky dopyty z konfigurátora chodia na ",
    newSitePost: " — keby vám odpoveď nedorazila, napíšte nám prosím rovno na túto adresu.",
    home: "Späť na hlavnú stránku",
    again: "Odoslať ďalší dopyt",
  },
  de: {
    eyebrow: "Angekommen",
    heading: "Die Anfrage wurde erfolgreich gesendet",
    desc: "Ihre Anfrage ist bei unseren Spezialisten eingegangen. Sie sehen sich Ihre Angaben an und melden sich per E-Mail oder Telefon — in der Regel innerhalb von zwei Werktagen.",
    note: "Eine Kopie der Anfrage haben wir Ihnen per E-Mail geschickt. Falls Ihnen noch etwas einfällt, antworten Sie einfach darauf oder rufen Sie uns an.",
    newSitePre: "Unsere Website ist noch keinen Monat online. Alle Anfragen aus dem Konfigurator laufen unter ",
    newSitePost: " ein — sollte unsere Antwort ausbleiben, schreiben Sie uns bitte direkt an diese Adresse.",
    home: "Zurück zur Startseite",
    again: "Weitere Anfrage senden",
  },
}

// ---------------------------------------------------------------------------
// KONFIGURÁTOR ZÁBRADLÍ (/konf/zabradli) — samostatná poptávka o třech krocích.
// Popisky produktu (název, rozměry, výplň) sdílí se `stepZabradliContent` výše,
// tady je jen to, co je specifické pro samostatnou stránku.
// ---------------------------------------------------------------------------

export const zabradliConfContent = {
  cs: {
    heading: "Nakonfigurujte si zábradlí",
    subheading: "Skleněné nebo hliníkové zábradlí k terase, balkonu i schodišti. Projděte tři kroky a na konci vám pošleme nezávaznou kalkulaci.",
    next: "Další krok",
    back: "Zpět",
    sendText: "Odeslat poptávku",
    steps: ["Zábradlí", "Motiv", "Kontakt"],
    stepDesc: "Vyplňte rozměry zábradlí a vyberte výplň.",
    motivTitlePre: "Zvolte ",
    motivTitleAccent: "motiv výplně",
    motivTitlePost: "",
    motivDesc: "Motiv určuje tvar hliníkové výplně zábradlí.",
    skloTitlePre: "Zvolte ",
    skloTitleAccent: "odstín skla",
    skloTitlePost: "",
    skloDesc: "Odstín výplně skleněného zábradlí.",
    materialTitlePre: "Chybí ",
    materialTitleAccent: "výplň zábradlí",
    materialTitlePost: "",
    materialHint: "Nejdřív si na předchozím kroku vyberte výplň zábradlí — sklo, nebo hliník.",
    validation: {
      zabradli: "Vyberte zábradlí a vyplňte jeho rozměry.",
      rozmery: "Vyplňte prosím u zábradlí všechny rozměry.",
      material: "Vyberte výplň zábradlí — sklo, nebo hliník.",
      sklo: "Vyberte odstín skla.",
      motiv: "Vyberte motiv výplně zábradlí.",
      invalidContact: "Zkontrolujte prosím kontaktní údaje",
      /** Záchranná hláška pro chyby validace, na které tu není vlastní text. */
      invalidOther: "Formulář se nepodařilo odeslat, zkontrolujte prosím vyplněné údaje",
    },
  },
  sk: {
    heading: "Nakonfigurujte si zábradlie",
    subheading: "Sklenené alebo hliníkové zábradlie k terase, balkónu aj schodisku. Prejdite tri kroky a na konci vám pošleme nezáväznú kalkuláciu.",
    next: "Ďalší krok",
    back: "Späť",
    sendText: "Odoslať dopyt",
    steps: ["Zábradlie", "Motív", "Kontakt"],
    stepDesc: "Vyplňte rozmery zábradlia a vyberte výplň.",
    motivTitlePre: "Zvoľte ",
    motivTitleAccent: "motív výplne",
    motivTitlePost: "",
    motivDesc: "Motív určuje tvar hliníkovej výplne zábradlia.",
    skloTitlePre: "Zvoľte ",
    skloTitleAccent: "odtieň skla",
    skloTitlePost: "",
    skloDesc: "Odtieň výplne skleneného zábradlia.",
    materialTitlePre: "Chýba ",
    materialTitleAccent: "výplň zábradlia",
    materialTitlePost: "",
    materialHint: "Najprv si na predchádzajúcom kroku vyberte výplň zábradlia — sklo, alebo hliník.",
    validation: {
      zabradli: "Vyberte zábradlie a vyplňte jeho rozmery.",
      rozmery: "Vyplňte, prosím, pri zábradlí všetky rozmery.",
      material: "Vyberte výplň zábradlia — sklo, alebo hliník.",
      sklo: "Vyberte odtieň skla.",
      motiv: "Vyberte motív výplne zábradlia.",
      invalidContact: "Skontrolujte, prosím, kontaktné údaje",
      invalidOther: "Formulár sa nepodarilo odoslať, skontrolujte, prosím, vyplnené údaje",
    },
  },
  de: {
    heading: "Konfigurieren Sie Ihr Geländer",
    subheading: "Glas- oder Aluminiumgeländer für Terrasse, Balkon und Treppe. Durchlaufen Sie drei Schritte, und am Ende senden wir Ihnen eine unverbindliche Kalkulation.",
    next: "Nächster Schritt",
    back: "Zurück",
    sendText: "Anfrage senden",
    steps: ["Geländer", "Motiv", "Kontakt"],
    stepDesc: "Geben Sie die Maße des Geländers an und wählen Sie die Füllung.",
    motivTitlePre: "Wählen Sie das ",
    motivTitleAccent: "Motiv der Füllung",
    motivTitlePost: "",
    motivDesc: "Das Motiv bestimmt die Form der Aluminiumfüllung des Geländers.",
    skloTitlePre: "Wählen Sie den ",
    skloTitleAccent: "Glaston",
    skloTitlePost: "",
    skloDesc: "Der Ton der Füllung des Glasgeländers.",
    materialTitlePre: "Es fehlt die ",
    materialTitleAccent: "Geländerfüllung",
    materialTitlePost: "",
    materialHint: "Wählen Sie zuerst im vorherigen Schritt die Geländerfüllung — Glas oder Aluminium.",
    validation: {
      zabradli: "Wählen Sie das Geländer und geben Sie seine Maße an.",
      rozmery: "Bitte füllen Sie alle Maße des Geländers aus.",
      material: "Wählen Sie die Geländerfüllung — Glas oder Aluminium.",
      sklo: "Wählen Sie den Glaston.",
      motiv: "Wählen Sie das Motiv der Geländerfüllung.",
      invalidContact: "Bitte überprüfen Sie Ihre Kontaktdaten",
      invalidOther: "Das Formular konnte nicht gesendet werden, bitte überprüfen Sie Ihre Angaben",
    },
  },
}

// Sdílený obsah kontaktního kroku pro OBA konfigurátory (step-kontakt.tsx i perg-step-kontakt.tsx)
export const kontaktStepContent = {
  cs: {
    titlePre: "Vyplňte ",
    titleAccent: "osobní údaje",
    titlePost: "",
    desc: "Poslední krok — na tyto údaje vám pošleme nezávaznou kalkulaci.",
    fullname: "Celé jméno*",
    fullnamePlaceholder: "Zadejte celé jméno",
    email: "E-mail*",
    emailPlaceholder: "Zadejte e-mail",
    phone: "Telefonní číslo*",
    phonePlaceholder: "Zadejte telefonní číslo",
    company: "Firma",
    companyPlaceholder: "Zadejte název firmy",
    obec: "Obec*",
    obecPlaceholder: "Zadejte obec",
    address: "Ulice*",
    addressPlaceholder: "Zadejte ulici",
    zip: "PSČ*",
    zipPlaceholder: "PSČ",
    file: "Nahrajte soubor (fotky pozemku)",
    message: "Zpráva",
    messagePlaceholder: "Zadejte zprávu",
    consent: "Odesláním souhlasíte se zpracováním osobních údajů za účelem vyřízení poptávky.",
  },
  sk: {
    titlePre: "Vyplňte ",
    titleAccent: "osobné údaje",
    titlePost: "",
    desc: "Posledný krok — na tieto údaje vám pošleme nezáväznú kalkuláciu.",
    fullname: "Celé meno*",
    fullnamePlaceholder: "Zadajte celé meno",
    email: "E-mail*",
    emailPlaceholder: "Zadajte e-mail",
    phone: "Telefónne číslo*",
    phonePlaceholder: "Zadajte telefónne číslo",
    company: "Firma",
    companyPlaceholder: "Zadajte názov firmy",
    obec: "Obec*",
    obecPlaceholder: "Zadajte obec",
    address: "Ulica*",
    addressPlaceholder: "Zadajte ulicu",
    zip: "PSČ*",
    zipPlaceholder: "PSČ",
    file: "Nahrajte súbor (fotky pozemku)",
    message: "Správa",
    messagePlaceholder: "Zadajte správu",
    consent: "Odoslaním súhlasíte so spracovaním osobných údajov na účely vybavenia dopytu.",
  },
  de: {
    titlePre: "Geben Sie Ihre ",
    titleAccent: "persönlichen Daten",
    titlePost: " ein",
    desc: "Letzter Schritt — an diese Daten senden wir Ihnen eine unverbindliche Kalkulation.",
    fullname: "Vollständiger Name*",
    fullnamePlaceholder: "Geben Sie Ihren vollständigen Namen ein",
    email: "E-Mail*",
    emailPlaceholder: "Geben Sie Ihre E-Mail ein",
    phone: "Telefonnummer*",
    phonePlaceholder: "Geben Sie Ihre Telefonnummer ein",
    company: "Firma",
    companyPlaceholder: "Geben Sie den Firmennamen ein",
    obec: "Ort*",
    obecPlaceholder: "Geben Sie den Ort ein",
    address: "Straße*",
    addressPlaceholder: "Geben Sie die Straße ein",
    zip: "PLZ*",
    zipPlaceholder: "PLZ",
    file: "Datei hochladen (Fotos des Grundstücks)",
    message: "Nachricht",
    messagePlaceholder: "Geben Sie Ihre Nachricht ein",
    consent: "Mit dem Absenden stimmen Sie der Verarbeitung Ihrer personenbezogenen Daten zur Bearbeitung der Anfrage zu.",
  },
}

// ---------------------------------------------------------------------------
// KONFIGURÁTOR PERGOL — pergCopy / pergSteps / validace
// ---------------------------------------------------------------------------

export const pergContent = {
  cs: {
    heading: "Nakonfigurujte si pergolu",
    subheading: "Bioklimatická pergola, zimní zahrada nebo přístřešek — projděte pár kroků a na konci vám pošleme nezávaznou kalkulaci.",
    next: "Další krok",
    back: "Zpět",
    sendText: "Odeslat poptávku",
    steps: ["Typ pergoly", "Upevnění", "Stínění", "Barva", "Kontakt"],
    /** Popisek 3. kroku u přístřešku — místo stínění se tam vybírá materiál střechy. */
    stepRoof: "Střešní krytina",
    validation: {
      pergola: "Zvolte typ pergoly.",
      material: "Vyberte střešní krytinu přístřešku.",
      stineni: "Vyberte, jaké stínění chcete (nebo zvolte Žádné).",
      upevneni: "Vyberte alespoň jeden způsob upevnění pergoly.",
      rozmery: "Doplňte rozměry — {product}.",
      ledPocet: "Zadejte počet LED světel.",
      barva: "Vyberte barvu pergoly.",
      invalidBarva: "Nezadali jste barvu",
      invalidContact: "Zkontrolujte prosím kontaktní údaje",
      /** Záchranná hláška pro chyby validace, na které tu není vlastní text. */
      invalidOther: "Formulář se nepodařilo odeslat, zkontrolujte prosím vyplněné údaje",
    },
  },
  sk: {
    heading: "Nakonfigurujte si pergolu",
    subheading: "Bioklimatická pergola, zimná záhrada alebo prístrešok — prejdite pár krokmi a na konci vám pošleme nezáväznú kalkuláciu.",
    next: "Ďalší krok",
    back: "Späť",
    sendText: "Odoslať dopyt",
    steps: ["Typ pergoly", "Upevnenie", "Tienenie", "Farba", "Kontakt"],
    stepRoof: "Strešná krytina",
    validation: {
      pergola: "Zvoľte typ pergoly.",
      material: "Vyberte strešnú krytinu prístrešku.",
      stineni: "Vyberte, aké tienenie chcete (alebo zvoľte Žiadne).",
      upevneni: "Vyberte aspoň jeden spôsob upevnenia pergoly.",
      rozmery: "Doplňte rozmery — {product}.",
      ledPocet: "Zadajte počet LED svetiel.",
      barva: "Vyberte farbu pergoly.",
      invalidBarva: "Nezadali ste farbu",
      invalidContact: "Skontrolujte, prosím, kontaktné údaje",
      invalidOther: "Formulár sa nepodarilo odoslať, skontrolujte, prosím, vyplnené údaje",
    },
  },
  de: {
    heading: "Konfigurieren Sie Ihre Pergola",
    subheading: "Bioklimatische Pergola, Wintergarten oder Unterstand — durchlaufen Sie ein paar Schritte, und am Ende senden wir Ihnen eine unverbindliche Kalkulation.",
    next: "Nächster Schritt",
    back: "Zurück",
    sendText: "Anfrage senden",
    steps: ["Pergola-Typ", "Befestigung", "Beschattung", "Farbe", "Kontakt"],
    stepRoof: "Dacheindeckung",
    validation: {
      pergola: "Wählen Sie den Pergola-Typ.",
      material: "Wählen Sie die Dacheindeckung des Unterstands.",
      stineni: "Wählen Sie die gewünschte Beschattung (oder „Keine“).",
      upevneni: "Wählen Sie mindestens eine Befestigungsart für die Pergola.",
      rozmery: "Bitte ergänzen Sie die Maße — {product}.",
      ledPocet: "Geben Sie die Anzahl der LED-Leuchten an.",
      barva: "Wählen Sie die Farbe der Pergola.",
      invalidBarva: "Sie haben keine Farbe angegeben",
      invalidContact: "Bitte überprüfen Sie Ihre Kontaktdaten",
      invalidOther: "Das Formular konnte nicht gesendet werden, bitte überprüfen Sie Ihre Angaben",
    },
  },
}

export const pergolaTypeLabels: Record<Lang, Record<string, string>> = {
  cs: { bioklimaticka: "Bioklimatická", zimni_zahrada: "Zimní zahrada", pristresek: "Přístřešek" },
  sk: { bioklimaticka: "Bioklimatická", zimni_zahrada: "Zimná záhrada", pristresek: "Prístrešok" },
  de: { bioklimaticka: "Bioklimatisch", zimni_zahrada: "Wintergarten", pristresek: "Unterstand" },
}

export const stineniLabels: Record<Lang, Record<string, string>> = {
  cs: { "žádné": "Žádné", rolety: "Screenové rolety", pevne: "Pevné", zaskleni: "Zasklení" },
  sk: { "žádné": "Žiadne", rolety: "Screenové rolety", pevne: "Pevné", zaskleni: "Zasklenie" },
  de: { "žádné": "Keine", rolety: "Screen-Rollos", pevne: "Fest", zaskleni: "Verglasung" },
}

/** Strany pergoly k zastínění. Klíče `a`–`d` odpovídají polím v `pergolaSchema`. */
export const stranyLabels: Record<Lang, Record<string, string>> = {
  cs: { a: "Přední (vchodové)", b: "Zadní", c: "Levé", d: "Pravé" },
  sk: { a: "Predné (vchodové)", b: "Zadné", c: "Ľavé", d: "Pravé" },
  de: { a: "Vorne (Eingangsseite)", b: "Hinten", c: "Links", d: "Rechts" },
}

export const strechaMaterialLabels: Record<Lang, Record<string, string>> = {
  cs: { sklo: "Ze skla", polykarbonat: "Z polykarbonátu" },
  sk: { sklo: "Zo skla", polykarbonat: "Z polykarbonátu" },
  de: { sklo: "Aus Glas", polykarbonat: "Aus Polycarbonat" },
}

export const mountLabels: Record<Lang, Record<string, string>> = {
  cs: { stojici: "Pergola samostatně stojící", keStene: "Pergola přisazená ke stěně", kRohu: "Pergola přisazená k rohu" },
  sk: { stojici: "Pergola samostatne stojaca", keStene: "Pergola pristavaná k stene", kRohu: "Pergola pristavaná do rohu" },
  de: { stojici: "Freistehende Pergola", keStene: "Wandanbau-Pergola", kRohu: "Eckanbau-Pergola" },
}

export const mountDimensionLabelsContent = {
  cs: { sirka: "A - Délka pergoly (mm)", hloubka: "B - Hloubka pergoly (mm)", delka: "C - Výška pergoly (mm)" },
  sk: { sirka: "A - Dĺžka pergoly (mm)", hloubka: "B - Hĺbka pergoly (mm)", delka: "C - Výška pergoly (mm)" },
  de: { sirka: "A – Länge der Pergola (mm)", hloubka: "B – Tiefe der Pergola (mm)", delka: "C – Höhe der Pergola (mm)" },
}

export const pergStepTypContent = {
  cs: {
    title1Pre: "Zvolte ",
    title1Accent: "typ pergoly",
    title1Post: "",
    desc1: "Bioklimatická pergola s lamelami, zasklená zimní zahrada, nebo jednoduchý přístřešek.",
    ledTitle: "Doplňky",
    ledDesc: "LED osvětlení se montuje přímo do lamel — pergola se dá používat i po setmění.",
    ledLabel: "LED světla",
    ledHint: "Integrované osvětlení lamel bioklimatické pergoly.",
    ledCountLabel: "Počet kusů",
  },
  sk: {
    title1Pre: "Zvoľte ",
    title1Accent: "typ pergoly",
    title1Post: "",
    desc1: "Bioklimatická pergola s lamelami, zasklená zimná záhrada, alebo jednoduchý prístrešok.",
    ledTitle: "Doplnky",
    ledDesc: "LED osvetlenie sa montuje priamo do lamiel — pergolu tak využijete aj po zotmení.",
    ledLabel: "LED svetlá",
    ledHint: "Integrované osvetlenie lamiel bioklimatickej pergoly.",
    ledCountLabel: "Počet kusov",
  },
  de: {
    title1Pre: "Wählen Sie den ",
    title1Accent: "Pergola-Typ",
    title1Post: "",
    desc1: "Bioklimatische Pergola mit Lamellen, verglaster Wintergarten oder einfacher Unterstand.",
    ledTitle: "Zubehör",
    ledDesc: "Die LED-Beleuchtung wird direkt in die Lamellen eingebaut — die Pergola lässt sich auch nach Einbruch der Dunkelheit nutzen.",
    ledLabel: "LED-Leuchten",
    ledHint: "Integrierte Lamellenbeleuchtung der bioklimatischen Pergola.",
    ledCountLabel: "Stückzahl",
  },
}

/**
 * Samostatný krok stínění (za upevněním). U přístřešku se v něm místo stínění
 * vybírá materiál střechy — proto `roof*` klíče vedle `shade*`; oba nadpisy jsou
 * dělené na `Pre`/`Accent`/`Post` jako ostatní kroky (viz `StepTitle`).
 */
export const pergStepStineniContent = {
  cs: {
    roofTitlePre: "Zvolte ",
    roofTitleAccent: "střešní krytinu",
    roofTitlePost: "",
    roofDesc: "Materiál střechy přístřešku.",
    shadeTitlePre: "Chcete ",
    shadeTitleAccent: "stínění",
    shadeTitlePost: "?",
    shadeDesc: "Screenové rolety chrání před sluncem i pohledy, pevné stínění a zasklení jde kombinovat s lamelami.",
    noShade: "Bez stínění",
    sidesTitle: "Strany stínění",
    sidesDesc: "Označte strany pergoly, které chcete zastínit.",
  },
  sk: {
    roofTitlePre: "Zvoľte ",
    roofTitleAccent: "strešnú krytinu",
    roofTitlePost: "",
    roofDesc: "Materiál strechy prístrešku.",
    shadeTitlePre: "Chcete ",
    shadeTitleAccent: "tienenie",
    shadeTitlePost: "?",
    shadeDesc: "Screenové rolety chránia pred slnkom aj pohľadmi, pevné tienenie a zasklenie sa dá kombinovať s lamelami.",
    noShade: "Bez tienenia",
    sidesTitle: "Strany tienenia",
    sidesDesc: "Označte strany pergoly, ktoré chcete zatieniť.",
  },
  de: {
    roofTitlePre: "Wählen Sie die ",
    roofTitleAccent: "Dacheindeckung",
    roofTitlePost: "",
    roofDesc: "Material des Unterstanddachs.",
    shadeTitlePre: "Möchten Sie eine ",
    shadeTitleAccent: "Beschattung",
    shadeTitlePost: "?",
    shadeDesc: "Screen-Rollos schützen vor Sonne und Blicken, feste Beschattung und Verglasung lassen sich mit Lamellen kombinieren.",
    noShade: "Ohne Beschattung",
    sidesTitle: "Beschattete Seiten",
    sidesDesc: "Markieren Sie die Seiten der Pergola, die beschattet werden sollen.",
  },
}

export const pergStepUpevneniContent = {
  cs: { titlePre: "Jak chcete upevnit ", titleAccent: "pergolu", titlePost: "?", desc: "Vyberte jeden nebo víc způsobů uchycení a doplňte rozměry." },
  sk: { titlePre: "Ako chcete ", titleAccent: "pergolu", titlePost: " upevniť?", desc: "Vyberte jeden alebo viac spôsobov uchytenia a doplňte rozmery." },
  de: { titlePre: "Wie möchten Sie die ", titleAccent: "Pergola", titlePost: " befestigen?", desc: "Wählen Sie eine oder mehrere Befestigungsarten und ergänzen Sie die Maße." },
}

// ---------------------------------------------------------------------------
// POTVRZOVACÍ E-MAILY, PDF NABÍDKA A XLSX KALKULACE
// (components/ConfMail.tsx, components/PergMail.tsx, lib/actions.ts)
//
// Jazyk se sem dostává jako druhý argument server actions `sendConf` /
// `sendPergConf` — konfigurátor ho posílá ze stejné prop `lang`, jakou dostal
// z `?lang=`. Hodnotové slovníky (barvy, motivy, typy bran, kování, stínění…)
// se nedublují — bere se to, co už používá UI konfigurátoru.
// ---------------------------------------------------------------------------

/** Datum a čísla se formátují podle jazyka příjemce. Měna zůstává CZK. */
export const localeTags: Record<Lang, string> = { cs: "cs-CZ", sk: "sk-SK", de: "de-DE" }

/**
 * Společný „obal" obou potvrzovacích e-mailů (hlavička, patička, blok
 * s údaji zákazníka). ConfMail i PergMail z něj berou úplně stejné texty.
 */
export type MailChromeContent = {
  preview: string
  logoAlt: string
  /** Mono „kicker" nad nadpisem v hlavičce e-mailu. */
  eyebrow: string
  /** Velký kondenzovaný nadpis v hlavičce e-mailu. */
  headline: string
  /** Nadpis sekce s fotkami vybraných produktů. */
  productsHeading: string
  /** Oslovení bez jména — komponenta skládá `${salutation} ${jméno},`. */
  salutation: string
  /**
   * Úvodní odstavce sdílené ZabMail a PergMail. ConfMail má vlastní znění
   * v `confMailContent` — jako jediný posílá v příloze cenovou kalkulaci.
   */
  intro: string
  intro2: string
  companyHeading: string
  country: string
  ico: string
  phone: string
  email: string
  web: string
  yourInfoHeading: string
  fullName: string
  emailLabel: string
  phoneLabel: string
  addressLabel: string
  companyLabel: string
  messageLabel: string
  dateLabel: string
  support: string
  rights: string
}

export const mailContent: Record<Lang, MailChromeContent> = {
  cs: {
    preview: "Děkujeme za vytvoření konfigurace s KONSTANTA - hliníkové ploty s.r.o.",
    logoAlt: "KONSTANTA - hliníkové ploty s.r.o.",
    eyebrow: "Nová poptávka z konfigurátoru",
    headline: "Konfigurace oplocení",
    productsHeading: "Vybrané produkty",
    salutation: "Vážený/á",
    intro:
      "Děkujeme, že jste si vybrali KONSTANTA - hliníkové ploty s.r.o. pro vytvoření vaší konfigurace! Jsme potěšeni, že vás můžeme přivítat mezi našimi váženými zákazníky. Vaše důvěra v naše produkty a služby pro nás znamená vše a zavazujeme se poskytnout vám zážitek nejvyšší kvality.",
    intro2:
      "Vaše konfigurace byla přijata a je zpracovávána s maximální péčí. Vážíme si vašeho zájmu a těšíme se na další spolupráci.",
    companyHeading: "Informace o společnosti",
    country: "Česká republika",
    ico: "IČO",
    phone: "Telefon",
    email: "E-mail",
    web: "Web",
    yourInfoHeading: "Vaše informace",
    fullName: "Celé jméno zákazníka",
    emailLabel: "E-mail",
    phoneLabel: "Telefonní číslo",
    addressLabel: "Adresa",
    companyLabel: "Firma",
    messageLabel: "Zpráva",
    dateLabel: "Datum",
    support:
      "Pokud máte jakékoli dotazy nebo připomínky, neváhejte kontaktovat náš tým zákaznické podpory. Jsme tu, abychom vám pomohli!",
    rights: "Všechna práva vyhrazena.",
  },
  sk: {
    preview: "Ďakujeme za vytvorenie konfigurácie s KONSTANTA - hliníkové ploty s.r.o.",
    logoAlt: "KONSTANTA - hliníkové ploty s.r.o.",
    eyebrow: "Nový dopyt z konfigurátora",
    headline: "Konfigurácia oplotenia",
    productsHeading: "Vybrané produkty",
    salutation: "Vážený/á",
    intro:
      "Ďakujeme, že ste si vybrali KONSTANTA - hliníkové ploty s.r.o. na vytvorenie vašej konfigurácie! Teší nás, že vás môžeme privítať medzi našimi váženými zákazníkmi. Vaša dôvera v naše produkty a služby pre nás znamená všetko a zaväzujeme sa poskytnúť vám zážitok najvyššej kvality.",
    intro2:
      "Vaša konfigurácia bola prijatá a spracúva sa s maximálnou starostlivosťou. Vážime si váš záujem a tešíme sa na ďalšiu spoluprácu.",
    companyHeading: "Informácie o spoločnosti",
    country: "Česká republika",
    ico: "IČO",
    phone: "Telefón",
    email: "E-mail",
    web: "Web",
    yourInfoHeading: "Vaše informácie",
    fullName: "Celé meno zákazníka",
    emailLabel: "E-mail",
    phoneLabel: "Telefónne číslo",
    addressLabel: "Adresa",
    companyLabel: "Firma",
    messageLabel: "Správa",
    dateLabel: "Dátum",
    support:
      "Ak máte akékoľvek otázky alebo pripomienky, neváhajte kontaktovať náš tím zákazníckej podpory. Sme tu, aby sme vám pomohli!",
    rights: "Všetky práva vyhradené.",
  },
  de: {
    preview: "Vielen Dank für Ihre Konfiguration bei KONSTANTA - hliníkové ploty s.r.o.",
    logoAlt: "KONSTANTA - hliníkové ploty s.r.o.",
    eyebrow: "Neue Anfrage aus dem Konfigurator",
    headline: "Zaunkonfiguration",
    productsHeading: "Ausgewählte Produkte",
    salutation: "Guten Tag",
    intro:
      "vielen Dank, dass Sie sich für KONSTANTA - hliníkové ploty s.r.o. entschieden haben! Wir freuen uns, Sie unter unseren geschätzten Kunden begrüßen zu dürfen. Ihr Vertrauen in unsere Produkte und Leistungen bedeutet uns alles und wir verpflichten uns, Ihnen ein Erlebnis von höchster Qualität zu bieten.",
    intro2:
      "Ihre Konfiguration ist bei uns eingegangen und wird mit größter Sorgfalt bearbeitet. Wir schätzen Ihr Interesse und freuen uns auf die weitere Zusammenarbeit.",
    companyHeading: "Angaben zum Unternehmen",
    country: "Tschechische Republik",
    ico: "Firmennummer",
    phone: "Telefon",
    email: "E-Mail",
    web: "Web",
    yourInfoHeading: "Ihre Angaben",
    fullName: "Vollständiger Name",
    emailLabel: "E-Mail",
    phoneLabel: "Telefonnummer",
    addressLabel: "Adresse",
    companyLabel: "Firma",
    messageLabel: "Nachricht",
    dateLabel: "Datum",
    support:
      "Wenn Sie Fragen oder Anmerkungen haben, wenden Sie sich bitte jederzeit an unseren Kundenservice. Wir sind gerne für Sie da!",
    rights: "Alle Rechte vorbehalten.",
  },
}

/**
 * Úvodní odstavce a podpis v ConfMail. Oproti sdílenému `mailContent.intro`
 * mluví o cenové kalkulaci — přílohu (XLSX + PDF) posílá jedině `sendConf`,
 * ostatní konfigurátory přikládají jen fotky od zákazníka.
 */
export type ConfMailContent = {
  /** Navazuje na oslovení `${salutation} ${jméno},`, proto začíná malým písmenem. */
  intro: string
  /** Odstavec o přiložené kalkulaci — orientační, ne závazná nabídka. */
  intro2: string
  /** Avízo, že se zákazníkovi ozve obchodní zástupce. */
  intro3: string
  /** Rozloučení nad podpisem. */
  signoff: string
  /** Podpis odesílatele pod rozloučením. */
  team: string
  /** Předmět kopie, která jde zákazníkovi — interní kopie pro `nabidky@` má vlastní. */
  subject: string
}

export const confMailContent: Record<Lang, ConfMailContent> = {
  cs: {
    intro: "děkujeme za využití našeho konfigurátoru. Vaše poptávka byla úspěšně přijata.",
    intro2:
      "Na základě zadaných údajů jsme pro vás připravili orientační cenovou kalkulaci, kterou naleznete v příloze tohoto e-mailu. Kalkulace slouží jako základní cenový návrh a neslouží jako závazná nabídka. Konečná cena se může lišit podle konkrétních požadavků, rozsahu realizace, zaměření stavby a dalších technických okolností.",
    intro3:
      "Pro upřesnění technických parametrů a rozsahu dodávky vás bude v nejbližší době kontaktovat náš obchodní zástupce.",
    signoff: "S pozdravem",
    team: "Tým KONSTANTA - hliníkové ploty s.r.o.",
    subject: "Potvrzení poptávky z konfigurátoru — KONSTANTA - hliníkové ploty s.r.o.",
  },
  sk: {
    intro: "ďakujeme za využitie nášho konfigurátora. Vaša požiadavka bola úspešne prijatá.",
    intro2:
      "Na základe zadaných údajov sme pre vás pripravili orientačnú cenovú kalkuláciu, ktorú nájdete v prílohe tohto e-mailu. Kalkulácia slúži ako základný cenový návrh a nie je záväznou ponukou. Konečná cena sa môže líšiť podľa konkrétnych požiadaviek, rozsahu realizácie, zamerania stavby a ďalších technických okolností.",
    intro3:
      "Na upresnenie technických parametrov a rozsahu dodávky vás v najbližšom čase bude kontaktovať náš obchodný zástupca.",
    signoff: "S pozdravom",
    team: "Tím KONSTANTA - hliníkové ploty s.r.o.",
    subject: "Potvrdenie dopytu z konfigurátora — KONSTANTA - hliníkové ploty s.r.o.",
  },
  de: {
    intro:
      "vielen Dank, dass Sie unseren Konfigurator genutzt haben. Ihre Anfrage ist erfolgreich bei uns eingegangen.",
    intro2:
      "Auf Grundlage Ihrer Angaben haben wir für Sie eine orientierende Preiskalkulation vorbereitet, die Sie im Anhang dieser E-Mail finden. Die Kalkulation ist ein erster Preisvorschlag und stellt kein verbindliches Angebot dar. Der endgültige Preis kann sich je nach konkreten Anforderungen, Umfang der Realisierung, Aufmaß vor Ort und weiteren technischen Gegebenheiten unterscheiden.",
    intro3:
      "Zur Abstimmung der technischen Parameter und des Lieferumfangs wird sich in Kürze unser Vertriebsmitarbeiter bei Ihnen melden.",
    signoff: "Mit freundlichen Grüßen",
    team: "Tým KONSTANTA - hliníkové ploty s.r.o.",
    subject: "Bestätigung Ihrer Anfrage aus dem Konfigurator — KONSTANTA - hliníkové ploty s.r.o.",
  },
}

/** Tabulka konfigurace pergoly v PergMail — typy a hodnoty berou `mountLabels`, `stineniLabels` atd. */
export type PergMailContent = {
  /** Velký kondenzovaný nadpis v hlavičce e-mailu (obdoba `MailChromeContent.headline`). */
  headline: string
  /** Nadpis sekce s rozměry a parametry pergoly. */
  configHeading: string
  typeHeading: string
  pergolaLabel: string
  notSpecified: string
  width: string
  length: string
  depth: string
  cornerA: string
  cornerB: string
  cornerC: string
  moreHeading: string
  shading: string
  sidesAlt: string
  sides: string
  material: string
  color: string
  /** Řádek doplňku LED osvětlení (jen u bioklimatické pergoly). */
  led: string
  ledYes: string
  ledNo: string
  /** Řádek s počtem kusů LED světel a jeho jednotka. */
  ledCount: string
  pieces: string
  autoGenerated: string
}

/** Tabulka konfigurace zábradlí v ZabMail — hodnoty berou `zabradliMaterialLabels`, `zabradliSkloLabels`, `motivLabels`. */
export type ZabMailContent = {
  /** Velký kondenzovaný nadpis v hlavičce e-mailu (obdoba `MailChromeContent.headline`). */
  headline: string
  /** Nadpis sekce s rozměry a výplní zábradlí. */
  configHeading: string
  zabradliLabel: string
  notSpecified: string
  /** Popisek jedné sady rozměrů, když jich zákazník zadal víc — „Sada rozměrů 2". */
  sizeLabel: string
  height: string
  width: string
  count: string
  pieces: string
  moreHeading: string
  material: string
  glass: string
  motiv: string
  autoGenerated: string
}

export const zabMailContent: Record<Lang, ZabMailContent> = {
  cs: {
    headline: "Konfigurace zábradlí",
    configHeading: "Parametry zábradlí",
    zabradliLabel: "Zábradlí",
    notSpecified: "Neuvedeno",
    sizeLabel: "Sada rozměrů",
    height: "Výška",
    width: "Šířka",
    count: "Počet",
    pieces: "ks",
    moreHeading: "Výplň zábradlí",
    material: "Materiál výplně",
    glass: "Odstín skla",
    motiv: "Motiv výplně",
    autoGenerated: "Tento e-mail byl automaticky vygenerován.",
  },
  sk: {
    headline: "Konfigurácia zábradlia",
    configHeading: "Parametre zábradlia",
    zabradliLabel: "Zábradlie",
    notSpecified: "Neuvedené",
    sizeLabel: "Sada rozmerov",
    height: "Výška",
    width: "Šírka",
    count: "Počet",
    pieces: "ks",
    moreHeading: "Výplň zábradlia",
    material: "Materiál výplne",
    glass: "Odtieň skla",
    motiv: "Motív výplne",
    autoGenerated: "Tento e-mail bol automaticky vygenerovaný.",
  },
  de: {
    headline: "Geländer-Konfiguration",
    configHeading: "Geländer-Parameter",
    zabradliLabel: "Geländer",
    notSpecified: "Nicht angegeben",
    sizeLabel: "Maßsatz",
    height: "Höhe",
    width: "Breite",
    count: "Anzahl",
    pieces: "Stk.",
    moreHeading: "Geländerfüllung",
    material: "Material der Füllung",
    glass: "Glaston",
    motiv: "Motiv der Füllung",
    autoGenerated: "Diese E-Mail wurde automatisch generiert.",
  },
}

export const pergMailContent: Record<Lang, PergMailContent> = {
  cs: {
    headline: "Konfigurace pergoly",
    configHeading: "Parametry pergoly",
    typeHeading: "Typ pergoly",
    pergolaLabel: "Pergola",
    notSpecified: "Neuvedeno",
    width: "Šířka",
    length: "Délka",
    depth: "Hloubka",
    cornerA: "A – Délka",
    cornerB: "B – Hloubka",
    cornerC: "C – Výška",
    moreHeading: "Další informace",
    shading: "Stínění",
    sidesAlt: "Strany stínění",
    sides: "Strany",
    material: "Materiál",
    color: "Barva",
    led: "LED světla",
    ledYes: "Ano",
    ledNo: "Ne",
    ledCount: "Počet LED světel",
    pieces: "ks",
    autoGenerated: "Tento e-mail byl automaticky vygenerován.",
  },
  sk: {
    headline: "Konfigurácia pergoly",
    configHeading: "Parametre pergoly",
    typeHeading: "Typ pergoly",
    pergolaLabel: "Pergola",
    notSpecified: "Neuvedené",
    width: "Šírka",
    length: "Dĺžka",
    depth: "Hĺbka",
    cornerA: "A – Dĺžka",
    cornerB: "B – Hĺbka",
    cornerC: "C – Výška",
    moreHeading: "Ďalšie informácie",
    shading: "Tienenie",
    sidesAlt: "Strany tienenia",
    sides: "Strany",
    material: "Materiál",
    color: "Farba",
    led: "LED svetlá",
    ledYes: "Áno",
    ledNo: "Nie",
    ledCount: "Počet LED svetiel",
    pieces: "ks",
    autoGenerated: "Tento e-mail bol automaticky vygenerovaný.",
  },
  de: {
    headline: "Pergola-Konfiguration",
    configHeading: "Pergola-Parameter",
    typeHeading: "Pergola-Typ",
    pergolaLabel: "Pergola",
    notSpecified: "Nicht angegeben",
    width: "Breite",
    length: "Länge",
    depth: "Tiefe",
    cornerA: "A – Länge",
    cornerB: "B – Tiefe",
    cornerC: "C – Höhe",
    moreHeading: "Weitere Angaben",
    shading: "Beschattung",
    sidesAlt: "Beschattete Seiten",
    sides: "Seiten",
    material: "Material",
    color: "Farbe",
    led: "LED-Leuchten",
    ledYes: "Ja",
    ledNo: "Nein",
    ledCount: "Anzahl LED-Leuchten",
    pieces: "Stk.",
    autoGenerated: "Diese E-Mail wurde automatisch generiert.",
  },
}

/**
 * Texty PDF cenové nabídky (`htmlToPdf` v lib/actions.ts). Položky v `termsPersonalItems`
 * a `termsCompanyItems` a texty `termText` / `depositText` obsahují inline HTML
 * (`<b>`, `<strong>`) — vkládají se do šablony bez escapování.
 */
export type QuoteContent = {
  docTitle: string
  numberPrefix: string
  metaNumber: string
  metaIssued: string
  metaValid: string
  supplier: string
  customer: string
  country: string
  ico: string
  phone: string
  email: string
  web: string
  company: string
  configHeading: string
  itemsHeading: string
  itemsCont: string
  thItem: string
  thQty: string
  thNoVat: string
  thVat: string
  thWithVat: string
  specsHeading: string
  noteHeading: string
  termHeading: string
  termBadge: string
  termText: string
  depositHeading: string
  depositBadge: string
  depositText: string
  termsHeading: string
  termsPersonal: string
  termsPersonalItems: string[]
  termsPersonalNote: string
  termsCompany: string
  termsCompanyItems: string[]
  termsCompanyNote: string
  disclaimer: string
  validUntil: string
}

/**
 * Texty e-mailu poptávky stavební přípravy (components/ZakladyMail.tsx). Chrome
 * e-mailu (oslovení, firemní karta, patička) se bere z `mailContent`, tady jsou
 * jen části specifické pro tuhle poptávku.
 */
export const zakladyMailContent: Record<
  Lang,
  {
    preview: string
    eyebrow: string
    headline: string
    intro: string
    intro2: string
    scopeHeading: string
    scopeLabel: string
    situationHeading: string
    placeLabel: string
    attachmentsLabel: string
    notSpecified: string
    autoGenerated: string
  }
> = {
  cs: {
    preview: "Nová poptávka stavební přípravy a základů",
    eyebrow: "Nová poptávka z webu",
    headline: "Stavební příprava a základy",
    intro:
      "Děkujeme za poptávku. Beze zbytku ji máme a pustíme se do ní — ozveme se vám a domluvíme termín osobní schůzky přímo na pozemku.",
    intro2:
      "Na místě vše zaměříme, navrhneme ideální stavební řešení a naceníme do posledního detailu. Cena po dokončení realizace už neroste.",
    scopeHeading: "Co máme zajistit",
    scopeLabel: "Rozsah prací",
    situationHeading: "Popis situace",
    placeLabel: "Místo realizace",
    attachmentsLabel: "Počet příloh",
    notSpecified: "Neuvedeno",
    autoGenerated: "Tento přehled byl vygenerován automaticky z formuláře na webu.",
  },
  sk: {
    preview: "Nový dopyt na stavebnú prípravu a základy",
    eyebrow: "Nový dopyt z webu",
    headline: "Stavebná príprava a základy",
    intro:
      "Ďakujeme za dopyt. Máme ho kompletný a pustíme sa doň — ozveme sa vám a dohodneme termín osobného stretnutia priamo na pozemku.",
    intro2:
      "Na mieste všetko zameriame, navrhneme ideálne stavebné riešenie a naceníme do posledného detailu. Cena po dokončení realizácie už nerastie.",
    scopeHeading: "Čo máme zabezpečiť",
    scopeLabel: "Rozsah prác",
    situationHeading: "Opis situácie",
    placeLabel: "Miesto realizácie",
    attachmentsLabel: "Počet príloh",
    notSpecified: "Neuvedené",
    autoGenerated: "Tento prehľad bol vygenerovaný automaticky z formulára na webe.",
  },
  de: {
    preview: "Neue Anfrage zu Bauvorbereitung und Fundament",
    eyebrow: "Neue Anfrage über die Website",
    headline: "Bauvorbereitung und Fundament",
    intro:
      "Vielen Dank für Ihre Anfrage. Sie ist vollständig bei uns eingegangen — wir melden uns und vereinbaren einen Termin direkt auf dem Grundstück.",
    intro2:
      "Vor Ort messen wir alles auf, entwerfen die passende bauliche Lösung und kalkulieren sie bis ins letzte Detail. Nach Abschluss der Arbeiten steigt der Preis nicht mehr.",
    scopeHeading: "Was wir übernehmen sollen",
    scopeLabel: "Leistungsumfang",
    situationHeading: "Beschreibung der Situation",
    placeLabel: "Ort der Umsetzung",
    attachmentsLabel: "Anzahl der Anhänge",
    notSpecified: "Nicht angegeben",
    autoGenerated: "Diese Übersicht wurde automatisch aus dem Formular auf der Website erzeugt.",
  },
}

export const quoteContent: Record<Lang, QuoteContent> = {
  cs: {
    docTitle: "Cenová nabídka",
    numberPrefix: "č.",
    metaNumber: "Nabídka č.",
    metaIssued: "Datum vystavení",
    metaValid: "Platnost nabídky do",
    supplier: "Dodavatel",
    customer: "Odběratel",
    country: "Česká republika",
    ico: "IČO",
    phone: "Telefon",
    email: "E-mail",
    web: "Web",
    company: "Firma",
    configHeading: "Konfigurace",
    itemsHeading: "Položky nabídky",
    itemsCont: "Položky nabídky — pokračování",
    thItem: "Položka",
    thQty: "Množství",
    thNoVat: "Cena bez DPH",
    thVat: "DPH",
    thWithVat: "Cena s DPH",
    specsHeading: "Specifikace",
    noteHeading: "Poznámka zákazníka",
    termHeading: "Termín realizace",
    termBadge: "4–10 týdnů",
    termText:
      "Realizace zakázky proběhne v rozmezí <strong>4–10 týdnů</strong> od podpisu smlouvy a uhrazení zálohy.",
    depositHeading: "Záloha",
    depositBadge: "50 %",
    depositText:
      "Před zahájením realizace je požadována záloha ve výši <strong>50 % z celkové ceny zakázky</strong>. Doplatek bude uhrazen v den montáže po předání díla.",
    termsHeading: "Obchodní podmínky",
    termsPersonal: "Fyzické osoby",
    termsPersonalItems: [
      "Záruka na materiál: <b>10 let</b>",
      "Záruka na pohon: <b>3 roky</b>",
      "Záruka na montážní práce: <b>2 roky</b>",
    ],
    termsPersonalNote:
      "Záruka se vztahuje na vady materiálu, funkčnost pohonu a kvalitu provedených montážních prací.",
    termsCompany: "Firmy",
    termsCompanyItems: [
      "Splatnost faktur: <b>30 dnů</b>",
      "Pozastávky: <b>10 % / 8 % / 2 %</b>",
      "Zařízení staveniště / vícepráce: <b>0 %</b>",
      "Záruka výrobků / pohonů / montáže: <b>55 / 36 / 24 měsíců</b>",
    ],
    termsCompanyNote: "Realizace zakázky proběhne v dohodnutý termín s objednatelem.",
    disclaimer:
      "Nabídka je nezávazná a vychází z údajů zadaných v konfigurátoru na konstantahp.cz. Konečná cena bude potvrzena po zaměření na místě.",
    validUntil: "Platnost nabídky do",
  },
  sk: {
    docTitle: "Cenová ponuka",
    numberPrefix: "č.",
    metaNumber: "Ponuka č.",
    metaIssued: "Dátum vystavenia",
    metaValid: "Platnosť ponuky do",
    supplier: "Dodávateľ",
    customer: "Odberateľ",
    country: "Česká republika",
    ico: "IČO",
    phone: "Telefón",
    email: "E-mail",
    web: "Web",
    company: "Firma",
    configHeading: "Konfigurácia",
    itemsHeading: "Položky ponuky",
    itemsCont: "Položky ponuky — pokračovanie",
    thItem: "Položka",
    thQty: "Množstvo",
    thNoVat: "Cena bez DPH",
    thVat: "DPH",
    thWithVat: "Cena s DPH",
    specsHeading: "Špecifikácia",
    noteHeading: "Poznámka zákazníka",
    termHeading: "Termín realizácie",
    termBadge: "4–10 týždňov",
    termText:
      "Realizácia zákazky prebehne v rozmedzí <strong>4–10 týždňov</strong> od podpisu zmluvy a uhradenia zálohy.",
    depositHeading: "Záloha",
    depositBadge: "50 %",
    depositText:
      "Pred začatím realizácie je požadovaná záloha vo výške <strong>50 % z celkovej ceny zákazky</strong>. Doplatok bude uhradený v deň montáže po odovzdaní diela.",
    termsHeading: "Obchodné podmienky",
    termsPersonal: "Fyzické osoby",
    termsPersonalItems: [
      "Záruka na materiál: <b>10 rokov</b>",
      "Záruka na pohon: <b>3 roky</b>",
      "Záruka na montážne práce: <b>2 roky</b>",
    ],
    termsPersonalNote:
      "Záruka sa vzťahuje na vady materiálu, funkčnosť pohonu a kvalitu vykonaných montážnych prác.",
    termsCompany: "Firmy",
    termsCompanyItems: [
      "Splatnosť faktúr: <b>30 dní</b>",
      "Zádržné: <b>10 % / 8 % / 2 %</b>",
      "Zariadenie staveniska / práce navyše: <b>0 %</b>",
      "Záruka na výrobky / pohony / montáž: <b>55 / 36 / 24 mesiacov</b>",
    ],
    termsCompanyNote: "Realizácia zákazky prebehne v dohodnutom termíne s objednávateľom.",
    disclaimer:
      "Ponuka je nezáväzná a vychádza z údajov zadaných v konfigurátore na konstantahp.cz. Konečná cena bude potvrdená po zameraní na mieste.",
    validUntil: "Platnosť ponuky do",
  },
  de: {
    docTitle: "Preisangebot",
    numberPrefix: "Nr.",
    metaNumber: "Angebot Nr.",
    metaIssued: "Ausstellungsdatum",
    metaValid: "Angebot gültig bis",
    supplier: "Lieferant",
    customer: "Kunde",
    country: "Tschechische Republik",
    ico: "Firmennummer",
    phone: "Telefon",
    email: "E-Mail",
    web: "Web",
    company: "Firma",
    configHeading: "Konfiguration",
    itemsHeading: "Angebotspositionen",
    itemsCont: "Angebotspositionen — Fortsetzung",
    thItem: "Position",
    thQty: "Menge",
    thNoVat: "Preis netto",
    thVat: "MwSt.",
    thWithVat: "Preis brutto",
    specsHeading: "Spezifikation",
    noteHeading: "Anmerkung des Kunden",
    termHeading: "Realisierungstermin",
    termBadge: "4–10 Wochen",
    termText:
      "Die Ausführung des Auftrags erfolgt innerhalb von <strong>4–10 Wochen</strong> nach Vertragsunterzeichnung und Zahlung der Anzahlung.",
    depositHeading: "Anzahlung",
    depositBadge: "50 %",
    depositText:
      "Vor Beginn der Ausführung wird eine Anzahlung in Höhe von <strong>50 % des Gesamtauftragswerts</strong> verlangt. Die Restzahlung erfolgt am Montagetag nach Übergabe des Werks.",
    termsHeading: "Geschäftsbedingungen",
    termsPersonal: "Privatpersonen",
    termsPersonalItems: [
      "Garantie auf Material: <b>10 Jahre</b>",
      "Garantie auf den Antrieb: <b>3 Jahre</b>",
      "Garantie auf Montagearbeiten: <b>2 Jahre</b>",
    ],
    termsPersonalNote:
      "Die Garantie gilt für Materialfehler, die Funktion des Antriebs und die Qualität der ausgeführten Montagearbeiten.",
    termsCompany: "Firmen",
    termsCompanyItems: [
      "Zahlungsziel der Rechnungen: <b>30 Tage</b>",
      "Einbehalte: <b>10 % / 8 % / 2 %</b>",
      "Baustelleneinrichtung / Mehrleistungen: <b>0 %</b>",
      "Garantie auf Produkte / Antriebe / Montage: <b>55 / 36 / 24 Monate</b>",
    ],
    termsCompanyNote: "Die Ausführung des Auftrags erfolgt zum mit dem Auftraggeber vereinbarten Termin.",
    disclaimer:
      "Das Angebot ist unverbindlich und basiert auf den im Konfigurator auf konstantahp.cz eingegebenen Angaben. Der endgültige Preis wird nach dem Aufmaß vor Ort bestätigt.",
    validUntil: "Angebot gültig bis",
  },
}

/**
 * Názvy řádků kalkulace — sdílí je XLSX (`createXlsx`) i tabulka v PDF, aby
 * obě přílohy mluvily stejně. Ceny se nepřepočítávají, měna zůstává Kč.
 */
export type QuoteItemsContent = {
  sheetName: string
  currency: string
  header: { produkt: string; mnozstvi: string; bezDph: string; dph: string; sDph: string }
  /** Pohon křídlových bran (dvoukridla / skladaci) — Somfy Ixengo L. */
  pohonKridlova: string
  /** Pohon posuvných bran (zbytek variant) — Somfy Elixo 500. */
  pohonPosuvna: string
  /** Hydraulická brzda — přidává se k posuvným bránám ve svahu. */
  brzda: string
  /** Kolejnice — účtuje se u pojezdových bran (atypická, teleskopická pojezdová, posuvná). */
  kolejnice: string
  /** Dojezdový sloupek se zadlabávacím zámkem — posuvné a samonosné brány. */
  dojezdSloupek: string
  zastrc: string
  /** Kování brány — účtuje se u ručně ovládaných bran s křídlem (2 ks). */
  kovaniBrany: string
  tahoma: string
  montazBrany: string
  branka: string
  zamek: string
  schranka: string
  zvonek: string
  /** Klíče odpovídají `brankaKovaniOptions`; `fallback` pro nevyplněnou volbu. */
  kovani: Record<string, string>
  kovaniFallback: string
  montazBranky: string
  /** Sloupky — typ (vlastní / hliníkové). */
  typSloupku: string
  /**
   * Hliníkový sloupek účtovaný za běžný metr — klíčováno spodním uchycením, protože
   * sloupek na patce je jiný díl za jinou cenu. Doplňuje se o profil a délku sady.
   */
  sloupekBm: Record<string, string>
  /**
   * Krycí čepička za kus. Taky klíčovaná uchycením: čepička na betonovaný sloupek
   * a na sloupek s patkou nejsou zaměnitelné a v nabídce to musí být vidět.
   */
  cepicka: Record<string, string>
  /** Zabetonování jednoho sloupku do země — účtuje se za kus. */
  betonovaniSloupku: string
  /** Spodní uchycení sloupků včetně provedení („svépomocí“ / „včetně betonování“). */
  uchyceniSloupku: string
  dilce: string
  montazDilcu: string
  barvaDilcu: string
  motiv: string
  /** Paušál za dopravu — přičítá se ke každé nabídce jednou. */
  doprava: string
  celkem: string
}

export const quoteItemsContent: Record<Lang, QuoteItemsContent> = {
  cs: {
    sheetName: "Kalkulace",
    currency: "Kč",
    header: { produkt: "Produkt", mnozstvi: "Množství", bezDph: "Cena bez DPH", dph: "DPH", sDph: "Cena s DPH" },
    pohonKridlova: "IXENGO io – pohon brány s řídicí jednotkou a rádiovým přijímačem, Somfy Master Pro Bitech – bezpečnostní fotobuňky (1 pár), Výstražný maják, Záložní zdroj pro nouzové otevření brány při výpadku elektrické energie, 2× ovladač (dálkový ovladač Somfy)",
    pohonPosuvna:
      "Pohon posuvné brány ELIXO 500 3 S M io komfort set – pohon s řídicí jednotkou a rádiovým přijímačem, 1x Somfy Master Pro Bitech – bezpečnostní fotobuňky (1 pár) dosah 10 m, 2x Odblokovací klíč (použití při výpadku proudu)",
    brzda: "Hydraulická brzda pro posuvné brány ve svahu",
    kolejnice: "Kolejnice pro posuvnou bránu",
    dojezdSloupek: "Dojezdový sloupek + zadlabávací zámek",
    zastrc: "Zástrč brány",
    kovaniBrany: "Kování brány",
    tahoma:
      "Somfy TaHoma switch je centrální jednotka pro chytrou domácnost, která umožňuje ovládat a automatizovat různá zařízení v domě, jako jsou rolety, žaluzie, brány, osvětlení, topení a další",
    montazBrany: "Montáž brány",
    branka: "Branka",
    zamek: "El. zámek napětí 9 – 12 V AC/DC, s posuvnou zarážkou a mechanickým odblokováním",
    schranka: "Poštovní schránka zapuštěná do lamely",
    zvonek: "Domovní videotelefon Somfy V500 PRO io",
    kovani: {
      "kliky-mt": "Kování branky nerez — kliky M&T (klika/klika – koule/klika)",
      "madlo-300": "Kování branky nerez — madlo 300 mm",
      "madlo-225": "Kování branky nerez — madlo 225 mm",
      "madlo-1250": "Kování branky nerez — madlo 1250 mm",
    },
    kovaniFallback: "Kování branky nerez (klika/klika – koule/klika)",
    montazBranky: "Montáž branky",
    typSloupku: "Typ sloupků",
    sloupekBm: {
      nabetonovani: "Hliníkový sloupek na betonování",
      patka: "Hliníkový sloupek na patce",
    },
    cepicka: {
      nabetonovani: "Krycí čepička pro sloupek na betonování",
      patka: "Krycí čepička pro sloupek na patce",
    },
    betonovaniSloupku: "Betonování sloupku",
    uchyceniSloupku: "Spodní uchycení sloupků",
    dilce: "Plotové dílce",
    montazDilcu: "Montáž dílců",
    barvaDilcu: "Barva dílců",
    motiv: "Motiv",
    doprava: "Doprava",
    celkem: "Celkem:",
  },
  sk: {
    sheetName: "Kalkulácia",
    currency: "Kč",
    header: { produkt: "Produkt", mnozstvi: "Množstvo", bezDph: "Cena bez DPH", dph: "DPH", sDph: "Cena s DPH" },
    pohonKridlova: "IXENGO io – pohon brány s riadiacou jednotkou a rádiovým prijímačom, Somfy Master Pro Bitech – bezpečnostné fotobunky (1 pár), Výstražný maják, Záložný zdroj pre núdzové otvorenie brány pri výpadku elektrickej energie, 2× ovládač (diaľkový ovládač Somfy)",
    pohonPosuvna:
      "Pohon posuvnej brány ELIXO 500 3 S M io komfort set – pohon s riadiacou jednotkou a rádiovým prijímačom, 1x Somfy Master Pro Bitech – bezpečnostné fotobunky (1 pár) dosah 10 m, 2x Odblokovací kľúč (použitie pri výpadku prúdu)",
    brzda: "Hydraulická brzda pre posuvné brány vo svahu",
    kolejnice: "Koľajnica pre posuvnú bránu",
    dojezdSloupek: "Dojazdový stĺpik + zadlabávací zámok",
    zastrc: "Zástrč brány",
    kovaniBrany: "Kovanie brány",
    tahoma:
      "Somfy TaHoma switch je centrálna jednotka pre inteligentnú domácnosť, ktorá umožňuje ovládať a automatizovať rôzne zariadenia v dome, ako sú rolety, žalúzie, brány, osvetlenie, kúrenie a ďalšie",
    montazBrany: "Montáž brány",
    branka: "Bránka",
    zamek: "El. zámok napätie 9 – 12 V AC/DC, s posuvnou zarážkou a mechanickým odblokovaním",
    schranka: "Poštová schránka zapustená do lamely",
    zvonek: "Domový videotelefón Somfy V500 PRO io",
    kovani: {
      "kliky-mt": "Kovanie bránky nerez — kľučky M&T (kľučka/kľučka – guľa/kľučka)",
      "madlo-300": "Kovanie bránky nerez — madlo 300 mm",
      "madlo-225": "Kovanie bránky nerez — madlo 225 mm",
      "madlo-1250": "Kovanie bránky nerez — madlo 1250 mm",
    },
    kovaniFallback: "Kovanie bránky nerez (kľučka/kľučka – guľa/kľučka)",
    montazBranky: "Montáž bránky",
    typSloupku: "Typ stĺpikov",
    sloupekBm: {
      nabetonovani: "Hliníkový stĺpik na betónovanie",
      patka: "Hliníkový stĺpik na pätke",
    },
    cepicka: {
      nabetonovani: "Krycia čiapočka pre stĺpik na betónovanie",
      patka: "Krycia čiapočka pre stĺpik na pätke",
    },
    betonovaniSloupku: "Betónovanie stĺpika",
    uchyceniSloupku: "Spodné uchytenie stĺpikov",
    dilce: "Plotové dielce",
    montazDilcu: "Montáž dielcov",
    barvaDilcu: "Farba dielcov",
    motiv: "Motív",
    doprava: "Doprava",
    celkem: "Spolu:",
  },
  de: {
    sheetName: "Kalkulation",
    currency: "CZK",
    header: { produkt: "Produkt", mnozstvi: "Menge", bezDph: "Preis netto", dph: "MwSt.", sDph: "Preis brutto" },
    pohonKridlova: "IXENGO io – Torantrieb mit Steuereinheit und Funkempfänger, Somfy Master Pro Bitech – Sicherheitslichtschranken (1 Paar), Warnleuchte, Notstromversorgung für die Notöffnung des Tors bei Stromausfall, 2× Handsender (Somfy-Fernbedienung)",
    pohonPosuvna:
      "Antrieb für Schiebetore ELIXO 500 3 S M io Komfort-Set – Antrieb mit Steuereinheit und Funkempfänger, 1x Somfy Master Pro Bitech – Sicherheitslichtschranke (1 Paar), Reichweite 10 m, 2x Entriegelungsschlüssel (bei Stromausfall)",
    brzda: "Hydraulische Bremse für Schiebetore in Hanglage",
    kolejnice: "Laufschiene für das Schiebetor",
    dojezdSloupek: "Endpfosten + Einsteckschloss",
    zastrc: "Torriegel",
    kovaniBrany: "Torbeschlag",
    tahoma:
      "Somfy TaHoma Switch ist die Zentraleinheit für das Smart Home und ermöglicht die Steuerung und Automatisierung verschiedener Geräte im Haus wie Rollläden, Jalousien, Tore, Beleuchtung, Heizung und weitere",
    montazBrany: "Montage des Tors",
    branka: "Gartentür",
    zamek: "Elektroschloss 9 – 12 V AC/DC, mit Schiebefalle und mechanischer Entriegelung",
    schranka: "In die Lamelle eingelassener Briefkasten",
    zvonek: "Video-Türsprechanlage Somfy V500 PRO io",
    kovani: {
      "kliky-mt": "Beschlag Gartentür Edelstahl — Drückergarnitur M&T (Drücker/Drücker – Knauf/Drücker)",
      "madlo-300": "Beschlag Gartentür Edelstahl — Stoßgriff 300 mm",
      "madlo-225": "Beschlag Gartentür Edelstahl — Stoßgriff 225 mm",
      "madlo-1250": "Beschlag Gartentür Edelstahl — Stoßgriff 1250 mm",
    },
    kovaniFallback: "Beschlag Gartentür Edelstahl (Drücker/Drücker – Knauf/Drücker)",
    montazBranky: "Montage der Gartentür",
    typSloupku: "Pfostentyp",
    sloupekBm: {
      nabetonovani: "Aluminiumpfosten zum Einbetonieren",
      patka: "Aluminiumpfosten auf Fußplatte",
    },
    cepicka: {
      nabetonovani: "Abdeckkappe für Pfosten zum Einbetonieren",
      patka: "Abdeckkappe für Pfosten auf Fußplatte",
    },
    betonovaniSloupku: "Einbetonieren des Pfostens",
    uchyceniSloupku: "Untere Pfostenbefestigung",
    dilce: "Zaunelemente",
    montazDilcu: "Montage der Zaunelemente",
    barvaDilcu: "Farbe der Elemente",
    motiv: "Motiv",
    doprava: "Transport",
    celkem: "Gesamt:",
  },
}
