"use client"

import { useFormContext } from "react-hook-form"
import type { ConfiguratorType } from "@/lib/schemas"
import type { ConfPhotosWithMotiv, ConfProductInfo } from "@/types"
import { dilceImage } from "@/lib/konf-content"
import { DeclineCard } from "./form-controls"
import { ProductSection } from "./product-section"
import { stepDilceContent, type Lang } from "@/lib/translations"
import { StepTitle } from "./step-title"

/** 4. krok: plotové dílce a jejich rozměry. Motiv výplně se vybírá v `StepMotiv`. */
export function StepDilce({
  photos,
  info = {},
  onNext,
  lang = "cs",
}: {
  photos: ConfPhotosWithMotiv
  info?: ConfProductInfo
  onNext?: () => void
  lang?: Lang
}) {
  const { watch, setValue } = useFormContext<ConfiguratorType>()
  const dilce = watch("dilce")
  const t = stepDilceContent[lang] ?? stepDilceContent.cs

  return (
    <div className="flex flex-col gap-8">
      <div>
        <StepTitle pre={t.titlePre} accent={t.titleAccent} post={t.titlePost} />
        <p className="mt-1 text-muted-foreground">{t.desc}</p>
      </div>

      <DeclineCard
        label={t.decline}
        active={dilce === false}
        onClick={() => {
          setValue("dilce", false)
          setValue("celkemDilcu", 0)
          setValue("rozmeryDilcu", undefined)
        }}
      />

      <ProductSection
        title={t.productTitle}
        image={dilceImage}
        imageAlt={t.productTitle}
        galleryPhotos={photos.ploty}
        info={info.ploty}
        enabledField="dilce"
        countField="celkemDilcu"
        arrayField="rozmeryDilcu"
        dimensionLabels={t.dimensionLabels}
        onNext={onNext}
        lang={lang}
      />
    </div>
  )
}
