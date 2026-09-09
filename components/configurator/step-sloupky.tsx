"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import type { ConfiguratorType } from "@/lib/schemas"
import { rozmerSloupkuOptions, sloupkyOptions, uchyceniSloupkuOptions } from "@/lib/konf-content"
import { ImageRadioGrid, InlineCheckbox, InlineRadio, RadioCardGroup } from "./form-controls"
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
 * 3. krok: sloupky. Zákaznický konfigurátor na webu je nenabízí — řeší se až při
 * zaměření na místě, tedy přesně v téhle aplikaci. `data.json` z webu tak pole
 * sloupků neobsahuje a obchodník je doplní ručně.
 */
export function StepSloupky({ lang = "cs" }: { lang?: Lang }) {
  const { control, register, watch, setValue } = useFormContext<ConfiguratorType>()
  const typSloupku = watch("typSloupku")
  const uchyceni = watch("uchyceniSloupku")
  const svepomoci = watch("uchyceniSvepomoci")
  const rozmery = watch("rozmerySloupku")
  const t = stepSloupkyContent[lang] ?? stepSloupkyContent.cs
  const sloupkyT = sloupkyLabels[lang] ?? sloupkyLabels.cs
  const uchyceniT = uchyceniSloupkuLabels[lang] ?? uchyceniSloupkuLabels.cs
  const provedeniT = provedeniLabels[lang] ?? provedeniLabels.cs
  const st = productSelectContent[lang] ?? productSelectContent.cs

  const { fields, append, remove } = useFieldArray({ control, name: "rozmerySloupku" })

  const sloupkyOpts = sloupkyOptions.map((o) => ({ ...o, label: sloupkyT[o.value] ?? o.label }))

  const uchyceniOpts = uchyceniSloupkuOptions.map((o) => ({
    value: o.value,
    label: uchyceniT[o.value]?.label ?? o.label,
    desc: uchyceniT[o.value]?.desc,
  }))
  const activeUchyceni = uchyceniSloupkuOptions.find((o) => o.value === uchyceni)
  const provedeni = uchyceni ? provedeniT[uchyceni] : undefined

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
            setValue("uchyceniSloupku", undefined)
            setValue("uchyceniSvepomoci", undefined)
            setValue("rozmerySloupku", undefined)
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

          <RadioCardGroup
            value={uchyceni ?? ""}
            onChange={(v) => {
              setValue("uchyceniSloupku", v)
              // Podvolby patří k vybranému způsobu — při přepnutí se zahodí, aby
              // v poptávce nezůstalo „svépomocí“ u patky, která se nebetonuje.
              const next = uchyceniSloupkuOptions.find((o) => o.value === v)
              if (!next?.svepomoci) setValue("uchyceniSvepomoci", undefined)
              if (!next?.rozmer) setValue("rozmerySloupku", undefined)
              // První sada rozměrů se nabídne rovnou — jinak by uživatel viděl
              // prázdnou kartu a musel začínat odkazem „Přidat další rozměr“.
              else if (!rozmery?.length) setValue("rozmerySloupku", [emptyRozmer])
            }}
            options={uchyceniOpts}
          />

          {activeUchyceni?.svepomoci && provedeni ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <Label className="font-heading text-lg font-bold">{t.provedeniLabel}</Label>
              <RadioGroup
                value={svepomoci === undefined ? "" : String(svepomoci)}
                onValueChange={(v) => setValue("uchyceniSvepomoci", v === "true")}
                className="mt-2 flex flex-wrap gap-4"
              >
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <RadioGroupItem value="false" />
                  {provedeni.vcetne}
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <RadioGroupItem value="true" />
                  {provedeni.svepomoci}
                </label>
              </RadioGroup>
            </div>
          ) : null}

          {/* Rozměrových sad může být víc — na jedné zakázce se běžně potkají různé
              délky (rohy, sloupky brány, běžné pole). Opakuje se stejný vzor jako
              u bran a branek v `ProductSection`, jen bez produktové karty. */}
          {activeUchyceni?.rozmer ? (
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
              <Label className="font-heading text-lg font-bold">{t.rozmerLabel}</Label>

              {fields.map((field, i) => (
                <div key={field.id} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
                  {fields.length > 1 ? (
                    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {st.sizeLabel} {i + 1}
                    </span>
                  ) : null}

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {t.profilLabel}
                    </span>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                      {rozmerSloupkuOptions.map((o) => (
                        <InlineRadio
                          key={o.value}
                          label={o.label}
                          value={o.value}
                          {...register(`rozmerySloupku.${i}.rozmer` as const)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="flex flex-col gap-1.5">
                      <Label>{t.delkaLabel}</Label>
                      <Input type="number" min={0} {...register(`rozmerySloupku.${i}.delka` as const, numberFieldOptions)} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>{t.pocetLabel}</Label>
                      <Input type="number" min={0} {...register(`rozmerySloupku.${i}.pocet` as const, numberFieldOptions)} />
                    </div>
                    {/* Počet čepiček se ptá až po zaškrtnutí — bez nich je pole bez významu. */}
                    {rozmery?.[i]?.cepicky ? (
                      <div className="flex flex-col gap-1.5">
                        <Label>{t.pocetCepicekLabel}</Label>
                        <Input type="number" min={0} {...register(`rozmerySloupku.${i}.pocetCepicek` as const, numberFieldOptions)} />
                      </div>
                    ) : null}
                  </div>

                  <InlineCheckbox label={t.cepickyLabel} {...register(`rozmerySloupku.${i}.cepicky` as const)} />
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
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
