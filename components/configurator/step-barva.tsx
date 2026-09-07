"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import type { ConfiguratorType } from "@/lib/schemas"
import { barvyOplocení } from "@/lib/konf-content"
import { ColorSwatchGroup } from "./form-controls"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { colorLabels, stepBarvaContent, type Lang } from "@/lib/translations"
import { StepTitle } from "./step-title"

export function StepBarva({
  onNext,
  lang = "cs",
}: {
  /** Kliknutí na hotový vzorník posune na další krok; vlastní RAL kód ne — ten se teprve dopisuje. */
  onNext?: () => void
  lang?: Lang
}) {
  const { watch, setValue } = useFormContext<ConfiguratorType>()
  const barva = watch("barva")
  const [ralCode, setRalCode] = useState("")
  const t = stepBarvaContent[lang] ?? stepBarvaContent.cs
  const colorT = colorLabels[lang] ?? colorLabels.cs
  const colors = barvyOplocení.map((c) => ({ code: c.code, value: c.color.toLowerCase(), color: colorT[c.color] ?? c.color }))

  const isCustom = barva !== undefined && barva !== "" && !barvyOplocení.some((c) => c.color.toLowerCase() === barva)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <StepTitle pre={t.titlePre} accent={t.titleAccent} post={t.titlePost} />
        <p className="mt-1 text-muted-foreground">{t.desc}</p>
      </div>

      <ColorSwatchGroup
        value={isCustom ? "" : (barva ?? "")}
        onChange={(v) => {
          setValue("barva", v)
          onNext?.()
        }}
        colors={colors}
      />

      <div className="flex max-w-xs flex-col gap-1.5">
        <Label htmlFor="ral">{t.ralLabel}</Label>
        <Input
          id="ral"
          placeholder={t.ralPlaceholder}
          value={ralCode}
          onChange={(e) => {
            setRalCode(e.target.value)
            setValue("barva", e.target.value)
          }}
        />
      </div>
    </div>
  )
}
