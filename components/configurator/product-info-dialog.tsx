"use client"

import { useState, type MouseEvent } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import type { PortableBlock, ProductInfo } from "@/types"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { productInfoContent, type Lang } from "@/lib/translations"
import { cn } from "@/lib/utils"

/**
 * Minimální renderer Portable Textu pro `popisCs`/`popisSk`/`popisDe`.
 *
 * Záměrně se nesahá po `@portabletext/react`: ten je v node_modules jen jako
 * tranzitivní závislost `next-sanity`, takže import by byl nedeklarovaný a rozbil
 * by se při přeskládání stromu závislostí. Popisy v Studiu jsou navíc prostý text
 * s `strong`/`em` a občasnou odrážkou — na to tohle stačí.
 */
function PortableDescription({ blocks }: { blocks: PortableBlock[] }) {
  return (
    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
      {blocks.map((block, i) => {
        const spans = (block.children ?? []).filter((c) => c.text)
        if (spans.length === 0) return null

        const content = spans.map((span, j) => {
          const marks = span.marks ?? []
          let node = <>{span.text}</>
          if (marks.includes("strong")) node = <strong className="font-semibold text-foreground">{node}</strong>
          if (marks.includes("em")) node = <em>{node}</em>
          return <span key={span._key ?? j}>{node}</span>
        })

        return block.listItem ? (
          <li key={block._key ?? i} className="ml-5 list-disc">
            {content}
          </li>
        ) : (
          <p key={block._key ?? i}>{content}</p>
        )
      })}
    </div>
  )
}

/**
 * Oranžový podtržený odkaz pod názvem produktu + popup s lokalizovaným popisem
 * a několika fotkami. Vykresluje se jen tam, kde k produktu v Sanity existuje
 * vyplněný popis (viz `buildProductInfo`) — jinak vrací `null`, aby na kartě
 * nezůstal odkaz vedoucí do prázdna.
 *
 * `stopPropagation` je tu kvůli dlaždicím pergol, kde je klik na celou kartu
 * zároveň výběrem — bez něj by otevření popupu vybralo i typ pergoly.
 */
export function ProductInfoLink({
  info,
  fallbackTitle,
  onBrand = false,
  lang = "cs",
}: {
  info?: ProductInfo
  /** Název z konfigurátoru — použije se, když je `info.name` v Sanity prázdný. */
  fallbackTitle: string
  /** Karta je podbarvená plnou brand oranžovou — odkaz se překlopí do bílé,
   * jinak by oranžová na oranžové zmizela. */
  onBrand?: boolean
  lang?: Lang
}) {
  const [open, setOpen] = useState(false)
  const t = productInfoContent[lang] ?? productInfoContent.cs

  if (!info) return null
  const title = info.name || fallbackTitle

  const openDialog = (e: MouseEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={cn(
          "group inline-flex items-center gap-1 text-sm font-medium hover:underline underline-offset-4 transition-colors hover:cursor-pointer",
          onBrand
            ? "text-brand-foreground decoration-brand-foreground/50 hover:decoration-brand-foreground"
            : "text-brand decoration-brand/40 hover:decoration-brand",
        )}
      >
        {t.trigger}
        <ChevronDown className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5" />
      </button>

      {/* Obal se `stopPropagation` nad celým dialogem — karta pergoly pod popupem je
          klikatelná (= výběr typu) a React bublá i skrz portál. Na `DialogContent`
          by guard nestačil: ztmavené pozadí je v portálu sourozencem popupu, takže
          klik do něj by dlaždici pořád překlikl. */}
      <div className="contents" onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl gap-5" closeLabel={t.close}>
          <DialogTitle className="pr-8">{title}</DialogTitle>

          {info.photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {info.photos.map((url, i) => (
                <div key={url} className="relative aspect-[4/3]  overflow-hidden rounded-xl bg-background">
                  <Image
                    src={url}
                    alt={`${title} — ${t.photosAlt} ${i + 1}`}
                    fill
                    sizes="(min-width: 640px) 18rem, 30vw"
                    className="object-cover "
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : null}

          <PortableDescription blocks={info.popis} />
        </DialogContent>
      </Dialog>
      </div>
    </>
  )
}
