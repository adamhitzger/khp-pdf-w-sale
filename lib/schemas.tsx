import * as z from "zod"

const phoneRegex = new RegExp(/^(\+?420\s?)?(\d\s?){9}$/)
const pscRegex = new RegExp(/^\d{3}\s?\d{2}$/)
export const contactSchema = z.object({
    name: z.string().min(3, {message: "Jméno je moc krátké"}),
    email: z.string().email(),
    tel: z.string().min(1,{message: "Pole je povinné"}).regex(phoneRegex, {message: "Zadali jste číslo ve špatném formátu"}),
    company: z.string().optional(),
    // 2000 znaků, ne 100 — zpráva je hlavní obsah kontaktního formuláře a strop
    // musí sedět s `maxLength` na textarea v components/contact.tsx.
    msg: z.string().max(2000, {message: "Zpráva je moc dlouhá"}),
})

/**
 * Poptávka stavební přípravy a základů (app/konf/zaklady). Oproti `contactSchema`
 * je `msg` povinná a delší — je to hlavní obsah poptávky. Přílohy se nevalidují
 * zodem, ale v `sendZaklady` (počet, velikost, typ).
 */
/**
 * Rozsah prací, který si zákazník naklikne na /konf/zaklady. Id jsou stabilní
 * (chodí ve `FormData` i do e-mailu), lokalizované popisky žijí v
 * `zakladyContent.sluzby` v lib/translations.ts — obojí musí zůstat v páru.
 */
export const ZAKLADY_SLUZBY = ["zamereni", "zaklady", "zdeni", "montaz"] as const
export type ZakladySluzba = (typeof ZAKLADY_SLUZBY)[number]

export const zakladySchema = z.object({
    name: z.string().min(3, {message: "Jméno je moc krátké"}),
    email: z.string().email(),
    tel: z.string().min(1,{message: "Pole je povinné"}).regex(phoneRegex, {message: "Zadali jste číslo ve špatném formátu"}),
    misto: z.string().min(2, {message: "Uveďte místo realizace"}),
    // Aspoň jedna služba — bez ní poptávka neříká, co po nás zákazník vlastně chce.
    sluzby: z.array(z.enum(ZAKLADY_SLUZBY)).min(1, {message: "Vyberte alespoň jednu položku"}),
    msg: z.string().min(10, {message: "Popište prosím stručně situaci"}).max(2000, {message: "Popis je moc dlouhý"}),
})

export type ZakladyType = z.infer<typeof zakladySchema>

export const productSchema = z.object({
    name: z.string().min(3, {message: "Jméno je moc krátké"}),
    email: z.string().email(),
    tel: z.string().min(1,{message: "Pole je povinné"}).regex(phoneRegex, {message: "Zadali jste číslo ve špatném formátu"}),
    company: z.string().optional(),
    pocet: z.number().min(1, {message: "Zadejte počet"}),
    delka: z.number().min(1, {message: "Zadejte délku"}),
    barva: z.string().min(1, {message: "Zadejte barvu"}),
    address: z.string().min(1,{message: "Adresa je povinná"}),
    obec: z.string().min(1, {message:"Obec je povinná"}),
    msg: z.string().max(100, {message: "Zpráva je moc dlouhá"}),
    zip: z.string().regex(pscRegex, {
        message: "Zadali jste PSČ v nesprávném formátu"
    }).min(5,{message: "PSČ je povinné"}),
    produkt: z.string()
})

const numberFromInput = z.preprocess(
  val => {
    if (typeof val === "string" && val.trim() !== "") {
      const n = Number(val);
      if (!isNaN(n)) return n;
    }
    if (typeof val === "number") return val;
    return undefined; // default() se použije potom
  },
  z.number().default(0)
);


/**
 * Nepovinné číslo z `<input type="number">` registrovaného s `valueAsNumber` —
 * prázdné pole přijde jako `NaN`, což by `z.number().optional()` samo neustálo.
 */
const optionalNumberFromInput = z.preprocess(
  val => {
    if (typeof val === "number") return Number.isNaN(val) ? undefined : val;
    if (typeof val === "string" && val.trim() !== "") {
      const n = Number(val);
      if (!isNaN(n)) return n;
    }
    return undefined;
  },
  z.number().optional()
);

// rozměry objektu, který je optional, ale fieldy uvnitř jsou povinné
const rozmeryObjekt = z.object({
  sirka: numberFromInput,
  delka: numberFromInput,
  hloubka: numberFromInput,
}).optional(); // celý objekt může chybět

export const pergolaSchema = z.object({
  pergola: z.string().optional(),
  material: z.string().optional(),
  stojici: z.boolean().optional(),
  rozmeryStojiciP: rozmeryObjekt,
  keStene: z.boolean().optional(),
  rozmeryPkStene: rozmeryObjekt,
  kRohu: z.boolean().optional(),
  rozmeryPkRohu: rozmeryObjekt,
  stineni: z.string().optional(),
  ledSvetla: z.boolean().optional(),
  ledPocet: optionalNumberFromInput,
  barva: z.string(),
  a: z.boolean().optional(),
  b: z.boolean().optional(),
  c: z.boolean().optional(),
  d: z.boolean().optional(),
  fullname: z.string()
      .min(6, { message: "Krátké jméno" })
      .max(40, { message: "Jméno je moc dlouhé" }),
  email: z.string().email({ message: "Nesprávný formát e-mailu" }),
  company: z.string().optional(),
  phoneNumber: z.string().regex(phoneRegex, {
      message: "Nesprávný formát tel. čísla",
  }),
  address: z.string().min(1, { message: "Adresa je povinná" }),
  obec: z.string().min(1, { message: "Obec je povinná" }),
  zip: z.string().regex(pscRegex, {
        message: "Zadali jste PSČ v nesprávném formátu"
    }).min(5,{message: "PSČ je povinné"}),
  message: z.string().optional(),
  file: z.any().optional(),
});

// Rozměry jednoho kusu brány/branky/dílce v rámci konfigurátoru oplocení.
/**
 * Radio skupina, ze které uživatel nic nevybral, přijde z react-hook-form jako
 * `null`, ne `undefined` — a `z.string().optional()` ji odmítne jako `invalid_type`.
 * Chyba pak sedí na `rozmeryBranek.0.kovani`, což žádný `onInvalid` nehlídal, takže
 * tlačítko „Odeslat" jen tiše nic neudělalo.
 *
 * Schválně `nullish()` a ne `preprocess` — preprocess mění vstupní typ schématu na
 * `unknown` a rozbije typování `zodResolver`u v `useForm`.
 */
const optionalRadio = z.string().nullish();

const branaRozmery = z.object({
    delka: z.number().optional(),
    vyska: z.number().optional(),
    pocet: z.number().optional(),
    pohon: z.boolean().optional(),
    tahoma: z.boolean().optional(),
})

export const confSchema = z.object({
    brana: z.boolean().optional(),
    dvoukridla: z.boolean().optional(),
    rozmery2KBran: branaRozmery.array().optional(),
    celkem2K: z.number().optional(),
    jednokridla: z.boolean().optional(),
    rozmeryKBran: branaRozmery.array().optional(),
    celkemK: z.number().optional(),
    samonosna: z.boolean().optional(),
    rozmerySBran: branaRozmery.array().optional(),
    celkemS: z.number().optional(),
    posuvna: z.boolean().optional(),
    rozmeryPBran: branaRozmery.array().optional(),
    celkemP: z.number().optional(),
    telSam: z.boolean().optional(),
    rozmeryTSBran: branaRozmery.array().optional(),
    celkemTS: z.number().optional(),
    telPoj: z.boolean().optional(),
    rozmeryTPBran: branaRozmery.array().optional(),
    celkemTP: z.number().optional(),
    atypicka: z.boolean().optional(),
    rozmeryABran: branaRozmery.array().optional(),
    celkemA: z.number().optional(),
    skladaci: z.boolean().optional(),
    rozmerySklBran: branaRozmery.array().optional(),
    celkemSkl: z.number().optional(),
    sekcni: z.boolean().optional(),
    rozmerySekBran: branaRozmery.array().optional(),
    celkemSek: z.number().optional(),
    branka: z.boolean().optional(),
    rozmeryBranek: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
        zamek: z.boolean().optional(),
        schranka: z.boolean().optional(),
        zvonek: z.boolean().optional(),
        // Kování branky — jedna volba z `brankaKovaniOptions` (kliky M&T nebo madlo
        // 300/225/1250 mm). Ukládá se jako string, aby šly volby přidávat bez migrace.
        // Nepovinné: `sendConf` si za nevyplněné dosadí `kovaniFallback`.
        kovani: optionalRadio,
    }).array().optional(),
    celkemBranek: z.number().optional(),
    // Sloupky se v konfigurátoru neřeší — nabízejí se až při zaměření na místě.
    dilce: z.boolean().optional(),
    celkemDilcu: z.number().optional(),
    rozmeryDilcu: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
    }).array().optional(),
    yesA: z.boolean().optional(),
    yesB: z.boolean().optional(),
    yesC: z.boolean().optional(),
    yesD: z.boolean().optional(),
    widthA: z.number().optional(),
    heightA: z.number().optional(),
    widthB: z.number().optional(),
    heightB: z.number().optional(),
    widthC: z.number().optional(),
    heightC: z.number().optional(),
    widthD: z.number().optional(),
    heightD: z.number().optional(),
    motiv: z.string(),
    barva: z.string(),
    // Zábradlí má vlastní konfigurátor (`zabradliSchema` níž, /konf/zabradli) —
    // v oplocení už se nekonfiguruje.
    fullname: z.string()
        .min(6, {message: "Krátké jméno"})
        .max(40, {message: "Jméno je moc dlouhé"}),
    email: z.string().email({message: "Nesprávný formát e-mailu"}),
    company: z.string().optional(),
    phoneNumber: z.string().regex(phoneRegex, {
        message: "Nesprávný formát tel. čísla",
    }),
    zip: z.string().regex(pscRegex, {
        message: "Zadali jste PSČ v nesprávném formátu"
    }).min(5,{message: "PSČ je povinné"}),
    address: z.string().min(1,{message: "Adresa je povinná"}),
    obec: z.string().min(1, {message:"Obec je povinná"}),
    message: z.string().optional(),
    file: z
        .any()
        .optional(),

});

/**
 * Konfigurátor zábradlí (/konf/zabradli) — samostatná poptávka, ne doplněk oplocení.
 * Pole se schválně jmenují stejně jako v `confSchema`, aby na kroky šly beze změny
 * použít `ProductSection` i `StepKontakt` (oba jsou typované na `ConfiguratorType`).
 *
 * Výplň je buď sklo (odstín v `zabradliSklo`), nebo hliník s motivem (`zabradliMotiv`) —
 * povinné je vždy jen to pole, které odpovídá zvolenému materiálu, proto `.check()`.
 */
export const zabradliSchema = z.object({
    zabradli: z.boolean().optional(),
    celkemZabradli: z.number().optional(),
    rozmeryZabradli: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
    }).array().optional(),
    zabradliMaterial: z.string().min(1, {message: "Vyberte výplň zábradlí"}),
    zabradliSklo: optionalRadio,
    zabradliMotiv: optionalRadio,
    fullname: z.string()
        .min(6, {message: "Krátké jméno"})
        .max(40, {message: "Jméno je moc dlouhé"}),
    email: z.string().email({message: "Nesprávný formát e-mailu"}),
    company: z.string().optional(),
    phoneNumber: z.string().regex(phoneRegex, {
        message: "Nesprávný formát tel. čísla",
    }),
    zip: z.string().regex(pscRegex, {
        message: "Zadali jste PSČ v nesprávném formátu"
    }).min(5,{message: "PSČ je povinné"}),
    address: z.string().min(1,{message: "Adresa je povinná"}),
    obec: z.string().min(1, {message:"Obec je povinná"}),
    message: z.string().optional(),
    file: z
        .any()
        .optional(),
}).check((ctx) => {
    const { zabradliMaterial, zabradliSklo, zabradliMotiv } = ctx.value
    if (zabradliMaterial === "sklo" && !zabradliSklo) {
        ctx.issues.push({
            code: "custom",
            message: "Vyberte odstín skla",
            path: ["zabradliSklo"],
            input: ctx.value,
        })
    }
    if (zabradliMaterial === "hliník" && !zabradliMotiv) {
        ctx.issues.push({
            code: "custom",
            message: "Vyberte motiv výplně",
            path: ["zabradliMotiv"],
            input: ctx.value,
        })
    }
})

export type ConfiguratorType = z.infer<typeof confSchema>
export type ZabradliConfType = z.infer<typeof zabradliSchema>
export type PergolaConfType = z.infer<typeof pergolaSchema>
// `rozmeryObjekt` uses z.preprocess, so its parsed (output) shape differs from what
// react-hook-form holds before validation runs — useForm needs the input shape too.
export type PergolaFormInput = z.input<typeof pergolaSchema>