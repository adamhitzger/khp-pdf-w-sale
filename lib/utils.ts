import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Průběžné formátování českého telefonního čísla do trojic — „770 169 411",
 * s předvolbou „+420 770 169 411". Píše se do inputu při každém úhozu, aby
 * uživatel viděl číslo po skupinách místo jednoho slitého řetězce.
 *
 * Tvar odpovídá `phoneRegex` v `lib/schemas.tsx` (`^(\+?420\s?)?(\d\s?){9}$`),
 * takže naformátovaná hodnota projde validací beze změny.
 */
export function formatPhoneCz(raw: string): string {
  let digits = raw.replace(/\D/g, "")
  // Mezinárodní zápis chodí i s „00" místo „+" — sjednotíme ho, ať se předvolba
  // pozná stejně v obou případech (jinak z „00420…" vypadne nesmysl „004 207 701").
  const hasPlus = raw.trimStart().startsWith("+") || digits.startsWith("00")
  if (digits.startsWith("00")) digits = digits.slice(2)
  let prefix = ""

  // „420" na začátku je předvolba jen tehdy, když ji uvozuje „+" nebo když za ní
  // ještě zbývá celé devítimístné číslo — jinak jde o první tři cifry čísla.
  if (digits.startsWith("420") && (hasPlus || digits.length > 9)) {
    prefix = "+420 "
    digits = digits.slice(3)
  } else if (hasPlus) {
    prefix = "+"
  }

  return prefix + (digits.slice(0, 9).match(/\d{1,3}/g)?.join(" ") ?? "")
}
