import type { ConfiguratorType } from "@/lib/schemas"
import type { ConfPhotosWithMotiv } from "@/types"

/**
 * Textový a datový obsah konfigurátoru oplocení. Držet odděleně od komponent,
 * aby šlo přidat/upravit produkt (bránu, motiv, barvu…) bez zásahu do UI kódu.
 */

export const konfCopy = {
  heading: "Nakonfigurujte si své oplocení",
  subheading:
    "Projděte pár kroků a sestavte si bránu, branku, plotové dílce i motiv plotu přesně podle sebe. Na konci vám pošleme nezávaznou kalkulaci.",
  next: "Další krok",
  back: "Zpět",
  sendText: "Odeslat poptávku",
  dimensionLabels: {
    vyska: "Výška (mm)",
    delka: "Šířka průjezdu (mm)",
    pocet: "Počet (ks)",
  },
} as const

export type GateFieldKey = keyof ConfiguratorType

/** Klíče trojice polí, kterými se v `confSchema` popisuje jeden typ brány. */
export type GateProductConfig = {
  id: string
  label: string
  image: string
  enabledField: GateFieldKey
  countField: GateFieldKey
  arrayField: GateFieldKey
  /**
   * Klíč galerie se skutečnými fotkami realizací tohoto typu. Váže se na
   * `ConfPhotosWithMotiv` (fotky z `productPhotos`), ne na širší `ConfPhotos` —
   * ten má navíc `zabradli`, které mezi bránami nic neindexuje a rozbíjelo
   * `photos[gate.photosKey]` v kroku „Brána“.
   */
  photosKey: keyof ConfPhotosWithMotiv
}

// Devět typů vjezdových bran — přesně názvy polí ze stávajícího confSchema,
// aby formulář zůstal kompatibilní s existující akcí `sendConf`.
export const gateProducts: GateProductConfig[] = [
  {
    id: "dvoukridla",
    label: "Otočná brána dvoukřídlá",
    image: "/modely/brany/dvoukridla.webp",
    enabledField: "dvoukridla",
    countField: "celkem2K",
    arrayField: "rozmery2KBran",
    photosKey: "dvoukridla",
  },
  {
    id: "jednokridla",
    label: "Otočná brána jednokřídlá",
    image: "/modely/brany/jednokridla.webp",
    enabledField: "jednokridla",
    countField: "celkemK",
    arrayField: "rozmeryKBran",
    photosKey: "jednokridla",
  },
  {
    id: "samonosna",
    label: "Samonosná posuvná brána",
    image: "/modely/brany/samonosna.webp",
    enabledField: "samonosna",
    countField: "celkemS",
    arrayField: "rozmerySBran",
    photosKey: "samonosna",
  },
  {
    id: "posuvna",
    label: "Brána posuvná po kolejnici",
    image: "/modely/brany/posuvna.webp",
    enabledField: "posuvna",
    countField: "celkemP",
    arrayField: "rozmeryPBran",
    photosKey: "poKolejnici",
  },
  {
    id: "telSam",
    label: "Brána teleskopická samonosná",
    image: "/modely/brany/telSam.webp",
    enabledField: "telSam",
    countField: "celkemTS",
    arrayField: "rozmeryTSBran",
    photosKey: "telSam",
  },
  {
    id: "telPoj",
    label: "Brána teleskopická pojízdná",
    image: "/modely/brany/telPoj.webp",
    enabledField: "telPoj",
    countField: "celkemTP",
    arrayField: "rozmeryTPBran",
    photosKey: "telPoj",
  },
  {
    id: "atypicka",
    label: "Brána atypická",
    image: "/modely/brany/atypicka.webp",
    enabledField: "atypicka",
    countField: "celkemA",
    arrayField: "rozmeryABran",
    photosKey: "atypicka",
  },
  {
    id: "skladaci",
    label: "Brána skládací",
    image: "/modely/brany/skladaci.webp",
    enabledField: "skladaci",
    countField: "celkemSkl",
    arrayField: "rozmerySklBran",
    photosKey: "skladaci",
  },
  {
    id: "sekcni",
    label: "Brána sekční",
    image: "/modely/brany/sekcni.webp",
    enabledField: "sekcni",
    countField: "celkemSek",
    arrayField: "rozmerySekBran",
    photosKey: "sekcni",
  },
]

/**
 * Kování branky — vzájemně se vylučující volby, v konfigurátoru se proto vykreslují
 * jako radio, ne jako checkboxy. Hodnota se ukládá do `rozmeryBranek[i].kovani`.
 * `madlo` je držadlo v dané délce v mm.
 */
export const brankaKovaniOptions = [
  { value: "kliky-mt", label: "Kliky M&T" },
  { value: "madlo-300", label: "Madlo 300 mm" },
  { value: "madlo-225", label: "Madlo 225 mm" },
  { value: "madlo-1250", label: "Madlo 1250 mm" },
] as const

/** Model plotového dílce v kroku „Dílce". */
export const dilceImage = "/modely/dilce/hlinikove.webp"

/**
 * Motivy výplně — sdílí je plotové dílce i hliníkové zábradlí. `imgSrc: null`
 * znamená, že k motivu zatím nemáme model (mřížka pak vykreslí placeholder).
 */
export const motivy: { src: string; motiv: string; imgSrc: string | null }[] = [
  { src: "o-standart", motiv: "Okenice standard", imgSrc: "standart" },
  { src: "kapka", motiv: "Okenice kapka", imgSrc: "kapka" },
  { src: "kapka-mini", motiv: "Okenice kapka mini", imgSrc: "kapka-mini" },
  { src: "planka-60", motiv: "Plaňka 60", imgSrc: "p60" },
  { src: "plaka-90", motiv: "Plaňka 90", imgSrc: "p90" },
  { src: "planka-120", motiv: "Plaňka 120", imgSrc: "p120" },
  { src: "planka-150", motiv: "Plaňka 150", imgSrc: "p150" },
  { src: "tycka", motiv: "Tyčka", imgSrc: "tycka" },
  { src: "tahokov", motiv: "Tahokov", imgSrc: "tahokov" },
  // Šikmá (žaluziová) lamela z profilu RP-51038, krycí výška 105,5 mm.
  { src: "lamela-105", motiv: "Lamela Z", imgSrc: "lamela-105" },
  { src: "vypaleni", motiv: "Vypálení plochy", imgSrc: "vypaleni" },
]

/** Cesta k modelu motivu, nebo `null` u motivů bez fotky. */
export const motivImage = (m: (typeof motivy)[number]) => (m.imgSrc ? `/modely/motivy/${m.imgSrc}.webp` : null)

export const barvyOplocení = [
  { code: "#b5beb9", color: "Šedá" },
  { code: "#654321", color: "Hnědá" },
  { code: "#383E42", color: "Antracit" },
  { code: "#8B4512", color: "Dřevěný dekor" },
  { code: "#000000", color: "Černá" },
]

/**
 * Výplň zábradlí. Sklo má vlastní tři odstíny, hliník přebírá stejnou nabídku
 * motivů jako plotové dílce (`motivy`), takže se pro něj žádný seznam nedubluje.
 * Model zábradlí zatím nemáme — karta i galerie proto jedou na fotkách oplocení.
 */
export const zabradliImage = "/modely/dilce/hlinikove.webp"

export const zabradliMaterialOptions = [
  // Model skla sdílíme se zasklením přístřešku v konfigurátoru pergol.
  { value: "sklo", label: "Sklo", image: "/modely/pergoly/sklo.webp" },
  { value: "hliník", label: "Hliník", image: zabradliImage },
] as const

export const zabradliSkloOptions = [
  { code: "#dbe9f0", color: "Čiré" },
  { code: "#ced8dc", color: "Matné" },
  { code: "#383E42", color: "Antracit" },
]

export const konfSteps = ["Brána", "Branka", "Dílce", "Motiv", "Barva", "Kontakt"] as const
