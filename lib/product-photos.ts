import type {
  ConfPhotoItem,
  ConfPhotosWithMotiv,
  ConfProductInfo,
  PortableBlock,
  ProductPhotosDoc,
} from "@/types"
import type { Lang } from "@/lib/translations"

/**
 * `productPhotos` dokumenty v Sanity nemají žádné strojové id — rozlišují se jen
 * lidsky čitelným `nameCs`. Tahle mapa říká, který dokument (podle přesného názvu,
 * jak je zadaný v Sanity) patří ke kterému `photosKey` z `lib/konf-content.ts` /
 * `lib/perg-content.ts`. Když klient dokument v Studiu přejmenuje, daná položka
 * jen přijde o fotky v galerii (nespadne nic) — proto stojí za to při přejmenování
 * v Sanity tuhle mapu zase doladit.
 */
export const PRODUCT_PHOTOS_NAME_MAP: Record<keyof ConfPhotosWithMotiv, string> = {
  dvoukridla: "Dvoukřídlá",
  jednokridla: "Jednokřídlá brána",
  samonosna: "Samonosná brána",
  poKolejnici: "Brána po kolejnici",
  telSam: "Teleskopická brána",
  telPoj: "Teleskopická pojezdová brána",
  atypicka: "Atypická brána",
  sikma: "Šikmá brána",
  skladaci: "Křídlová skládací brána",
  sekcni: "Sekční brána po kolejnicích",
  branka: "Branka",
  ploty: "Plotové dílce",
  bioklimaticka: "Bioklimatické pergoly",
  zahrada: "Zimní zahrady",
  pristresek: "Přístřešky",
  zabradli: "Zábradlí",
}

/**
 * Názvy v Sanity jsou psané ručně, takže se v nich liší diakritika i mezery
 * („Zabradlí“ vs. „Zábradlí“, „Šikmá brána “ s mezerou na konci). Párování proto
 * jede přes normalizovaný tvar — bez diakritiky, malými písmeny, se sraženými
 * mezerami — ať drobný překlep ve Studiu nesebere produktu celou galerii.
 */
function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
}

/** `productPhotos` dokumenty naindexované podle normalizovaného `nameCs`. */
function indexByName(docs: ProductPhotosDoc[] | null | undefined): Map<string, ProductPhotosDoc> {
  const byName = new Map<string, ProductPhotosDoc>()
  for (const doc of docs ?? []) {
    if (doc.nameCs) byName.set(normalizeName(doc.nameCs), doc)
  }
  return byName
}

/** Klíč pole v `productPhotos` → id motivu, stejné jako `motivy`/`motivLabels`. */
const MOTIV_FIELD_TO_ID: Record<string, string> = {
  okS: "o-standart",
  okK: "kapka",
  okKM: "kapka-mini",
  p60: "planka-60",
  p90: "plaka-90",
  p120: "planka-120",
  p150: "planka-150",
  tycka: "tycka",
  vlKom: "vlastní kombinace",
  drevodekor: "drevodekor",
  tahokov: "tahokov",
  // Sklo je výplň zábradlí — v mřížce motivů oplocení se nikdy neobjeví, protože
  // ostatní produkty pole `sklo` v Sanity vyplněné nemají.
  sklo: "sklo",
}

function flattenDoc(doc: ProductPhotosDoc): ConfPhotoItem[] {
  return Object.entries(MOTIV_FIELD_TO_ID).flatMap(([field, motiv]) => {
    const urls = (doc[field as keyof ProductPhotosDoc] as string[] | null | undefined) ?? []
    return urls.filter(Boolean).map((url) => ({ url, motiv }))
  })
}

/**
 * Vezme syrové `productPhotos` dokumenty (PRODUCT_PHOTOS_QUERY) a poskládá je do
 * stejného tvaru, jaký dřív měl `ConfPhotos`/`ConfPhotosWithMotiv` z `confPhotos` —
 * takže `Configurator`/`PergolaConfigurator` a jednotlivé kroky se nemusí měnit,
 * jen se jinak plní `photos` prop.
 */
export function buildGalleryPhotos(docs: ProductPhotosDoc[] | null | undefined): ConfPhotosWithMotiv {
  const byName = indexByName(docs)

  const result = {} as ConfPhotosWithMotiv
  for (const key of Object.keys(PRODUCT_PHOTOS_NAME_MAP) as (keyof ConfPhotosWithMotiv)[]) {
    const doc = byName.get(normalizeName(PRODUCT_PHOTOS_NAME_MAP[key]))
    result[key] = doc ? flattenDoc(doc) : []
  }
  return result
}

/** Kolik fotek se ukáže v popupu „Podrobnější informace“. */
const INFO_PHOTO_COUNT = 3

/**
 * V Sanity je vyplněný jen `nameCs`/`popisCs` u všech dokumentů, kdežto `nameDe`
 * je u většiny bran `null`. Prázdný název by na kartě vykreslil prázdný nadpis,
 * tak se padá zpátky na češtinu — radši český text než žádný.
 */
function pickLocalized<T>(cs: T | undefined, sk: T | undefined, de: T | undefined, lang: Lang): T | undefined {
  const preferred = lang === "sk" ? sk : lang === "de" ? de : cs
  return preferred ?? cs
}

function hasText(blocks: PortableBlock[] | undefined): boolean {
  return Boolean(blocks?.some((b) => b.children?.some((c) => c.text?.trim())))
}

/**
 * Sestaví lokalizované texty + pár fotek pro popup „Podrobnější informace“.
 * Bere stejné `productPhotos` dokumenty jako `buildGalleryPhotos` a páruje je přes
 * tutéž `PRODUCT_PHOTOS_NAME_MAP`, takže karta má info a galerii pod jedním `photosKey`.
 *
 * Produkt, ke kterému v Sanity není dokument (nebo má prázdný popis), se ve výsledku
 * neobjeví — karta pak odkaz „Podrobnější informace“ vůbec nevykreslí.
 */
export function buildProductInfo(
  docs: ProductPhotosDoc[] | null | undefined,
  lang: Lang,
): ConfProductInfo {
  const byName = indexByName(docs)

  const result: ConfProductInfo = {}
  for (const key of Object.keys(PRODUCT_PHOTOS_NAME_MAP) as (keyof ConfPhotosWithMotiv)[]) {
    const doc = byName.get(normalizeName(PRODUCT_PHOTOS_NAME_MAP[key]))
    if (!doc) continue

    const popis = pickLocalized(doc.popisCs, doc.popisSk, doc.popisDe, lang)
    if (!hasText(popis)) continue

    // `photo` (Úvodní fotka) je kurátorovaný záběr produktu, tak jde první;
    // zbytek se doplní z fotek realizací, bez duplicit.
    const gallery = flattenDoc(doc).map((p) => p.url)
    const photos = [...new Set([doc.banner, ...gallery].filter(Boolean) as string[])].slice(
      0,
      INFO_PHOTO_COUNT,
    )

    result[key] = {
      name: pickLocalized(doc.nameCs, doc.nameSk, doc.nameDe, lang)?.trim() ?? "",
      popis: popis ?? [],
      photos,
    }
  }
  return result
}
