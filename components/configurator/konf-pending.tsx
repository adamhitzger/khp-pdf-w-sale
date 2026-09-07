"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { konfPendingContent, type Lang } from "@/lib/translations"

/**
 * Mezikrok mezi odesláním formuláře a potvrzením — nahradí celou kartu konfigurátoru
 * po dobu, kdy běží server action (`isPending` z `useTransition`).
 *
 * Skladbu i rozměry drží shodné s `KonfSuccess`, jen fajfku střídá rotující spinner
 * a chybí tlačítka — z tohohle stavu se nikam neodchází, přepne se sám.
 */
export function KonfPending({ lang = "cs" }: { lang?: Lang }) {
  const t = konfPendingContent[lang] ?? konfPendingContent.cs

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-10 sm:py-20"
    >
      {/* Prstenec kolem spinneru pulzuje — statický kruh by v tomhle stavu vypadal
          jako zaseknutá stránka. Pulz je CSS (`animate-pulse`), ne nekonečná
          framer-motion smyčka: ta drží běžící rAF a zbytečně zatěžuje vykreslování.
          `aria-hidden`, stav hlásí `role="status"` výš. */}
      <motion.span
        aria-hidden
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="flex size-28 animate-pulse items-center justify-center rounded-full bg-brand/15 motion-reduce:animate-none sm:size-32"
      >
        <span className="flex size-20 items-center justify-center rounded-full bg-brand text-brand-foreground sm:size-24">
          <Loader2 className="size-10 animate-spin sm:size-12" strokeWidth={2.5} />
        </span>
      </motion.span>

      <div className="flex flex-col items-center gap-4">
        <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-brand uppercase">{t.eyebrow}</p>
        <h2 className="max-w-2xl font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
          {t.heading}
        </h2>
        <p className="max-w-xl text-lg text-muted-foreground text-pretty">{t.desc}</p>
        <p className="max-w-xl text-sm text-muted-foreground/80 text-pretty">{t.note}</p>
      </div>
    </motion.div>
  )
}
