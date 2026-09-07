import type { SVGProps } from "react"

/**
 * Vlastní sada ikon pro kroky konfigurátoru (žádná externí ikonová knihovna
 * nemá "bránu" nebo "plotový dílec" — kreslíme si je sami jako jednoduché liniové SVG,
 * ve stejném duchu jako zbytek monochromatického + oranžového designu.
 */
type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

/** Brána — ozdobná, dvoukřídlá vjezdová brána se sloupky, makovicemi a kovářským obloukem (jako u zámků). */
export function GateIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* sloupky */}
      <path d="M4 21V6M20 21V6" />
      {/* makovice na sloupcích */}
      <circle cx="4" cy="4.1" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="20" cy="4.1" r="1.3" fill="currentColor" stroke="none" />
      {/* ozdobný oblouk mezi sloupky */}
      <path d="M4 6.5c3.2-3 12.8-3 16 0" />
      {/* zem */}
      <path d="M4 21h16" />
      {/* rámy křídel */}
      <path d="M6.3 9h5.7v11H6.3zM11.7 9h5.7v11h-5.7z" />
      {/* kovářské volutky uvnitř každého křídla */}
      <path d="M9.2 11.2c-1.5 0.9-1.5 2.7 0 3.6-1.5 0.9-1.5 2.7 0 3.6" />
      <path d="M14.8 11.2c1.5 0.9 1.5 2.7 0 3.6 1.5 0.9 1.5 2.7 0 3.6" />
    </svg>
  )
}

/** Branka — čelní pohled, jedno křídlo mezi sloupky, s panty na levé straně. */
export function WicketIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* sloupky z obou stran */}
      <path d="M4.5 3v18M19.5 3v18" />
      {/* zem */}
      <path d="M4.5 21h15" />
      {/* rám křídla */}
      <rect x="7.5" y="6.5" width="9" height="13" rx="0.5" />
      {/* svislé výplně */}
      <path d="M10.3 6.5v13M13.7 6.5v13" />
      {/* panty vlevo */}
      <path d="M4.5 9.5h3M4.5 17h3" />
      {/* klika/zámek vpravo */}
      <circle cx="15.2" cy="13" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Dílce — plotový díl mezi dvěma sloupky, se svislými plaňkami. */
export function PanelIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* sloupky po stranách */}
      <path d="M4 20V5M20 20V5" />
      {/* rám dílce */}
      <path d="M4 8h16M4 17h16" />
      {/* plaňky */}
      <path d="M8 8v9M12 8v9M16 8v9" />
      {/* terén */}
      <path d="M2 20h20" />
    </svg>
  )
}

/** Motiv — vzor výplně, panel s vodorovnými lamelami. */
export function PanelMotifIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 8.5h16M4 12h16M4 15.5h16" />
    </svg>
  )
}

/** Zábradlí — madlo na sloupcích s výplní (čelní pohled). */
export function RailingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* madlo */}
      <path d="M3 6.5h18" />
      {/* krajní sloupky */}
      <path d="M5 6.5v13M19 6.5v13" />
      {/* výplň */}
      <path d="M5 10.5h14" />
      <path d="M9.7 6.5v13M14.3 6.5v13" />
      {/* podlaha */}
      <path d="M3 19.5h18" />
    </svg>
  )
}

/** Barva — kapka barvy. */
export function PaintIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c3 3.6 6 7.2 6 10.5A6 6 0 0 1 6 13.5C6 10.2 9 6.6 12 3Z" />
      <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
    </svg>
  )
}

/** Kontakt — obálka. */
export function ContactIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 6.5l8 6.5 8-6.5" />
    </svg>
  )
}

/** Typ a stínění — pergola s lamelovou střechou. */
export function PergolaTypeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 8h17M3.5 5.5h17" />
      <path d="M6 8v12M18 8v12" />
      <path d="M9.5 8v3.5M14.5 8v3.5" />
    </svg>
  )
}

/** Upevnění — kotvící konzola do stěny. */
export function MountIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 3v18" />
      <path d="M4 8h9a3 3 0 0 1 3 3v2" />
      <path d="M4 16l8-3.5" />
      <circle cx="16" cy="14" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Stínění — slunce nad markýzou se svěšenými screenovými roletami. */
export function ShadeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* slunce nad stříškou */}
      <circle cx="12" cy="4.6" r="2.1" />
      <path d="M12 .8v.9M12 7.5v.9M8.3 2.5l.6.7M15.1 2.5l-.6.7" />
      {/* markýza */}
      <path d="M3 13.5 12 10l9 3.5" />
      <path d="M3 13.5h18" />
      {/* svěšené rolety */}
      <path d="M6.5 13.5v6M12 13.5v7.5M17.5 13.5v6" />
    </svg>
  )
}
