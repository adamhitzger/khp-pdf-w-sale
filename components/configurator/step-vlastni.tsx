"use client"

import { useFieldArray, useFormContext, type Path } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import type { ConfiguratorType } from "@/lib/schemas"
import {
  vlastniPolozkaCena,
  vlastniPolozkaJednotka,
  vlastniPolozkaJednotky,
  vlastniPolozkaRozmery,
  type VlastniPolozka,
  type VlastniPolozkaJednotka,
} from "@/lib/konf-content"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { quoteItemsContent, stepVlastniContent, localeTags, type Lang } from "@/lib/translations"
import { InlineRadio } from "./form-controls"
import { StepTitle } from "./step-title"

/** Prázdné číselné pole přijde z `<input type="number">` jako "" — do schématu patří `undefined`. */
const numberFieldOptions = { setValueAs: (v: unknown) => (v === "" ? undefined : Number(v)) }

/** Nová položka je prázdná — jen jednotka má default, protože bez ní by formulář nevěděl, co ukázat. */
const emptyPolozka: VlastniPolozka = {
  nazev: "",
  jednotka: "ks",
  vyska: undefined,
  sirka: undefined,
  delka: undefined,
  mnozstvi: undefined,
  cena: undefined,
}

/**
 * 5. krok: vlastní položky nabídky. Zákaznický konfigurátor na webu je nemá —
 * vznikají až na schůzce, takže `data.json` z webu je neobsahuje a krok se
 * otevře prázdný. Nabídka se bez nich obejde, proto se tu nic nevynucuje;
 * jen už rozepsaná položka musí být dopsaná (název, množství, cena a rozměry
 * pro zvolenou jednotku).
 */
export function StepVlastni({ lang = "cs" }: { lang?: Lang }) {
  const { control, register, watch, setValue } = useFormContext<ConfiguratorType>()
  const t = stepVlastniContent[lang] ?? stepVlastniContent.cs
  const qi = quoteItemsContent[lang] ?? quoteItemsContent.cs
  const locale = localeTags[lang] ?? localeTags.cs
  const { fields, append, remove } = useFieldArray({ control, name: "vlastniPolozky" })
  const polozky = (watch("vlastniPolozky") ?? []) as VlastniPolozka[]

  const num = (value: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(value)
  const money = (value: number) => `${num(value)} ${qi.currency}`

  /* Přepnutí jednotky vymaže rozměry, které k ní nepatří: délka a výška × šířka
     se nikdy nesmí sejít, a hodnota schovaná ve skrytém poli by jinak tiše
     doputovala do `data.json` a do popisu řádku v nabídce. */
  const prepniJednotku = (i: number, jednotka: VlastniPolozkaJednotka) => {
    if (jednotka !== "bm") setValue(`vlastniPolozky.${i}.delka` as Path<ConfiguratorType>, undefined)
    if (jednotka !== "m2") {
      setValue(`vlastniPolozky.${i}.vyska` as Path<ConfiguratorType>, undefined)
      setValue(`vlastniPolozky.${i}.sirka` as Path<ConfiguratorType>, undefined)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <StepTitle pre={t.titlePre} accent={t.titleAccent} post={t.titlePost} />
        <p className="mt-1 text-muted-foreground">{t.desc}</p>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-5 py-6 text-center text-sm text-muted-foreground">
          {t.empty}
        </p>
      ) : null}

      {fields.map((row, i) => {
        const polozka = polozky[i] ?? {}
        const jednotka = vlastniPolozkaJednotka(polozka)
        const rozmery = vlastniPolozkaRozmery(polozka)
        const cena = vlastniPolozkaCena(polozka)
        const rozmeryDopsane = rozmery.every((mm) => mm !== undefined)

        return (
          <div key={row.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {t.itemLabel} {i + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="-my-2 flex min-h-11 items-center gap-1.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground sm:my-0 sm:min-h-0 sm:py-0"
              >
                <Trash2 className="size-3.5" />
                {t.remove}
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t.nazevLabel}</Label>
              <Input
                type="text"
                placeholder={t.nazevPlaceholder}
                {...register(`vlastniPolozky.${i}.nazev` as Path<ConfiguratorType>)}
              />
            </div>

            {/* Jednotka rozhoduje, které rozměry se ukážou: za kus žádné, za bm
                délka, za m² výška × šířka. Nativní radio si výlučnost hlídá samo
                podle `name`, takže stačí `register(...)`. */}
            <div className="flex flex-col gap-1.5">
              <Label>{t.jednotkaLabel}</Label>
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {vlastniPolozkaJednotky.map((j) => (
                  <InlineRadio
                    key={j}
                    id={`vlastni-${row.id}-${j}`}
                    label={t.jednotky[j]}
                    value={j}
                    {...register(`vlastniPolozky.${i}.jednotka` as Path<ConfiguratorType>, {
                      onChange: (e) => prepniJednotku(i, e.target.value as VlastniPolozkaJednotka),
                    })}
                  />
                ))}
              </div>
            </div>

            {jednotka === "bm" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label>{t.delkaLabel}</Label>
                  <Input type="number" min={0} {...register(`vlastniPolozky.${i}.delka` as Path<ConfiguratorType>, numberFieldOptions)} />
                </div>
              </div>
            ) : null}

            {jednotka === "m2" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label>{t.vyskaLabel}</Label>
                  <Input type="number" min={0} {...register(`vlastniPolozky.${i}.vyska` as Path<ConfiguratorType>, numberFieldOptions)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>{t.sirkaLabel}</Label>
                  <Input type="number" min={0} {...register(`vlastniPolozky.${i}.sirka` as Path<ConfiguratorType>, numberFieldOptions)} />
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>{t.mnozstviLabel}</Label>
                <Input type="number" min={0} {...register(`vlastniPolozky.${i}.mnozstvi` as Path<ConfiguratorType>, numberFieldOptions)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t.cenaLabel[jednotka]}</Label>
                <Input type="number" min={0} step="0.01" {...register(`vlastniPolozky.${i}.cena` as Path<ConfiguratorType>, numberFieldOptions)} />
              </div>
            </div>

            {/* Živý přepočet: bez něj není z formuláře poznat, že se mm dělí tisícem
                a že cena tím pádem vyšla za bm nebo m², ne za milimetr. */}
            <div className="flex flex-col gap-1 rounded-xl bg-accent px-4 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-sm font-medium text-muted-foreground">{t.sumLabel}</span>
                <span className="font-heading text-lg font-bold">{money(cena)}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {rozmery.length > 0 && rozmeryDopsane
                  ? `${rozmery.map((mm) => num((mm as number) / 1000)).join(" × ")} m × ${num(Number(polozka.mnozstvi) || 0)} ${t.ks} × ${money(Number(polozka.cena) || 0)}`
                  : t.sumHint[jednotka]}
              </span>
            </div>
          </div>
        )
      })}

      <div>
        <button
          type="button"
          onClick={() => append(emptyPolozka)}
          className="flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        >
          <Plus className="size-4" />
          {t.add}
        </button>
      </div>
    </div>
  )
}
