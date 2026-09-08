"use client"

import { useRef, useState, useTransition } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence } from "framer-motion"
import { Loader2, MoveRight, MoveLeft } from "lucide-react"
import toast from "react-hot-toast"
import { sendGenerateLead, sendUserDataToGTM, useKonfSteps } from "@/lib/gtm"
import { confSchema, type ConfiguratorType } from "@/lib/schemas"
import { gateProducts } from "@/lib/konf-content"
import { sendConfWithSale } from "@/app/actions"
import type { ConfPhotosWithMotiv, ConfProductInfo } from "@/types"
import { Button } from "@/components/ui/button"
import { KonfProgress } from "./konf-progress"
import { KonfSuccess } from "./konf-success"
import { KonfPending } from "./konf-pending"
import { GateIcon, WicketIcon, PostsIcon, PanelIcon, PanelMotifIcon, PaintIcon, ContactIcon } from "./konf-icons"
import { Slide } from "./slide"
import { StepBrana } from "./step-brana"
import { StepBranka } from "./step-branka"
import { StepSloupky } from "./step-sloupky"
import { StepDilce } from "./step-dilce"
import { StepMotiv } from "./step-motiv"
import { StepBarva } from "./step-barva"
import { StepKontakt } from "./step-kontakt"
import { konfContent, gateLabels, stepBrankaContent, stepDilceContent, type Lang } from "@/lib/translations"

const LAST_STEP = konfContent.cs.steps.length - 1

/** Názvy kroků do GTM — vždy česky, ať se události netříští podle `?lang=`. */
const GTM_FORM = "Oplocení" as const
const GTM_STEPS = konfContent.cs.steps

type SizeRow = { vyska?: number; delka?: number; pocet?: number }

/**
 * Vybraný produkt musí mít u *každé* sady rozměrů vyplněnou výšku, šířku i počet.
 * `count` je počet sad (zaškrtnutí = 1, „Přidat další rozměr" ho zvyšuje), takže
 * kontrolujeme přesně prvních `count` položek pole — delší pole může zůstat po
 * odebrání sady, kratší (nebo díra v něm) znamená nevyplněný formulář.
 */
const hasCompleteSizes = (count: number, rows: unknown): boolean => {
  if (!(count > 0)) return true
  const list = Array.isArray(rows) ? (rows as SizeRow[]) : []
  for (let i = 0; i < count; i++) {
    const row = list[i]
    if (!row) return false
    if (!(Number(row.vyska) > 0) || !(Number(row.delka) > 0) || !(Number(row.pocet) > 0)) return false
  }
  return true
}

// Pořadí musí odpovídat `konfContent.<lang>.steps` (Brána, Branka, Sloupky, Dílce, Motiv, Barva, Kontakt).
const stepIcons = [GateIcon, WicketIcon, PostsIcon, PanelIcon, PanelMotifIcon, PaintIcon, ContactIcon]

const emptyPhotos: ConfPhotosWithMotiv = {
  jednokridla: [],
  dvoukridla: [],
  samonosna: [],
  poKolejnici: [],
  telPoj: [],
  telSam: [],
  atypicka: [],
  sikma: [],
  skladaci: [],
  sekcni: [],
  branka: [],
  ploty: [],
  pristresek: [],
  bioklimaticka: [],
  zahrada: [],
  zabradli: [],
}

export function Configurator({
  photos = emptyPhotos,
  info = {},
  lang = "cs",
  defaultValues,
  heading,
  subheading,
  onReset,
}: {
  photos?: ConfPhotosWithMotiv
  info?: ConfProductInfo
  lang?: Lang
  /** Hodnoty z `data.json` nahraného obchodníkem — formulář se jimi předvyplní. */
  defaultValues?: Partial<ConfiguratorType>
  /** Přebití zákaznického nadpisu, když konfigurátor běží jako interní nástroj. */
  heading?: string
  subheading?: string
  /** „Načíst jiný soubor" — bez ní se tlačítko nezobrazí. */
  onReset?: () => void
}) {
  const t = konfContent[lang] ?? konfContent.cs
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [sent, setSent] = useState(false)
  /* Sleva schválně nežije ve formuláři: `confSchema` ji nezná a zodResolver by ji
     při odeslání zahodil. Drží ji krok Kontakt přes `onSaleChange`. */
  const [sale, setSale] = useState(0)
  const [isPending, startTransition] = useTransition()
  const topRef = useRef<HTMLDivElement>(null)

  const methods = useForm<ConfiguratorType>({
    resolver: zodResolver(confSchema),
    shouldUnregister: false,
    mode: "all",
    defaultValues: defaultValues as ConfiguratorType | undefined,
  })
  const { handleSubmit, reset, getValues } = methods

  const scrollToTop = () => {
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80)
  }

  /**
   * Než pustíme uživatele dál, ověříme, že u dané kapitoly padlo alespoň nějaké
   * rozhodnutí — a u vybraných produktů i to, že má vyplněné rozměry.
   */
  const checkStepRequirement = (currentStep: number): string | null => {
    const values = getValues()
    const missingSizes = (product: string) => t.validation.rozmery.replace("{product}", product)

    switch (currentStep) {
      case 0: {
        // `brana === true` = uživatel bránu odmítl kartou „Nechci bránu"; rozměry
        // případně rozvybrané dřív pak nemá smysl vymáhat.
        if (values.brana === true) return null
        const anyGate = gateProducts.some((g) => Number(values[g.countField as keyof ConfiguratorType] ?? 0) > 0)
        if (!anyGate) return t.validation.brana
        const labels = gateLabels[lang] ?? gateLabels.cs
        for (const g of gateProducts) {
          const count = Number(values[g.countField as keyof ConfiguratorType] ?? 0)
          if (!hasCompleteSizes(count, values[g.arrayField as keyof ConfiguratorType])) {
            return missingSizes(labels[g.id] ?? g.label)
          }
        }
        return null
      }
      case 1: {
        if (values.branka === undefined) return t.validation.branka
        if (!hasCompleteSizes(Number(values.celkemBranek ?? 0), values.rozmeryBranek)) {
          return missingSizes((stepBrankaContent[lang] ?? stepBrankaContent.cs).productTitle)
        }
        return null
      }
      case 2: {
        if (values.typSloupku) return null
        return t.validation.sloupky
      }
      case 3: {
        if (values.dilce === undefined) return t.validation.dilce
        if (!hasCompleteSizes(Number(values.celkemDilcu ?? 0), values.rozmeryDilcu)) {
          return missingSizes((stepDilceContent[lang] ?? stepDilceContent.cs).productTitle)
        }
        return null
      }
      case 4: {
        if (values.motiv) return null
        return t.validation.motiv
      }
      case 5: {
        if (values.barva) return null
        return t.validation.barva
      }
      default:
        return null
    }
  }

  /* Měření průchodu do GTM. Hook si drží nejvyšší odeslaný krok, takže návrat
     zpět a opětovný postup vpřed událost nepošle podruhé. */
  const { trackStep, resetSteps } = useKonfSteps(GTM_FORM, GTM_STEPS)

  const goNext = () => {
    const problem = checkStepRequirement(step)
    if (problem) {
      toast.error(problem)
      return
    }
    trackStep(step)
    setDirection(1)
    setStep((prev) => Math.min(LAST_STEP, prev + 1))
    scrollToTop()
  }

  const goBack = () => {
    setDirection(-1)
    setStep((prev) => Math.max(0, prev - 1))
    scrollToTop()
  }

  const onValid = (data: ConfiguratorType) => {
    startTransition(async () => {
      const res = await sendConfWithSale(data, sale, lang)
      if (!res.success) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      sendUserDataToGTM({
        email: data.email,
        phone: data.phoneNumber,
        fullName: data.fullname,
        city: data.obec,
        zip: data.zip,
        state: lang,
      })
      trackStep(LAST_STEP)
      sendGenerateLead("kalkulace", "oplocení")
      setSent(true)
      scrollToTop()
    })
  }

  /** Návrat z potvrzení na prázdný formulář — „Odeslat další poptávku". */
  const startOver = () => {
    reset(defaultValues as ConfiguratorType | undefined)
    setSale(0)
    /* „Odeslat další poptávku" = nový průchod, ne návrat — kroky se měří znovu. */
    resetSteps()
    setStep(0)
    setDirection(1)
    setSent(false)
    scrollToTop()
  }

  const onInvalid = (errors: Record<string, { message?: string } | undefined>) => {
    let shown = false
    const show = (msg: string) => {
      toast.error(msg)
      shown = true
    }
    if (errors.barva) show(t.validation.invalidBarva)
    if (errors.motiv) show(t.validation.invalidMotiv)
    if (errors.typSloupku) show(t.validation.invalidSloupky)
    if (errors.fullname || errors.email || errors.phoneNumber || errors.zip || errors.address || errors.obec) {
      show(t.validation.invalidContact)
    }
    // Pojistka proti „kliknu na Odeslat a nic se neděje": chyba, na kterou tu není
    // vlastní hláška (typicky uvnitř pole produktů, např. `rozmeryBranek.0.kovani`),
    // by jinak formulář tiše zamítla bez jediné zpětné vazby.
    if (!shown) {
      console.error("Konfigurátor: neošetřená chyba validace", errors)
      toast.error(t.validation.invalidOther)
    }
  }

  if (isPending) {
    return (
      <section id="konf" ref={topRef} className="mx-auto max-w-8xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <KonfPending lang={lang} />
      </section>
    )
  }

  if (sent) {
    return (
      <section id="konf" ref={topRef} className="mx-auto max-w-8xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <KonfSuccess lang={lang} onReset={startOver} />
      </section>
    )
  }

  return (
    <section id="konf" className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{heading ?? t.heading}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground text-pretty">{subheading ?? t.subheading}</p>
        {onReset ? (
          <Button type="button" variant="outline" size="sm" onClick={onReset}>
            Načíst jiný soubor
          </Button>
        ) : null}
      </div>

      {/* Bez `gap` a bez paddingu na wrapperu: bílá „záložka“ aktivního kroku v šedém
          pruhu tak navazuje přímo na bílou plochu formuláře. */}
      <div ref={topRef} className="scroll-mt-24 rounded-3xl border border-border bg-card sm:grid sm:grid-cols-[240px_1fr] lg:grid-cols-[300px_1fr]">
        <KonfProgress step={step} steps={t.steps} icons={stepIcons} lang={lang} />

        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              /* Nabídka odchází zákazníkovi e-mailem, takže odeslat smí jedině
                 výslovné kliknutí do tlačítka „Odeslat". Formulář je předvyplněný
                 z data.json, takže by implicitní odeslání (Enter v textovém poli,
                 klik, který po překreslení kroku trefí tlačítko pod kurzorem)
                 prošlo validací a poptávku rovnou poslalo. */
              const submitter = (e.nativeEvent as SubmitEvent).submitter
              if (!submitter || submitter.getAttribute("data-send") !== "true") {
                e.preventDefault()
                return
              }
              return handleSubmit(onValid, onInvalid)(e)
            }}
            className="flex min-w-0 flex-col gap-10 p-5 sm:p-8"
          >
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                {step === 0 && (
                  <Slide key="brana" direction={direction}>
                    <StepBrana onNext={goNext} photos={photos} info={info} lang={lang} />
                  </Slide>
                )}
                {step === 1 && (
                  <Slide key="branka" direction={direction}>
                    <StepBranka onNext={goNext} onBack={goBack} photos={photos} info={info} lang={lang} />
                  </Slide>
                )}
                {step === 2 && (
                  <Slide key="sloupky" direction={direction}>
                    <StepSloupky lang={lang} />
                  </Slide>
                )}
                {step === 3 && (
                  <Slide key="dilce" direction={direction}>
                    <StepDilce photos={photos} info={info} lang={lang} />
                  </Slide>
                )}
                {step === 4 && (
                  <Slide key="motiv" direction={direction}>
                    <StepMotiv lang={lang} />
                  </Slide>
                )}
                {step === 5 && (
                  <Slide key="barva" direction={direction}>
                    <StepBarva lang={lang} />
                  </Slide>
                )}
                {step === 6 && (
                  <Slide key="kontakt" direction={direction}>
                    <StepKontakt lang={lang} sale={sale} onSaleChange={setSale} />
                  </Slide>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-row-reverse items-center justify-between gap-4 border-t border-border pt-8">
              {/* Rozdílné `key` jsou tu nutnost, ne kosmetika. Bez nich React obě větve
                  ternárního operátoru sesadí do jednoho a téhož <button> uzlu a jen mu
                  přepíše atributy. Kliknutí na „Další krok" na předposledním kroku pak
                  stihne překreslit tlačítko na `type="submit"` dřív, než doběhne nativní
                  click — a ten už dopadne na odesílací tlačítko, takže se poptávka
                  odešle jedním kliknutím. S vlastními klíči se uzel vymění a klik
                  nemá kam dopadnout. */}
              {step < LAST_STEP ? (
                <Button key="next" type="button" onClick={goNext}>
                  {t.next}
                  <MoveRight />
                </Button>
              ) : (
                <Button key="send" type="submit" data-send="true" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : <>{t.sendText}<MoveRight /></>}
                </Button>
              )}
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={goBack}>
                  <MoveLeft />
                  {t.back}
                </Button>
              ) : (
                <span />
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  )
}
