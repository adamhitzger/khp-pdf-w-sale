"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { ImagePlus, Loader2, X } from "lucide-react"
import toast from "react-hot-toast"
import type { ConfiguratorType } from "@/lib/schemas"
import { motivImage, motivy } from "@/lib/konf-content"
import { ImageRadioGrid } from "./form-controls"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button, buttonVariants } from "@/components/ui/button"
import { formControlsContent, motivLabels, stepMotivContent, type Lang } from "@/lib/translations"
import { StepTitle } from "./step-title"

/** Delší strana fotky motivu po zmenšení. V PDF je fotka široká ~180 mm, 1600 px je tam ~225 dpi. */
const FOTO_MAX_PX = 1600

/**
 * Zmenší fotku v prohlížeči na JPEG data URL. Originál z telefonu má klidně 5–10 MB
 * a do server action i do Chromia při tisku PDF by šel celý; po zmenšení má kolem 300 kB.
 */
async function fotoToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  const scale = Math.min(1, FOTO_MAX_PX / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D není k dispozici")
  // Průhledné PNG by v JPEGu zčernalo.
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL("image/jpeg", 0.85)
}

/** 5. krok: motiv výplně plotových dílců — jediná volba kroku, proto po kliknutí jdeme dál. */
export function StepMotiv({
  onNext,
  lang = "cs",
  foto,
  onFotoChange,
}: {
  onNext?: () => void
  lang?: Lang
  /**
   * Fotka motivu (JPEG data URL) do PDF nabídky. Stejně jako sleva nežije ve
   * formuláři — `data.json` by s ní nabobtnal o stovky kB. Drží ji `Configurator`;
   * bez `onFotoChange` se pole nevykreslí.
   */
  foto?: string | null
  onFotoChange?: (value: string | null) => void
}) {
  const { register, watch, setValue } = useFormContext<ConfiguratorType>()
  const [fotoLoading, setFotoLoading] = useState(false)
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

      {motiv && onFotoChange ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="motivFoto">{t.fotoLabel}</Label>
          {/* `sr-only` místo `hidden` — viz file input v `sale-tool.tsx` (mobilní Safari). */}
          <input
            id="motivFoto"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              // Vynulovat, ať jde stejný soubor po odebrání vybrat znovu.
              e.target.value = ""
              if (!file) return
              setFotoLoading(true)
              try {
                onFotoChange(await fotoToDataUrl(file))
              } catch (err) {
                console.error(err)
                toast.error(t.fotoError)
              } finally {
                setFotoLoading(false)
              }
            }}
          />
          {foto ? (
            <div className="flex flex-col gap-2">
              <img src={foto} alt={t.fotoLabel} className="max-h-72 w-fit max-w-full rounded-md border object-contain" />
              <div className="flex gap-2">
                <label htmlFor="motivFoto" className={buttonVariants({ variant: "outline", size: "sm", className: "cursor-pointer" })}>
                  {fotoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                  {t.fotoReplace}
                </label>
                <Button type="button" variant="outline" size="sm" onClick={() => onFotoChange(null)}>
                  <X className="h-4 w-4" />
                  {t.fotoRemove}
                </Button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="motivFoto"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary/50"
            >
              {fotoLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">{t.fotoButton}</span>
            </label>
          )}
          <p className="text-sm text-muted-foreground">{t.fotoHint}</p>
        </div>
      ) : null}
    </div>
  )
}
