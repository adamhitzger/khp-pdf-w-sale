import type { CSSProperties, ReactNode } from "react"
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import type { Lang, MailChromeContent } from "@/lib/translations"

/**
 * Sdílený vzhled potvrzovacích e-mailů (ConfMail, PergMail).
 *
 * E-mailoví klienti neumí CSS proměnné, `oklch()`, flexbox ani webfonty spolehlivě,
 * takže se tokeny z `app/globals.css` překlápějí na natvrdo zapsaný hex a layout stojí
 * na tabulkách (`Section`/`Row`/`Column`). Barvy jsou převodem stejných oklch hodnot,
 * na kterých stojí web — když se změní brand na webu, změň i `mailColors.brand` tady.
 */
export const mailColors = {
  /** `--foreground` oklch(0.100 0 0) — o chlup zesvětlené, aby text nebyl „díra". */
  ink: "#0A0A0A",
  inkMid: "#3A3A3A",
  muted: "#606060",
  mutedSoft: "#8F8F8F",
  line: "#D7D7D7",
  lineSoft: "#EAEAEA",
  surface: "#FFFFFF",
  /** Plocha kolem karty — čistě šedá, ne modrošedá jako dřív (#f6f9fc). */
  canvas: "#F1F1F1",
  /** `--brand` oklch(0.646 0.200 41) */
  brand: "#EC5500",
  /** Tmavší odstín brandu pro text na světlém podkladu (kontrast AA). */
  brandDeep: "#B43900",
  /** Světlý brand podklad pro zvýrazněné bloky. */
  brandTint: "#FFF1E6",
} as const

/**
 * Webfonty se v Gmailu ani Outlooku nenačtou, takže se nespoléhá na Barlow a rovnou
 * se sází stack, který skončí u Arial Narrow / Helvetiky — vizuálně nejblíž kondenzované
 * a groteskní typografii webu.
 */
export const mailFonts = {
  heading: "'Barlow Condensed','Arial Narrow','Helvetica Neue',Helvetica,Arial,sans-serif",
  body: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
  mono: "'JetBrains Mono','SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace",
} as const

/** Odkud se tahají obrázky do e-mailu. Musí to být veřejná absolutní URL. */
export const MAIL_ASSET_BASE = "https://konstanta-hp-v2.vercel.app"
export const MAIL_LOGO_LIGHT = `${MAIL_ASSET_BASE}/email/logo-konstanta-light.png`

const CARD_WIDTH = 600
const GUTTER = "40px"

// ---------------------------------------------------------------------------
// Styly
// ---------------------------------------------------------------------------

export const mailStyles = {
  main: {
    backgroundColor: mailColors.canvas,
    fontFamily: mailFonts.body,
    margin: 0,
    padding: "32px 0",
    WebkitFontSmoothing: "antialiased",
  } as CSSProperties,

  container: {
    backgroundColor: mailColors.surface,
    margin: "0 auto",
    maxWidth: `${CARD_WIDTH}px`,
    width: "100%",
    border: `1px solid ${mailColors.line}`,
  } as CSSProperties,

  // — hlavička —
  masthead: {
    backgroundColor: mailColors.ink,
    padding: `36px ${GUTTER} 32px`,
  } as CSSProperties,

  logo: {
    display: "block",
    border: "none",
    outline: "none",
    textDecoration: "none",
  } as CSSProperties,

  brandRule: {
    backgroundColor: mailColors.brand,
    height: "3px",
    lineHeight: "3px",
    fontSize: "3px",
    width: "56px",
    margin: "26px 0 18px",
  } as CSSProperties,

  eyebrow: {
    fontFamily: mailFonts.mono,
    fontSize: "10px",
    lineHeight: "16px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: mailColors.brand,
    margin: "0 0 6px",
  } as CSSProperties,

  headline: {
    fontFamily: mailFonts.heading,
    fontSize: "38px",
    lineHeight: "1.02",
    letterSpacing: "-0.01em",
    fontWeight: 800,
    textTransform: "uppercase",
    color: mailColors.surface,
    margin: 0,
  } as CSSProperties,

  // — text —
  body: {
    padding: `36px ${GUTTER} 0`,
  } as CSSProperties,

  lead: {
    fontFamily: mailFonts.body,
    fontSize: "17px",
    lineHeight: "26px",
    color: mailColors.ink,
    fontWeight: 600,
    margin: "0 0 18px",
  } as CSSProperties,

  text: {
    fontFamily: mailFonts.body,
    fontSize: "15px",
    lineHeight: "25px",
    color: mailColors.inkMid,
    margin: "0 0 16px",
  } as CSSProperties,

  // — sekce —
  sectionWrap: {
    padding: `0 ${GUTTER}`,
    margin: "38px 0 0",
  } as CSSProperties,

  sectionNum: {
    fontFamily: mailFonts.mono,
    fontSize: "11px",
    lineHeight: "14px",
    letterSpacing: "0.1em",
    fontWeight: 500,
    color: mailColors.brand,
    margin: 0,
  } as CSSProperties,

  sectionLabel: {
    fontFamily: mailFonts.mono,
    fontSize: "11px",
    lineHeight: "14px",
    letterSpacing: "0.16em",
    fontWeight: 500,
    textTransform: "uppercase",
    color: mailColors.ink,
    margin: 0,
  } as CSSProperties,

  sectionRule: {
    backgroundColor: mailColors.line,
    height: "1px",
    lineHeight: "1px",
    fontSize: "1px",
    width: "100%",
  } as CSSProperties,

  sectionBody: {
    margin: "18px 0 0",
  } as CSSProperties,

  // — tabulka údajů —
  dataTable: {
    width: "100%",
    borderTop: `1px solid ${mailColors.lineSoft}`,
  } as CSSProperties,

  dataLabel: {
    width: "38%",
    padding: "11px 12px 11px 0",
    borderBottom: `1px solid ${mailColors.lineSoft}`,
    verticalAlign: "top",
  } as CSSProperties,

  dataLabelText: {
    fontFamily: mailFonts.mono,
    fontSize: "10px",
    lineHeight: "18px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: mailColors.muted,
    margin: 0,
  } as CSSProperties,

  dataValue: {
    padding: "11px 0",
    borderBottom: `1px solid ${mailColors.lineSoft}`,
    verticalAlign: "top",
  } as CSSProperties,

  dataValueText: {
    fontFamily: mailFonts.body,
    fontSize: "15px",
    lineHeight: "22px",
    color: mailColors.ink,
    fontWeight: 600,
    margin: 0,
  } as CSSProperties,

  /** Mezinadpis uvnitř sekce (např. „Pergola ke stěně") — nese brandový levý pruh. */
  subHead: {
    fontFamily: mailFonts.mono,
    fontSize: "10px",
    lineHeight: "16px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: mailColors.ink,
    backgroundColor: mailColors.brandTint,
    borderLeft: `3px solid ${mailColors.brand}`,
    padding: "9px 12px",
    margin: "26px 0 0",
  } as CSSProperties,

  // — fotky produktů —
  photoFrame: {
    border: `1px solid ${mailColors.line}`,
    margin: "0 0 6px",
  } as CSSProperties,

  photo: {
    display: "block",
    width: "100%",
    maxWidth: "518px",
    height: "auto",
    border: "none",
    outline: "none",
  } as CSSProperties,

  photoCaption: {
    fontFamily: mailFonts.mono,
    fontSize: "10px",
    lineHeight: "16px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: mailColors.muted,
    margin: "0 0 24px",
  } as CSSProperties,

  // — firemní karta —
  companyCard: {
    backgroundColor: mailColors.ink,
    padding: "28px 28px 24px",
  } as CSSProperties,

  companyName: {
    fontFamily: mailFonts.heading,
    fontSize: "24px",
    lineHeight: "1.1",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.01em",
    color: mailColors.surface,
    margin: "0 0 14px",
  } as CSSProperties,

  companyText: {
    fontFamily: mailFonts.body,
    fontSize: "14px",
    lineHeight: "23px",
    color: "#B8B8B8",
    margin: 0,
  } as CSSProperties,

  companyLink: {
    color: mailColors.brand,
    textDecoration: "none",
    fontWeight: 600,
  } as CSSProperties,

  // — patička —
  footerWrap: {
    padding: `0 ${GUTTER}`,
    margin: "36px 0 0",
  } as CSSProperties,

  footerNote: {
    fontFamily: mailFonts.body,
    fontSize: "13px",
    lineHeight: "21px",
    color: mailColors.muted,
    margin: 0,
  } as CSSProperties,

  footerBar: {
    borderTop: `1px solid ${mailColors.lineSoft}`,
    padding: `18px ${GUTTER} 32px`,
    margin: "28px 0 0",
  } as CSSProperties,

  footerSmall: {
    fontFamily: mailFonts.mono,
    fontSize: "10px",
    lineHeight: "16px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: mailColors.mutedSoft,
    margin: 0,
  } as CSSProperties,
} as const

/**
 * Jediná media query v celém e-mailu — na mobilu stáhne 40px okraje na 20px.
 * Gmail na Androidu ji ignoruje, tam layout drží `width:100%` na kontejneru.
 */
const responsiveCss = `
  @media only screen and (max-width: 620px) {
    .k-pad { padding-left: 20px !important; padding-right: 20px !important; }
    .k-headline { font-size: 30px !important; }
    .k-label { width: 42% !important; }
  }
  a { color: ${mailColors.brandDeep}; }
`

// ---------------------------------------------------------------------------
// Stavební bloky
// ---------------------------------------------------------------------------

export const MailShell = ({
  lang,
  preview,
  children,
}: {
  lang: Lang
  preview: string
  children: ReactNode
}) => (
  <Html lang={lang}>
    <Head>
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />
      <style dangerouslySetInnerHTML={{ __html: responsiveCss }} />
    </Head>
    <Preview>{preview}</Preview>
    <Body style={mailStyles.main}>
      <Container style={mailStyles.container}>{children}</Container>
    </Body>
  </Html>
)

export const Masthead = ({
  eyebrow,
  headline,
  logoAlt,
}: {
  eyebrow: string
  headline: string
  logoAlt: string
}) => (
  <Section className="k-pad" style={mailStyles.masthead}>
    <Img src={MAIL_LOGO_LIGHT} width="220" height="87" alt={logoAlt} style={mailStyles.logo} />
    <div style={mailStyles.brandRule} />
    <Text style={mailStyles.eyebrow}>{eyebrow}</Text>
    <Heading as="h1" className="k-headline" style={mailStyles.headline}>
      {headline}
    </Heading>
  </Section>
)

/** Číslovaný nadpis sekce s dotaženou linkou — stejný rytmus jako sekce na webu. */
export const SectionHead = ({ num, label }: { num: string; label: string }) => (
  <Section className="k-pad" style={mailStyles.sectionWrap}>
    <Row>
      <Column style={{ width: "22px", verticalAlign: "middle" }}>
        <Text style={mailStyles.sectionNum}>{num}</Text>
      </Column>
      <Column style={{ width: "1%", whiteSpace: "nowrap", paddingRight: "14px", verticalAlign: "middle" }}>
        <Text style={mailStyles.sectionLabel}>{label}</Text>
      </Column>
      <Column style={{ verticalAlign: "middle" }}>
        <div style={mailStyles.sectionRule} />
      </Column>
    </Row>
  </Section>
)

export const DataRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <Row>
    <Column className="k-label" style={mailStyles.dataLabel}>
      <Text style={mailStyles.dataLabelText}>{label}</Text>
    </Column>
    <Column style={mailStyles.dataValue}>
      <Text style={mailStyles.dataValueText}>{value}</Text>
    </Column>
  </Row>
)

export const PhotoCard = ({ src, caption, alt }: { src: string; caption: string; alt: string }) => (
  <>
    <div style={mailStyles.photoFrame}>
      <Img src={src} width="518" alt={alt} style={mailStyles.photo} />
    </div>
    <Text style={mailStyles.photoCaption}>{caption}</Text>
  </>
)

export const CompanyCard = ({ t }: { t: MailChromeContent }) => (
  <Section className="k-pad" style={{ ...mailStyles.sectionWrap, margin: "18px 0 0" }}>
    <Section style={mailStyles.companyCard}>
      <Heading as="h2" style={mailStyles.companyName}>
        KONSTANTA - hliníkové ploty s.r.o.
      </Heading>
      <Text style={mailStyles.companyText}>
        Maleč 36, 582 76 Maleč
        <br />
        {t.country}
        <br />
        {`${t.ico}: 21827150`}
        <br />
        {`${t.phone}: `}
        <Link href="tel:+420770169411" style={mailStyles.companyLink}>
          +420 770 169 411
        </Link>
        <br />
        {`${t.email}: `}
        <Link href="mailto:info@konstantahp.cz" style={mailStyles.companyLink}>
          info@konstantahp.cz
        </Link>
        <br />
        {`${t.web}: `}
        <Link href="https://www.konstantahp.cz" style={mailStyles.companyLink}>
          konstantahp.cz
        </Link>
      </Text>
    </Section>
  </Section>
)

export const MailFooter = ({ t }: { t: MailChromeContent }) => (
  <>
    <Section className="k-pad" style={mailStyles.footerWrap}>
      <Text style={mailStyles.footerNote}>{t.support}</Text>
    </Section>
    <Section className="k-pad" style={mailStyles.footerBar}>
      <Text style={mailStyles.footerSmall}>
        {`© ${new Date().getFullYear()} KONSTANTA - hliníkové ploty s.r.o. — ${t.rights}`}
      </Text>
    </Section>
  </>
)
