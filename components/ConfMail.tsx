import { Section, Text } from "@react-email/components"
import type { ConfiguratorType } from "@/lib/schemas"
import type { ConfPhotos } from "@/types"
import { gateProducts } from "@/lib/konf-content"
import {
  type Lang,
  confMailContent,
  gateLabels,
  localeTags,
  mailContent,
  quoteItemsContent,
} from "@/lib/translations"
import {
  CompanyCard,
  DataRow,
  MailFooter,
  MailShell,
  Masthead,
  PhotoCard,
  SectionHead,
  mailStyles,
} from "@/components/mail-theme"

export interface KonstantaHPEmailProps {
  userName: string
  userEmail: string
  tel: string
  address: string
  city: string
  photos: ConfPhotos
  data: ConfiguratorType
  zip: string
  msg?: string
  company?: string
  /** Jazyk konfigurátoru (`?lang=`), který posílá `sendConf`. */
  lang?: Lang
}

/**
 * Které pole v `ConfiguratorType` znamená „zákazník si tenhle produkt vybral" a odkud
 * se k němu vezme ilustrační fotka. Brány se berou z `gateProducts`, aby se seznam
 * nemusel udržovat dvakrát; branka a plotové dílce v něm nejsou, ty jdou zvlášť.
 */
const productRows = [
  ...gateProducts.map((g) => ({
    field: g.enabledField,
    photosKey: g.photosKey,
    label: (lang: Lang) => (gateLabels[lang] ?? gateLabels.cs)[g.id] ?? g.label,
  })),
  {
    field: "branka" as const,
    photosKey: "branka" as const,
    label: (lang: Lang) => (quoteItemsContent[lang] ?? quoteItemsContent.cs).branka,
  },
  {
    field: "dilce" as const,
    photosKey: "ploty" as const,
    label: (lang: Lang) => (quoteItemsContent[lang] ?? quoteItemsContent.cs).dilce,
  },
]

export const ConfMail = ({
  userName,
  userEmail,
  tel,
  address,
  city,
  msg,
  company,
  photos,
  data,
  zip,
  lang = "cs",
}: KonstantaHPEmailProps) => {
  const t = mailContent[lang] ?? mailContent.cs
  // Úvodní odstavce má ConfMail vlastní — jako jediný mail posílá v příloze kalkulaci.
  const c = confMailContent[lang] ?? confMailContent.cs
  const locale = localeTags[lang] ?? localeTags.cs

  /** Jen produkty, které zákazník opravdu zaškrtl a ke kterým je v Sanity fotka. */
  const selected = productRows
    .map((row) => ({
      label: row.label(lang),
      src: photos?.[row.photosKey]?.[0],
      picked: Boolean(data[row.field as keyof ConfiguratorType]),
    }))
    .filter((p): p is { label: string; src: string; picked: boolean } =>
      p.picked && typeof p.src === "string" && p.src.length > 0,
    )

  return (
    <MailShell lang={lang} preview={t.preview}>
      <Masthead eyebrow={t.eyebrow} headline={t.headline} logoAlt={t.logoAlt} />

      <Section className="k-pad" style={mailStyles.body}>
        <Text style={mailStyles.lead}>{`${t.salutation} ${userName},`}</Text>
        <Text style={mailStyles.text}>{c.intro}</Text>
        <Text style={mailStyles.text}>{c.intro2}</Text>
        <Text style={mailStyles.text}>{c.intro3}</Text>
        <Text style={mailStyles.text}>
          {c.signoff}
          <br />
          {c.team}
        </Text>
      </Section>

      {selected.length > 0 && (
        <>
          <SectionHead num="01" label={t.productsHeading} />
          <Section className="k-pad" style={{ ...mailStyles.sectionWrap, margin: "18px 0 0" }}>
            {selected.map((p) => (
              <PhotoCard key={p.label} src={p.src} caption={p.label} alt={p.label} />
            ))}
          </Section>
        </>
      )}

      <SectionHead num={selected.length > 0 ? "02" : "01"} label={t.yourInfoHeading} />
      <Section className="k-pad" style={{ ...mailStyles.sectionWrap, margin: "18px 0 0" }}>
        <Section style={mailStyles.dataTable}>
          <DataRow label={t.fullName} value={userName} />
          <DataRow label={t.emailLabel} value={userEmail} />
          <DataRow label={t.phoneLabel} value={tel} />
          <DataRow label={t.addressLabel} value={`${address}, ${city} ${zip}`} />
          {company && <DataRow label={t.companyLabel} value={company} />}
          {msg && <DataRow label={t.messageLabel} value={msg} />}
          <DataRow label={t.dateLabel} value={new Date().toLocaleDateString(locale)} />
        </Section>
      </Section>

      <SectionHead num={selected.length > 0 ? "03" : "02"} label={t.companyHeading} />
      <CompanyCard t={t} />

      <MailFooter t={t} />
    </MailShell>
  )
}

export default ConfMail
