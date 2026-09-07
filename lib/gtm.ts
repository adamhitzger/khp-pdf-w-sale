"use client"

import { useCallback } from "react"

/**
 * Prázdná náhrada za `lib/gtm.ts` z new-konstanta.
 *
 * Konfigurátor je sem zkopírovaný 1:1, takže na tyhle tři exporty pořád volá —
 * jenže tenhle nástroj je interní (přenačtení poptávky a přepočet se slevou),
 * ne veřejný web. Kdyby posílal `konfiguratorStep` a `generate_lead` do GTM,
 * mísily by se nám interní přepočty se skutečnými leady ze stránek.
 *
 * Signatury musí zůstat shodné se zdrojem, aby šel `components/configurator/*`
 * i příště aktualizovat prostým zkopírováním.
 */

export type KonfFormName = "Oplocení" | "Pergoly" | "Zábradlí"
export type LeadFormType = "kalkulace" | "kontakt"
export type LeadProduct = "oplocení" | "pergoly" | "zábradlí" | "stavební příprava"

export function useKonfSteps(_formName: KonfFormName, _stepNames: readonly string[]) {
  const trackStep = useCallback((_step: number) => {}, [])
  const resetSteps = useCallback(() => {}, [])
  return { trackStep, resetSteps }
}

export function sendGenerateLead(_formType: LeadFormType, _product?: LeadProduct) {}

export function sendUserDataToGTM(_data: {
  email?: string
  phone?: string
  fullName?: string
  city?: string
  zip?: string
  state?: string
}) {}
