"use client"

import { useFormContext } from "react-hook-form"
import type { ConfiguratorType } from "@/lib/schemas"
import type { ConfPhotosWithMotiv, ConfProductInfo } from "@/types"
import { DeclineCard } from "./form-controls"
import { ProductSection } from "./product-section"
import { brankaKovaniOptions } from "@/lib/konf-content"
import { brankaExtrasLabels, brankaKovaniLabels, stepBrankaContent, type Lang } from "@/lib/translations"
import { StepTitle } from "./step-title"

export function StepBranka({ onNext, onBack, photos, info = {}, lang = "cs" }: { onNext: () => void; onBack?: () => void; photos: ConfPhotosWithMotiv; info?: ConfProductInfo; lang?: Lang }) {
  const { watch, setValue } = useFormContext<ConfiguratorType>()
  const branka = watch("branka")
  const t = stepBrankaContent[lang] ?? stepBrankaContent.cs
  const extrasT = brankaExtrasLabels[lang] ?? brankaExtrasLabels.cs
  const brankaExtras = [
    { name: "zamek", label: extrasT.zamek },
    { name: "schranka", label: extrasT.schranka },
    { name: "zvonek", label: extrasT.zvonek },
  ]
  // Kování je „vyber jedno“ — kliky, nebo madlo v jedné ze tří délek.
  const kovaniT = brankaKovaniLabels[lang] ?? brankaKovaniLabels.cs
  const brankaKovani = [
    {
      name: "kovani",
      title: kovaniT.title,
      options: brankaKovaniOptions.map((o) => ({ value: o.value, label: kovaniT.options[o.value] ?? o.label })),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <StepTitle pre={t.titlePre} accent={t.titleAccent} post={t.titlePost} />
        <p className="mt-1 text-muted-foreground">{t.desc}</p>
      </div>

      <DeclineCard
        label={t.decline}
        active={branka === false}
        onClick={() => {
          setValue("branka", false)
          setValue("celkemBranek", 0)
          setValue("rozmeryBranek", undefined)
          onNext()
        }}
      />

      <ProductSection
        title={t.productTitle}
        image="/modely/lamark/branka.webp"
        imageAlt={t.productTitle}
        galleryPhotos={photos.branka}
        info={info.branka}
        enabledField="branka"
        countField="celkemBranek"
        arrayField="rozmeryBranek"
        extraToggles={brankaExtras}
        extraRadios={brankaKovani}
        dimensionLabels={t.dimensionLabels}
        onNext={onNext}
        onBack={onBack}
        lang={lang}
      />
    </div>
  )
}
