"use client"

import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ConfPhotoItem } from "@/types"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { konfCommonContent, motivLabels, photoGalleryContent, type Lang } from "@/lib/translations"
import { cn } from "@/lib/utils"

function MotivChip({
  label,
  count,
  active,
  onClick,
  className,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors",
        active ? "border-brand bg-brand/12 text-brand" : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <span className="truncate">{label}</span>
      <span className={cn("shrink-0 font-mono text-xs tabular-nums", active ? "text-brand" : "text-muted-foreground")}>{count}</span>
    </button>
  )
}

/** Kolik náhledů se vejde pod model, než se zbytek schová za „+N" na poslední dlaždici. */
const THUMB_LIMIT = 3

/** Rozměry plovoucího náhledu u kurzoru (px) — počítá se s nimi i při držení v okně. */
const PREVIEW_W = 358
const PREVIEW_H = 316
/** Odstup od hrotu kurzoru, ať náhled nepřekrývá miniaturu, nad kterou se stojí. */
const PREVIEW_GAP = 18
const VIEWPORT_PAD = 8

/**
 * Zvětšenina miniatury, která visí u kurzoru. Vykresluje se portálem do `body`:
 * produktová karta má `overflow-hidden` a krok konfigurátoru se animuje transformem,
 * takže uvnitř stromu by se náhled ořízl (a `fixed` by se vztáhl k transformu, ne k oknu).
 */
function ThumbPreview({ url, alt, x, y }: { url: string; alt: string; x: number; y: number }) {
  if (typeof document === "undefined") return null

  // Vpravo od kurzoru, dokud je kam — u pravého okraje okna se náhled překlopí doleva.
  const left =
    x + PREVIEW_GAP + PREVIEW_W + VIEWPORT_PAD > window.innerWidth
      ? Math.max(VIEWPORT_PAD, x - PREVIEW_GAP - PREVIEW_W)
      : x + PREVIEW_GAP
  const top = Math.max(VIEWPORT_PAD, Math.min(y - PREVIEW_H / 2, window.innerHeight - PREVIEW_H - VIEWPORT_PAD))

  return createPortal(
    <div
      style={{ left, top, width: PREVIEW_W, height: PREVIEW_H }}
      className="pointer-events-none fixed z-60 overflow-hidden rounded-xl border border-border bg-background shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
    >
      <Image src={url} alt={alt} fill sizes="388px" className="object-cover" unoptimized />
    </div>,
    document.body,
  )
}

/**
 * Řádek miniatur reálných fotek pod modelem produktu — jediný vstup do `PhotoLightbox`.
 * Záměrně drobné (28–32 px): karta má vizuálně vést model produktu, fotky realizací
 * jsou jen pozvánka do galerie, ne druhý obrázek soupeřící o pozornost.
 *
 * `stopPropagation` je kvůli dlaždicím pergol, kde je klik na celou kartu zároveň
 * výběrem typu — bez něj by otevření galerie vybralo i pergolu.
 */
export function PhotoThumbs({
  photos,
  title,
  label,
  onOpen,
  lang = "cs",
}: {
  photos: ConfPhotoItem[]
  title: string
  /** Lokalizované „Zobrazit fotky" pro `aria-label`. */
  label: string
  onOpen: () => void
  lang?: Lang
}) {
  const gt = photoGalleryContent[lang] ?? photoGalleryContent.cs
  /** Která miniatura je pod kurzorem a kde ten kurzor je — pro plovoucí zvětšeninu. */
  const [preview, setPreview] = useState<{ index: number; x: number; y: number } | null>(null)

  if (photos.length === 0) return null
  const shown = photos.slice(0, THUMB_LIMIT)
  const hidden = photos.length - shown.length

  return (
    <div className="flex items-center gap-1.5">
      {shown.map((photo, i) => (
        <button
          key={`${photo.url}-${i}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setPreview(null)
            onOpen()
          }}
          /* Náhled je čistě myší záležitost — na dotyku by po klepnutí zůstal viset
             přes otevřený lightbox. */
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return
            setPreview({ index: i, x: e.clientX, y: e.clientY })
          }}
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return
            setPreview({ index: i, x: e.clientX, y: e.clientY })
          }}
          onPointerLeave={() => setPreview(null)}
          className="group relative size-8 hover:scale-95 hover:rounded-xl shrink-0 overflow-hidden rounded-md border border-border bg-background transition-colors hover:border-brand sm:size-10"
          aria-label={`${label}: ${title}`}
        >
          <Image src={photo.url} alt={`${title} — ${gt.realization} ${i + 1}`} fill sizes="56px" className="object-cover" unoptimized />
          {i === shown.length - 1 && hidden > 0 ? (
            <span className="absolute inset-0 flex items-center justify-center bg-foreground/55 text-[10px] font-semibold text-background">
              +{hidden}
            </span>
          ) : null}
        </button>
      ))}

      {preview ? (
        <ThumbPreview
          url={shown[preview.index].url}
          alt={`${title} — ${gt.realization} ${preview.index + 1}`}
          x={preview.x}
          y={preview.y}
        />
      ) : null}
    </div>
  )
}

/**
 * Velký prosklouzávací náhled reálných fotek realizací — 3/4 šířky obrazovky,
 * místo drobných dlaždic vedle sebe. Pokud aspoň jedna fotka má v Sanity vyplněný
 * `motiv`, přidá se boční filtr motivů (vpravo se pak zobrazí jen fotky daného motivu).
 *
 * Celý dialog visí v obalu se `stopPropagation`. Dlaždice typu pergoly (viz
 * `perg-step-typ.tsx`) je totiž celá klikatelná = výběr typu, a u typů bez doplňků
 * výběr rovnou posouvá na další krok. Popup sice jde portálem do `body`, ale
 * React bublá události po svém stromu, ne po DOM — klik na šipku galerie tak
 * doputoval až na dlaždici a překlikl krok konfigurátoru. Obal musí být nad
 * `<Dialog>`, ne až na `DialogContent`: jinak zůstane díra v ztmaveném pozadí,
 * které je v portálu sourozencem popupu. `display: contents` drží obal mimo
 * layout karty.
 */
export function PhotoLightbox({
  photos,
  title,
  open,
  onOpenChange,
  initialIndex = 0,
  lang = "cs",
}: {
  photos: ConfPhotoItem[]
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialIndex?: number
  lang?: Lang
}) {
  const t = motivLabels[lang] ?? motivLabels.cs
  const gt = photoGalleryContent[lang] ?? photoGalleryContent.cs
  const kt = konfCommonContent[lang] ?? konfCommonContent.cs
  const [index, setIndex] = useState(initialIndex)
  const [direction, setDirection] = useState(1)
  const [activeMotiv, setActiveMotiv] = useState<string | null>(null)

  const motivGroups = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of photos) {
      if (!p.motiv) continue
      counts.set(p.motiv, (counts.get(p.motiv) ?? 0) + 1)
    }
    return [...counts.entries()]
  }, [photos])

  const filtered = activeMotiv ? photos.filter((p) => p.motiv === activeMotiv) : photos

  useEffect(() => {
    if (open) {
      setActiveMotiv(motivGroups.length > 0 ? motivGroups[0][0] : null)
      setIndex(initialIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialIndex])

  useEffect(() => {
    setIndex(0)
  }, [activeMotiv])

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1)
    setIndex((next + filtered.length) % filtered.length)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1)
      if (e.key === "ArrowLeft") go(index - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, filtered.length])

  if (photos.length === 0) return null
  const hasMotivFilter = motivGroups.length > 0

  return (
    <div className="contents" onClick={(e) => e.stopPropagation()}>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85dvh] w-full max-w-none flex-col gap-0 overflow-hidden p-0 sm:w-[75vw]" closeLabel={kt.close}>
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          {hasMotivFilter ? (
            <>
              {/* Mobil: motivy se zalamují na víc řádků, ať je vidět celý seznam bez scrollování do strany. */}
              <div className="flex max-h-32 shrink-0 flex-wrap items-center gap-2 overflow-y-auto border-b border-border p-3 sm:hidden">
                {motivGroups.map(([id, count]) => (
                  <MotivChip key={id} label={t[id] ?? id} count={count} active={activeMotiv === id} onClick={() => setActiveMotiv(id)} />
                ))}
              </div>

              {/* Desktop: svislý sidebar filtrů vlevo. */}
              <div className="hidden w-52 shrink-0 flex-col gap-1 overflow-y-auto border-r border-border p-3 sm:flex">
                <span className="px-3 pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{gt.motivHeading}</span>
                {motivGroups.map(([id, count]) => (
                  <MotivChip key={id} label={t[id] ?? id} count={count} active={activeMotiv === id} onClick={() => setActiveMotiv(id)} />
                ))}
              </div>
            </>
          ) : null}

          <div className="relative min-h-0 flex-1 overflow-hidden bg-background">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={`${activeMotiv ?? "all"}-${index}`}
                custom={direction}
                initial={{ x: `${100 * direction}%`, opacity: 0 }}
                animate={{ x: "0%", opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ x: `${-100 * direction}%`, opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
                className="absolute inset-0"
              >
                <Image
                  src={filtered[index].url}
                  alt={`${title} — ${gt.realization} ${index + 1}`}
                  fill
                  sizes="75vw"
                  className="object-contain"
                  unoptimized
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {filtered.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label={gt.prevPhoto}
                  className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background sm:left-5"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label={gt.nextPhoto}
                  className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background sm:right-5"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border px-5 py-3">
          <span className="font-heading text-sm font-bold sm:text-base">{title}</span>
          {filtered.length > 1 ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {index + 1} / {filtered.length}
              </span>
              <div className="hidden items-center gap-1.5 sm:flex">
                {filtered.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`${gt.photoAt} ${i + 1}`}
                    className={cn("size-1.5 rounded-full bg-border transition-colors", i === index && "bg-brand")}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}
