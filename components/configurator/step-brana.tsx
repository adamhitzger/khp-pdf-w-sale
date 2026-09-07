"use client"

import { useFormContext } from "react-hook-form"
import type { ConfiguratorType } from "@/lib/schemas"
import type { ConfPhotosWithMotiv, ConfProductInfo } from "@/types"
import { gateProducts } from "@/lib/konf-content"
import { DeclineCard } from "./form-controls"
import { ProductSection } from "./product-section"
import { gateLabels, gateExtrasLabels, stepBranaContent, konfContent, type Lang } from "@/lib/translations"
import { StepTitle } from "./step-title"

export function StepBrana({ onNext, photos, info = {}, lang = "cs" }: { onNext: () => void; photos: ConfPhotosWithMotiv; info?: ConfProductInfo; lang?: Lang }) {
  const { watch, setValue } = useFormContext<ConfiguratorType>()
  const brana = watch("brana")
  const t = stepBranaContent[lang] ?? stepBranaContent.cs
  const labels = gateLabels[lang] ?? gateLabels.cs
  const extrasT = gateExtrasLabels[lang] ?? gateExtrasLabels.cs
  const dimensionLabels = (konfContent[lang] ?? konfContent.cs).dimensionLabels
  const gateExtras = [
    { name: "pohon", label: extrasT.pohon },
    { name: "tahoma", label: extrasT.tahoma },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <StepTitle pre={t.titlePre} accent={t.titleAccent} post={t.titlePost} />
        <p className="mt-1 text-muted-foreground">
          {t.desc}
        </p>
      </div>

      <DeclineCard
        label={t.decline}
        active={brana === true}
        onClick={() => {
          setValue("brana", true)
          onNext()
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4 ">
        {gateProducts.map((gate) => (
          <ProductSection
            key={gate.id}
            title={labels[gate.id] ?? gate.label}
            image={gate.image}
            imageAlt={labels[gate.id] ?? gate.label}
            galleryPhotos={photos[gate.photosKey]}
            info={info[gate.photosKey]}
            enabledField={gate.enabledField}
            countField={gate.countField}
            arrayField={gate.arrayField}
            extraToggles={gateExtras}
            dimensionLabels={dimensionLabels}
            onFirstEnable={() => setValue("brana", false)}
            onNext={onNext}
            lang={lang}
          />
        ))}
      </div>
    </div>
  )
}
