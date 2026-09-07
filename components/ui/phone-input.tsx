"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { formatPhoneCz } from "@/lib/utils"

/**
 * Telefonní pole, které si samo dělí číslo do trojic („770 169 411", s předvolbou
 * „+420 770 169 411"). Formátuje přímo hodnotu v DOM ještě před předáním dál, takže
 * do něj jde beze změny rozprostřít `register("phoneNumber")` z react-hook-form
 * i použít v nativním formuláři s `name` (kontaktní formulář).
 */
export const PhoneInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ onChange, ...props }, ref) => (
    <Input
      ref={ref}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      onChange={(e) => {
        // Kurzor po přepsání hodnoty spadne na konec — u telefonu se stejně píše
        // zleva doprava, takže to uživatel nepozná, a odpadá počítání offsetu.
        e.target.value = formatPhoneCz(e.target.value)
        onChange?.(e)
      }}
      {...props}
    />
  ),
)
PhoneInput.displayName = "PhoneInput"
