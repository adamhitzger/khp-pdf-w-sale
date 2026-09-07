"use client"

import { useFormContext } from "react-hook-form"
import type { ConfiguratorType } from "@/lib/schemas"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { kontaktStepContent, type Lang } from "@/lib/translations"
import { StepTitle } from "./step-title"

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm font-medium text-destructive">{message}</p>
}

export function StepKontakt({
  lang = "cs",
  sale,
  onSaleChange,
}: {
  lang?: Lang
  /**
   * Procentní sleva do nabídky. Nepatří do `confSchema` (zodResolver by ji při
   * odeslání zahodil), takže si ji drží `Configurator` ve vlastním stavu a sem ji
   * jen protahuje. Bez `onSaleChange` se pole vůbec nevykreslí — konfigurátor na
   * webu tak zůstává beze změny.
   */
  sale?: number
  onSaleChange?: (value: number) => void
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ConfiguratorType>()
  const t = kontaktStepContent[lang] ?? kontaktStepContent.cs

  return (
    <div className="flex flex-col pl-1 gap-6">
      <div>
        <StepTitle pre={t.titlePre} accent={t.titleAccent} post={t.titlePost} />
        <p className="mt-1 text-muted-foreground">{t.desc}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullname">{t.fullname}</Label>
          <Input id="fullname" {...register("fullname")} placeholder={t.fullnamePlaceholder} required />
          <FieldError message={errors.fullname?.message} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{t.email}</Label>
          <Input id="email" type="email" {...register("email")} placeholder={t.emailPlaceholder} required />
          <FieldError message={errors.email?.message} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phoneNumber">{t.phone}</Label>
          <PhoneInput id="phoneNumber" {...register("phoneNumber")} placeholder={t.phonePlaceholder} required />
          <FieldError message={errors.phoneNumber?.message} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">{t.company}</Label>
          <Input id="company" {...register("company")} placeholder={t.companyPlaceholder} />
          <FieldError message={errors.company?.message} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="obec">{t.obec}</Label>
          <Input id="obec" {...register("obec")} placeholder={t.obecPlaceholder} required />
          <FieldError message={errors.obec?.message} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">{t.address}</Label>
          <Input id="address" {...register("address")} placeholder={t.addressPlaceholder} required />
          <FieldError message={errors.address?.message} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="zip">{t.zip}</Label>
          <Input id="zip" {...register("zip")} placeholder={t.zipPlaceholder} required />
          <FieldError message={errors.zip?.message} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="file">{t.file}</Label>
          <Input id="file" multiple type="file" accept="image/jpeg,image/png" {...register("file")} />
        </div>
        {onSaleChange ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sale">Sleva (%)</Label>
            <Input
              id="sale"
              type="number"
              min={0}
              max={100}
              step={1}
              value={sale ?? 0}
              onChange={(e) => {
                // Prázdné pole dává `NaN` — bereme ho jako „bez slevy", ať se do
                // nabídky nedostane `Sleva NaN %`.
                const parsed = Number(e.target.value)
                onSaleChange(Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0)
              }}
            />
            <p className="text-sm text-muted-foreground">
              Odečte se z celkové ceny bez DPH a v nabídce se ukáže jako samostatný řádek.
            </p>
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="message">{t.message}</Label>
          <Textarea id="message" {...register("message")} placeholder={t.messagePlaceholder} rows={4} />
          <FieldError message={errors.message?.message} />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {t.consent}
      </p>
    </div>
  )
}
