import { z } from "zod";

const phoneRegex = /^(\+420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/;
const pscRegex = /^[0-9]{3} ?[0-9]{2}$/;

export const confSchema = z.object({
    brana: z.boolean().optional(),
    dvoukridla: z.boolean().optional(),
    rozmery2KBran: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
        pohon: z.boolean().optional(),
        tahoma: z.boolean().optional(),
        ovladac: z.boolean().optional()
    }).array().optional(),
    celkem2K: z.number().optional(),
    jednokridla: z.boolean().optional(),
    rozmeryKBran: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
        pohon: z.boolean().optional(),
        tahoma: z.boolean().optional(),
        ovladac: z.boolean().optional()
    }).array().optional(),
    celkemK: z.number().optional(),
    samonosna: z.boolean().optional(),
    rozmerySBran: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
        pohon: z.boolean().optional(),
        tahoma: z.boolean().optional(),
        ovladac: z.boolean().optional()
    }).array().optional(),
    celkemS: z.number().optional(),
    posuvna: z.boolean().optional(),
    rozmeryPBran: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
        pohon: z.boolean().optional(),
        tahoma: z.boolean().optional(),
        ovladac: z.boolean().optional()
    }).array().optional(),
    celkemP: z.number().optional(),
    telSam: z.boolean().optional(),
    rozmeryTSBran: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
        pohon: z.boolean().optional(),
        tahoma: z.boolean().optional(),
        ovladac: z.boolean().optional()
    }).array().optional(),
    celkemTS: z.number().optional(),
    telPoj: z.boolean().optional(),
    rozmeryTPBran: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
        pohon: z.boolean().optional(),
        tahoma: z.boolean().optional(),
        ovladac: z.boolean().optional()
    }).array().optional(),
    celkemTP: z.number().optional(),
    atypicka: z.boolean().optional(),
    rozmeryABran: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
        pohon: z.boolean().optional(),
        tahoma: z.boolean().optional(),
        ovladac: z.boolean().optional()
    }).array().optional(),
    celkemA: z.number().optional(),
    sikma: z.boolean().optional(),
    rozmerySikBran: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
        pohon: z.boolean().optional(),
        tahoma: z.boolean().optional(),
        ovladac: z.boolean().optional()
    }).array().optional(),
    celkemSik: z.number().optional(),
    skladaci: z.boolean().optional(),
    rozmerySklBran: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
        pohon: z.boolean().optional(),
        tahoma: z.boolean().optional(),
        ovladac: z.boolean().optional()
    }).array().optional(),
    celkemSkl: z.number().optional(),
    sekcni: z.boolean().optional(),
    rozmerySekBran: z.object({
        delka: z.number().optional(),
        vyska: z.number().optional(),
        pocet: z.number().optional(),
        pohon: z.boolean().optional(),
        tahoma: z.boolean().optional(),
        ovladac: z.boolean().optional()
    }).array().optional(),
    celkemSek: z.number().optional(),
    branka: z.boolean().optional(),
    rozmeryBranek: z.object({
        delka: z.coerce.number().optional(),
        vyska: z.coerce.number().optional(),
        pocet: z.coerce.number().optional(),
        zamek: z.boolean().optional(),
        schranka: z.boolean().optional(),
        zvonek: z.boolean().optional(),
    }).array().optional(),
    celkemBranek: z.number().optional(),
    sloupky: z.boolean().optional(),
    typSloupku: z.string(),
    barvaTvarnice: z.string().optional(),
    povrchTvarnice: z.string().optional(),
    tvarnice: z.string().optional(),
    dilce: z.boolean().optional(),
    celkemDilcu: z.number().optional(),
    rozmeryDilcu: z.object({
        delka: z.coerce.number().optional(),
        vyska: z.coerce.number().optional(),
        pocet: z.coerce.number().optional(),
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

export type ConfiguratorType = z.infer<typeof confSchema>;
