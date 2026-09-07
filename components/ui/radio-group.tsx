"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive>) {
  return <RadioGroupPrimitive data-slot="radio-group" className={cn("grid gap-2", className)} {...props} />
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioPrimitive.Root>) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        // Vizuálně shodné s `InlineCheckbox` (form-controls.tsx): hranatý zaoblený
        // rámeček, bílý dokud se nevybere, po výběru celý brand oranžový s bílou fajfkou.
        // Rozdíl checkbox/radio je pro zákazníka nepodstatný — konfigurátory proto drží
        // jeden tvar výběru a výlučnost si hlídá sama skupina.
        "flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-black/40 bg-white outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[checked]:border-brand data-[checked]:bg-brand disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex items-center justify-center data-[unchecked]:hidden">
        <Check className="size-3 text-brand-foreground" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
