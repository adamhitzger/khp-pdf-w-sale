"use client"

import { useFormContext } from "react-hook-form"
import type { ConfiguratorType } from "@/lib/schemas"
import { motivImage, motivy } from "@/lib/konf-content"
import { ImageRadioGrid } from "./form-controls"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formControlsContent, motivLabels, stepMotivContent, type Lang } from "@/lib/translations"
import { StepTitle } from "./step-title"

/** 5. krok: motiv výplně plotových dílců — jediná volba kroku, proto po kliknutí jdeme dál. */
export function StepMotiv({ onNext, lang = "cs" }: { onNext?: () => void; lang?: Lang }) {
  const { register, watch, setValue } = useFormContext<ConfiguratorType>()
  const motiv = watch("motiv")
  const t = stepMotivContent[lang] ?? stepMotivContent.cs
  const motivT = motivLabels[lang] ?? motivLabels.cs
  const fc = formControlsContent[lang] ?? formControlsContent.cs

  const motivOptions = [
    ...motivy.map((m) => ({ value: m.src, label: motivT[m.src] ?? m.motiv, image: motivImage(m), placeholder: fc.noPreview })),
    { value: "vlastní kombinace", label: motivT["vlastní kombinace"] ?? "Vlastní kombinace", image: null },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <StepTitle pre={t.titlePre} accent={t.titleAccent} post={t.titlePost} />
        <p className="mt-1 text-muted-foreground">{t.desc}</p>
      </div>

      <ImageRadioGrid
        value={motiv ?? ""}
        onChange={(v) => {
          setValue("motiv", v)
          onNext?.()
        }}
        options={motivOptions}
        lang={lang}
      />

      {/* Poznámka až po výběru motivu — u nevybraného není k čemu ji psát. Schválně
          se **nemaže** při přepnutí motivu: obchodník si při ladění varianty proklikne
          víc dlaždic a přepsaný text by se ztratil. */}
      {motiv ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="motivPoznamka">{t.poznamkaLabel}</Label>
          <Textarea
            id="motivPoznamka"
            rows={3}
            maxLength={2000}
            placeholder={t.poznamkaPlaceholder}
            {...register("motivPoznamka")}
          />
          <p className="text-sm text-muted-foreground">{t.poznamkaHint}</p>
        </div>
      ) : null}
    </div>
  )
}
