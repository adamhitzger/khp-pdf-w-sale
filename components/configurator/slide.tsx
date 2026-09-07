"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

const variants: Variants = {
  enter: (direction: number) => ({ x: `${100 * direction}%`, opacity: 0 }),
  center: { x: "0%", opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: (direction: number) => ({ x: `${-100 * direction}%`, opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }),
}

export function Slide({ children, direction, className }: { children: ReactNode; direction: number; className?: string }) {
  return (
    <motion.div custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className={className}>
      {children}
    </motion.div>
  )
}
