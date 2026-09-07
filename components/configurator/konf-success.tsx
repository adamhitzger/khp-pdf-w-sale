"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Check, MoveLeft } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { POPTAVKY_EMAIL, konfSuccessContent, withLang, type Lang } from "@/lib/translations"

/**
 * Potvrzení o přijetí poptávky — nahradí celou kartu konfigurátoru po úspěšném odeslání.
 *
 * Vědomě bez rozpisu „co bude dál" (přijetí → zpracování → montáž): poptávky
 * neukládáme, takže bychom stav zákazníkovi nemohli nijak aktualizovat, a slibovat
 * proces, který nikde nesledujeme, nedává smysl.
 */
export function KonfSuccess({ lang = "cs", onReset }: { lang?: Lang; onReset?: () => void }) {
  const t = konfSuccessContent[lang] ?? konfSuccessContent.cs

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-10 sm:py-20"
    >
      {/* Fajfka v kruhu s měkkým prstencem — prstenec je jen podbarvení, proto `aria-hidden`. */}
      <motion.span
        aria-hidden
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex size-28 items-center justify-center rounded-full bg-brand/15 sm:size-32"
      >
        <span className="flex size-20 items-center justify-center rounded-full bg-brand text-brand-foreground sm:size-24">
          <Check className="size-10 sm:size-12" strokeWidth={2.5} />
        </span>
      </motion.span>

      <div className="flex flex-col items-center gap-4">
        <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-brand uppercase">{t.eyebrow}</p>
        <h2 className="max-w-2xl font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
          {t.heading}
        </h2>
        <p className="max-w-xl text-lg text-muted-foreground text-pretty">{t.desc}</p>
        <p className="max-w-xl text-sm text-muted-foreground/80 text-pretty">{t.note}</p>

        {/* Web běží krátce, tak zákazníkovi rovnou dáme adresu, kam poptávky
            padají — kdyby se odpověď někde ztratila, má se kam ozvat. */}
        <p className="mt-2 max-w-xl rounded-2xl border border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground text-pretty">
          {t.newSitePre}
          <a
            href={`mailto:${POPTAVKY_EMAIL}`}
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-brand"
          >
            {POPTAVKY_EMAIL}
          </a>
          {t.newSitePost}
        </p>
      </div>

      <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
        {/* base-ui Button nemá `asChild` — odkaz proto stylujeme přímo `buttonVariants`. */}
        <Link href={withLang("/", lang)} className={buttonVariants({ size: "lg" })}>
          <MoveLeft />
          {t.home}
        </Link>
        {onReset ? (
          <Button type="button" size="lg" variant="outline" onClick={onReset}>
            {t.again}
          </Button>
        ) : null}
      </div>
    </motion.div>
  )
}
