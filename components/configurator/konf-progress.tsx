"use client"

import { useEffect, useRef, type ComponentType, type SVGProps } from "react"
import { Check } from "lucide-react"
import { konfCommonContent, type Lang } from "@/lib/translations"
import { cn } from "@/lib/utils"

type StepIcon = ComponentType<SVGProps<SVGSVGElement>>
type StepStatus = "done" | "active" | "upcoming"

function StepTile({
  Icon,
  status,
  size,
}: {
  Icon: StepIcon
  status: StepStatus
  size: "sm" | "lg"
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-2xl border transition-colors",
        size === "lg" ? "size-16" : "size-12",
        status === "active" && "border-brand bg-brand text-brand-foreground shadow-sm",
        status === "done" && "border-brand/25 bg-brand/10 text-brand",
        status === "upcoming" && "border-border bg-background text-muted-foreground",
      )}
    >
      <Icon className={size === "lg" ? "size-8" : "size-6"} />
      {status === "done" ? (
        <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-brand text-brand-foreground ring-2 ring-accent">
          <Check className="size-3" />
        </span>
      ) : null}
    </div>
  )
}

/**
 * Postranní (resp. na mobilu horní) přehled kroků konfigurátoru.
 *
 * Celý pruh je šedý (`bg-accent`), aktivní krok dostane bílou "záložku" ve stejné barvě,
 * jakou má formulář — a protože pruh sousedí s formulářem bez mezery, bílá plocha kolem
 * ikony plynule přechází do formuláře.
 */
export function KonfProgress({
  step,
  steps,
  icons,
  lang = "cs",
}: {
  step: number
  steps: readonly string[]
  /** Ikona pro každý krok (stejné pořadí a délka jako `steps`). */
  icons: readonly StepIcon[]
  lang?: Lang
}) {
  const t = konfCommonContent[lang] ?? konfCommonContent.cs
  const activeMobileRef = useRef<HTMLDivElement>(null)

  // Na mobilu je pruh vodorovný scroller — aktivní krok si k sobě sám doroluje.
  useEffect(() => {
    activeMobileRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }, [step])

  const statusOf = (i: number): StepStatus => (i < step ? "done" : i === step ? "active" : "upcoming")

  return (
    <>
      {/* Mobil: pevně přilepený (sticky) vodorovný pruh nahoře nad formulářem. */}
      <div className="no-scrollbar sticky top-0 z-20 flex items-end gap-1 overflow-x-auto rounded-t-3xl bg-accent px-4 pt-4 sm:hidden">
        {steps.map((label, i) => {
          const status = statusOf(i)
          const Icon = icons[i]
          return (
            <div
              key={label}
              ref={status === "active" ? activeMobileRef : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-t-2xl px-3 pt-2 pb-4 transition-colors",
                status === "active" && "bg-card",
              )}
            >
              <StepTile Icon={Icon} status={status} size="sm" />
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  status === "upcoming" ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Tablet a výše: šedý sloupec přes celou výšku karty, uvnitř sticky seznam kroků. */}
      <div className="hidden rounded-l-3xl bg-accent sm:block">
        <nav className="sticky top-24 flex flex-col py-8" aria-label={t.progressLabel}>
          {steps.map((label, i) => {
            const status = statusOf(i)
            const Icon = icons[i]
            return (
              <div key={label}>
                <div
                  className={cn(
                    "flex items-center gap-4 rounded-l-2xl py-4 pl-4 transition-colors lg:pl-4 ml-4",
                    status === "active" && "bg-card",
                  )}
                >
                  <StepTile Icon={Icon} status={status} size="lg" />
                  <span
                    className={cn(
                      "pr-4 text-sm font-semibold text-pretty",
                      status === "upcoming" ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 ? (
                  <div
                    className={cn(
                      "ml-[3.25rem] h-6 w-px lg:ml-[3.75rem]",
                      status === "done" ? "bg-brand/40" : "bg-border",
                    )}
                  />
                ) : null}
              </div>
            )
          })}
        </nav>
      </div>
    </>
  )
}
