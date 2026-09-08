"use client"

import { useFormContext } from "react-hook-form"
import type { ConfiguratorType } from "@/lib/schemas"
import {
  barvyTvarniceStandard,
  barvyTvarniceStipany,
  povrchTvarniceOptions,
  rozmerSloupkuOptions,
  sloupkyOptions,
  uchyceniSloupkuOptions,
} from "@/lib/konf-content"
import { ColorSwatchGroup, ImageRadioGrid, RadioCardGroup } from "./form-controls"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  sloupkyLabels,
  povrchLabels,
  colorLabels,
  provedeniLabels,
  stepSloupkyContent,
  uchyceniSloupkuLabels,
  type Lang,
} from "@/lib/translations"
import { StepTitle } from "./step-title"

/**
 * 3. krok: sloupky. Zákaznický konfigurátor na webu je nenabízí — řeší se až při
 * zaměření na místě, tedy přesně v téhle aplikaci. `data.json` z webu tak pole
 * sloupků neobsahuje a obchodník je doplní ručně.
 */
export function StepSloupky({ lang = "cs" }: { lang?: Lang }) {
  const { watch, setValue } = useFormContext<ConfiguratorType>()
  const typSloupku = watch("typSloupku")
  const povrch = watch("povrchTvarnice")
  const barva = watch("barvaTvarnice")
  const uchyceni = watch("uchyceniSloupku")
  const svepomoci = watch("uchyceniSvepomoci")
  const rozmer = watch("rozmerSloupku")
  const t = stepSloupkyContent[lang] ?? stepSloupkyContent.cs
  const sloupkyT = sloupkyLabels[lang] ?? sloupkyLabels.cs
  const povrchT = povrchLabels[lang] ?? povrchLabels.cs
  const colorT = colorLabels[lang] ?? colorLabels.cs
  const uchyceniT = uchyceniSloupkuLabels[lang] ?? uchyceniSloupkuLabels.cs
  const provedeniT = provedeniLabels[lang] ?? provedeniLabels.cs

  const barvy = povrch === "stipany" ? barvyTvarniceStipany : barvyTvarniceStandard
  const sloupkyOpts = sloupkyOptions.map((o) => ({ ...o, label: sloupkyT[o.value] ?? o.label }))
  const povrchOpts = povrchTvarniceOptions.map((o) => ({ ...o, label: povrchT[o.value] ?? o.label }))
  const barvyTranslated = barvy.map((c) => ({ code: c.code, value: c.color.toLowerCase(), color: colorT[c.color] ?? c.color }))

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
          // Podvolby patří k vybranému typu — při přepnutí se zahodí, aby v nabídce
          // nezůstala barva tvárnice u hliníku nebo uchycení u betonu.
          if (v !== "betonové") {
            setValue("povrchTvarnice", undefined)
            setValue("barvaTvarnice", undefined)
          }
          if (v !== "hliníkové") {
            setValue("uchyceniSloupku", undefined)
            setValue("uchyceniSvepomoci", undefined)
            setValue("rozmerSloupku", undefined)
          }
        }}
        options={sloupkyOpts}
        lang={lang}
      />

      {typSloupku === "betonové" ? (
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5">
          <div>
            <Label className="mb-2 font-heading text-lg font-bold">{t.povrchLabel}</Label>
            <RadioGroup
              value={povrch ?? ""}
              onValueChange={(v) => setValue("povrchTvarnice", v as string)}
              className="mt-2 flex flex-wrap gap-4"
            >
              {povrchOpts.map((o) => (
                <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <RadioGroupItem value={o.value} />
                  {o.label}
                </label>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="font-heading text-lg font-bold">{t.barvaLabel}</Label>
            <div className="mt-3">
              <ColorSwatchGroup value={barva ?? ""} onChange={(v) => setValue("barvaTvarnice", v)} colors={barvyTranslated} />
            </div>
          </div>
        </div>
      ) : null}

      {/* Spodní uchycení řešíme jen u hliníkových sloupků — betonová tvárnice se
          zdí a vlastní sloupky si zákazník kotví po svém. */}
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
              // v poptávce nezůstal rozměr u zděné části nebo „svépomocí“ u patky.
              const next = uchyceniSloupkuOptions.find((o) => o.value === v)
              if (!next?.svepomoci) setValue("uchyceniSvepomoci", undefined)
              if (!next?.rozmer) setValue("rozmerSloupku", undefined)
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

          {activeUchyceni?.rozmer ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <Label className="font-heading text-lg font-bold">{t.rozmerLabel}</Label>
              <RadioGroup
                value={rozmer ?? ""}
                onValueChange={(v) => setValue("rozmerSloupku", v as string)}
                className="mt-2 flex flex-wrap gap-4"
              >
                {rozmerSloupkuOptions.map((o) => (
                  <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                    <RadioGroupItem value={o.value} />
                    {o.label}
                  </label>
                ))}
              </RadioGroup>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
