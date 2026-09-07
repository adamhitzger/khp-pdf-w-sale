import { cn } from "@/lib/utils"

/**
 * Nadpis kroku konfigurátoru. Překlady drží nadpis rozdělený na tři části
 * (`*Pre` / `*Accent` / `*Post`), protože zvýrazněné slovo je v každém jazyce
 * jinde ve větě — např. cs „Jakou si přejete **barvu**?" vs. sk „Akú **farbu**
 * si želáte?". Prostřední část se vysází značkovou oranžovou.
 */
export function StepTitle({
  pre,
  accent,
  post,
  className,
}: {
  pre: string
  accent: string
  post?: string
  className?: string
}) {
  return (
    <h2 className={cn("font-heading text-2xl font-bold sm:text-3xl", className)}>
      {pre}
      <span className="text-brand">{accent}</span>
      {post}
    </h2>
  )
}
