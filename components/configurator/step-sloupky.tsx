"use client"

import { useFieldArray, useFormContext, type FieldArrayPath, type Path } from "react-hook-form"
import type { ConfiguratorType } from "@/lib/schemas"
import { rozmerSloupkuOptions, sloupkyOptions, uchyceniSloupkuOptions } from "@/lib/konf-content"
import { CheckboxCard, ImageRadioGrid, InlineCheckbox, InlineRadio } from "./form-controls"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  sloupkyLabels,
  productSelectContent,
  provedeniLabels,
  stepSloupkyContent,
  uchyceniSloupkuLabels,
  type Lang,
} from "@/lib/translations"
import { StepTitle } from "./step-title"

/** Prázdné číselné pole přijde z `<input type="number">` jako "" — do schématu patří `undefined`. */
const numberFieldOptions = { setValueAs: (v: unknown) => (v === "" ? undefined : Number(v)) }

/** Nová sada rozměrů začíná prázdná, jen s čepičkami zaškrtnutými — chtějí je skoro všichni. */
const emptyRozmer = { rozmer: undefined, delka: undefined, pocet: undefined, cepicky: true, pocetCepicek: undefined }

/**
 * Rozměrové sady jednoho způsobu uchycení. Sad může být víc — na jedné zakázce se
 * běžně potkají různé délky (rohy, sloupky brány, běžné pole). Opakuje se stejný
 * vzor jako u bran a branek v `ProductSection`, jen bez produktové karty.
 */
function RozmerySloupku({ field, lang }: { field: "betonovaniSloupku" | "sloupkyNaPatku"; lang: Lang }) {
  const { control, register, watch } = useFormContext<ConfiguratorType>()
  const t = stepSloupkyContent[lang] ?? stepSloupkyContent.cs
  const st = productSelectContent[lang] ?? productSelectContent.cs
  const name = `${field}.rozmery` as FieldArrayPath<ConfiguratorType>
  const { fields, append, remove } = useFieldArray({ control, name })
  const rozmery = watch(`${field}.rozmery` as Path<ConfiguratorType>) as { cepicky?: boolean }[] | undefined

  return (
    <div className="flex flex-col gap-4">
      <Label className="font-heading text-lg font-bold">{t.rozmerLabel}</Label>

      {fields.map((row, i) => (
        <div key={row.id} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
          {fields.length > 1 ? (
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {st.sizeLabel} {i + 1}
            </span>
          ) : null}

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{t.profilLabel}</span>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {rozmerSloupkuOptions.map((o) => (
                <InlineRadio
                  key={o.value}
                  label={o.label}
                  value={o.value}
                  {...register(`${field}.rozmery.${i}.rozmer` as Path<ConfiguratorType>)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>{t.delkaLabel}</Label>
              <Input type="number" min={0} {...register(`${field}.rozmery.${i}.delka` as Path<ConfiguratorType>, numberFieldOptions)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t.pocetLabel}</Label>
              <Input type="number" min={0} {...register(`${field}.rozmery.${i}.pocet` as Path<ConfiguratorType>, numberFieldOptions)} />
            </div>
            {/* Počet čepiček se ptá až po zaškrtnutí — bez nich je pole bez významu. */}
            {rozmery?.[i]?.cepicky ? (
              <div className="flex flex-col gap-1.5">
                <Label>{t.pocetCepicekLabel}</Label>
                <Input type="number" min={0} {...register(`${field}.rozmery.${i}.pocetCepicek` as Path<ConfiguratorType>, numberFieldOptions)} />
              </div>
            ) : null}
          </div>

          <InlineCheckbox label={t.cepickyLabel} {...register(`${field}.rozmery.${i}.cepicky` as Path<ConfiguratorType>)} />
        </div>
      ))}

      {/* Stejné odkazy i dotykové cíle jako pod rozměry bran a branek. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <button
          type="button"
          onClick={() => append(emptyRozmer)}
          className="-my-2 min-h-11 py-2 text-xs font-semibold text-brand hover:underline sm:my-0 sm:min-h-0 sm:py-0"
        >
          + {st.addSize}
        </button>
        {fields.length > 1 ? (
          <button
            type="button"
            onClick={() => remove(fields.length - 1)}
            className="-my-2 min-h-11 py-2 text-xs font-medium text-muted-foreground hover:text-foreground sm:my-0 sm:min-h-0 sm:py-0"
          >
            {st.removeLast}
          </button>
        ) : null}
      </div>
    </div>
  )
}

/**
 * 3. krok: sloupky. Zákaznický konfigurátor na webu je nenabízí — řeší se až při
 * zaměření na místě, tedy přesně v téhle aplikaci. `data.json` z webu tak pole
 * sloupků neobsahuje a obchodník je doplní ručně.
 */
export function StepSloupky({ lang = "cs" }: { lang?: Lang }) {
  const { watch, setValue } = useFormContext<ConfiguratorType>()
  const typSloupku = watch("typSloupku")
  const betonovani = watch("betonovaniSloupku")
  const patka = watch("sloupkyNaPatku")
  const t = stepSloupkyContent[lang] ?? stepSloupkyContent.cs
  const sloupkyT = sloupkyLabels[lang] ?? sloupkyLabels.cs
  const uchyceniT = uchyceniSloupkuLabels[lang] ?? uchyceniSloupkuLabels.cs
  const provedeniT = provedeniLabels[lang] ?? provedeniLabels.cs

  const sloupkyOpts = sloupkyOptions.map((o) => ({ ...o, label: sloupkyT[o.value] ?? o.label }))
  const bloky = { betonovaniSloupku: betonovani, sloupkyNaPatku: patka }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <StepTitle pre={t.titlePre} accent={t.titleAccent} post={t.titlePost} />
        <p className="mt-1 text-muted-foreground">{t.desc}</p>
      </div>

      <ImageRadioGrid
        value={typSloupku ?? ""}
        onChange={(v) => {
          setValue("typSloupku", v)
          // Podvolby patří k hliníkovým sloupkům — u vlastních se zahodí, aby
          // v nabídce nezůstalo uchycení a rozměry sloupků, které nedodáváme.
          if (v !== "hliníkové") {
            setValue("betonovaniSloupku", undefined)
            setValue("sloupkyNaPatku", undefined)
          }
        }}
        options={sloupkyOpts}
        lang={lang}
      />

      {/* Spodní uchycení řešíme jen u hliníkových sloupků — vlastní sloupky si
          zákazník kotví po svém. */}
      {typSloupku === "hliníkové" ? (
        <div className="flex flex-col gap-4">
          <div>
            <StepTitle pre={t.uchyceniTitlePre} accent={t.uchyceniTitleAccent} post={t.uchyceniTitlePost} className="text-xl sm:text-2xl" />
            <p className="mt-1 text-muted-foreground">{t.uchyceniDesc}</p>
          </div>

          {/* Checkboxy, ne radio: betonování i patka se na jedné zakázce běžně
              potkají a každý si nese vlastní rozměry. */}
          <div className="grid gap-3 sm:grid-cols-2">
            {uchyceniSloupkuOptions.map((o) => (
              <CheckboxCard
                key={o.value}
                label={uchyceniT[o.value]?.label ?? o.label}
                desc={uchyceniT[o.value]?.desc}
                checked={bloky[o.field]?.aktivni === true}
                onChange={(e) =>
                  setValue(
                    o.field,
                    // Odškrtnutí zahodí celý blok i s rozměry — jinak by se do nabídky
                    // propsaly sloupky uchycení, které obchodník zrušil.
                    e.target.checked ? { aktivni: true, rozmery: [emptyRozmer] } : undefined,
                  )
                }
              />
            ))}
          </div>

          {uchyceniSloupkuOptions.map((o) =>
            bloky[o.field]?.aktivni ? (
              <div key={o.value} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
                <span className="font-heading text-lg font-bold">{uchyceniT[o.value]?.label ?? o.label}</span>

                {o.svepomoci && provedeniT[o.value] ? (
                  <div>
                    <Label className="font-heading text-base font-bold">{t.provedeniLabel}</Label>
                    <RadioGroup
                      value={betonovani?.svepomoci === undefined ? "" : String(betonovani.svepomoci)}
                      onValueChange={(v) => setValue("betonovaniSloupku.svepomoci", v === "true")}
                      className="mt-2 flex flex-wrap gap-4"
                    >
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                        <RadioGroupItem value="false" />
                        {provedeniT[o.value].vcetne}
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                        <RadioGroupItem value="true" />
                        {provedeniT[o.value].svepomoci}
                      </label>
                    </RadioGroup>
                  </div>
                ) : null}

                <RozmerySloupku field={o.field} lang={lang} />
              </div>
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  )
}
