"use client"

import Image from "next/image"
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formControlsContent, type Lang } from "@/lib/translations"

/** Malý native checkbox použitý pro doplňkové volby (pohon, zámek, …) uvnitř polí formuláře. */
export const InlineCheckbox = forwardRef<HTMLInputElement, { label: string } & ComponentPropsWithoutRef<"input">>(
  ({ label, className, id, ...props }, ref) => (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center gap-2 text-sm text-foreground/80", className)}>
      <span className="relative flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-black/40 bg-white transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand">
        <input ref={ref} id={id} type="checkbox" className="peer absolute inset-0 size-full cursor-pointer opacity-0" {...props} />
        <Check className="pointer-events-none size-3 text-brand-foreground opacity-0 peer-checked:opacity-100" />
      </span>
      {label}
    </label>
  ),
)
InlineCheckbox.displayName = "InlineCheckbox"

/**
 * Nativní radio ve stejném vizuálu jako `InlineCheckbox`, jen kulaté — pro doplňkové
 * volby, ze kterých jde vybrat právě jednu (kování branky). Nativní `<input type="radio">`
 * si vzájemnou výlučnost řeší sám podle `name`, takže stačí `register(...)` z RHF.
 */
export const InlineRadio = forwardRef<HTMLInputElement, { label: string } & ComponentPropsWithoutRef<"input">>(
  ({ label, className, id, ...props }, ref) => (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center gap-2 text-sm text-foreground/80", className)}>
      <span className="relative flex size-4 shrink-0 items-center justify-center rounded-full border border-black/40 bg-white transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand">
        <input ref={ref} id={id} type="radio" className="peer absolute inset-0 size-full cursor-pointer opacity-0" {...props} />
        <span className="pointer-events-none size-1.5 rounded-full bg-brand-foreground opacity-0 peer-checked:opacity-100" />
      </span>
      {label}
    </label>
  ),
)
InlineRadio.displayName = "InlineRadio"

/**
 * Karta zaškrtávací volby — stejný vzhled jako `RadioCardGroup`, jen pro volby,
 * ze kterých jde vybrat víc najednou (strany stínění pergoly). Drží se `has-[:checked]`
 * místo React stavu, takže se dá napojit přímo přes `register(...)` z react-hook-form.
 */
export const CheckboxCard = forwardRef<
  HTMLInputElement,
  { label: string; desc?: string } & ComponentPropsWithoutRef<"input">
>(({ label, desc, className, id, ...props }, ref) => (
  <label
    htmlFor={id}
    className={cn(
      "flex cursor-pointer flex-col gap-1.5 rounded-2xl border-2 border-border bg-card p-4 transition-colors hover:border-brand/40 has-[:checked]:border-brand",
      className,
    )}
  >
    <span className="flex items-start gap-2 text-sm font-semibold">
      <span className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-black/40 bg-white transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand">
        <input ref={ref} id={id} type="checkbox" className="peer absolute inset-0 size-full cursor-pointer opacity-0" {...props} />
        <Check className="pointer-events-none size-3 text-brand-foreground opacity-0 peer-checked:opacity-100" />
      </span>
      {label}
    </span>
    {desc ? <span className="text-xs text-muted-foreground">{desc}</span> : null}
  </label>
))
CheckboxCard.displayName = "CheckboxCard"

/** Karta pro rychlé odmítnutí produktu ("Nechci bránu/branku") — vlastní vzhled, ne z formuláře. */
export function DeclineCard({
  label,
  active,
  onClick,
}: {
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border border-dashed border-border bg-transparent px-5 py-4 text-left text-sm font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground",
        // Odmítnutí je taky výběr — potvrzuje se stejnou oranžovou jako produktová karta,
        // jen v jemném odstínu, aby na kroku nesoupeřilo s kartami produktů.
        active && "border-solid border-brand bg-brand/10 text-foreground hover:border-brand",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border border-current",
          active && "bg-brand border-brand text-brand-foreground",
        )}
      >
        {active ? <Check className="size-3.5" /> : null}
      </span>
      {label}
    </button>
  )
}

/**
 * Mřížka barevných vzorků navázaná na string pole (barva, barvaTvarnice, …) přes value/onValueChange.
 * `value` na položce je stabilní (česká, malými písmeny) hodnota, kterou dostane backend/e-mail
 * bez ohledu na jazyk webu; `color` je jen zobrazený, přeložený popisek.
 */
export function ColorSwatchGroup({
  value,
  onChange,
  colors,
}: {
  value: string
  onChange: (value: string) => void
  colors: { code: string; color: string; value?: string }[]
}) {
  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as string)} className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {colors.map((c) => {
        const active = value === (c.value ?? c.color.toLowerCase())
        // Žádné id/htmlFor: base-ui Radio je <span> s vnořeným skrytým <input>,
        // který není nativně "labelovatelný" – klik funguje jen přes vnoření do <label>.
        return (
          <label
            key={c.color}
            className={cn(
              // Samotný oranžový puntík u názvu barvy je na mřížce vzorků špatně vidět —
              // vybraný vzorek proto dostane i oranžový rámeček jako produktová karta.
              "flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-2 text-center transition-colors",
              active ? "border-brand bg-brand/10" : "border-transparent hover:border-border",
            )}
          >
            <span
              className="size-12 rounded-full border border-border shadow-sm"
              style={{ backgroundColor: c.code }}
            />
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <RadioGroupItem value={c.value ?? c.color.toLowerCase()} />
              {c.color}
            </span>
          </label>
        )
      })}
    </RadioGroup>
  )
}

/** Mřížka voleb s obrázkem (motiv oplocení, materiál sloupků / dílců). */
export function ImageRadioGrid({
  value,
  onChange,
  options,
  lang = "cs",
}: {
  value: string
  onChange: (value: string) => void
  /** `image: null` vykreslí místo modelu popisek — buď `placeholder`, nebo „Vlastní řešení“. */
  options: { value: string; label: string; image: string | null; placeholder?: string }[]
  lang?: Lang
}) {
  const t = formControlsContent[lang] ?? formControlsContent.cs
  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as string)} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <label
            key={opt.value}
            className={cn(
              // Stejný jazyk výběru jako u produktových karet (`ProductSection`):
              // `border-2` je tu vždy, aby přepnutí na oranžovou neposunulo obsah dlaždice.
              "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 bg-card p-4 text-center transition-colors hover:border-brand/40",
              active ? "border-brand" : "border-border",
            )}
          >
            {opt.image ? (
              <Image src={opt.image} alt={opt.label} width={220} height={220} className="aspect-square w-full max-w-[220px] rounded-xl bg-background object-contain p-2" />
            ) : (
              <span className="flex aspect-square w-full max-w-[220px] items-center justify-center rounded-xl border border-dashed border-border p-2 text-center text-xs text-muted-foreground">
                {opt.placeholder ?? t.customSolution}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <RadioGroupItem value={opt.value} />
              {opt.label}
            </span>
          </label>
        )
      })}
    </RadioGroup>
  )
}

/**
 * Textová varianta `ImageRadioGrid` pro volby, ke kterým nemáme model ani fotku
 * (spodní uchycení sloupků). Stejný jazyk výběru — oranžový rámeček u aktivní
 * karty — jen bez obrázkové plochy, aby z toho nebyl prázdný placeholder.
 */
export function RadioCardGroup({
  value,
  onChange,
  options,
  className,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; desc?: string }[]
  className?: string
}) {
  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as string)} className={cn("grid gap-3 sm:grid-cols-3", className)}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <label
            key={opt.value}
            className={cn(
              "flex cursor-pointer flex-col gap-1.5 rounded-2xl border-2 bg-card p-4 transition-colors hover:border-brand/40",
              active ? "border-brand" : "border-border",
            )}
          >
            <span className="flex items-start gap-2 text-sm font-semibold">
              <RadioGroupItem value={opt.value} className="mt-0.5 shrink-0" />
              {opt.label}
            </span>
            {opt.desc ? <span className="text-xs text-muted-foreground">{opt.desc}</span> : null}
          </label>
        )
      })}
    </RadioGroup>
  )
}

export function FieldGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
