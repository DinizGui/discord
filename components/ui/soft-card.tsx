'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function SoftCard({
  className,
  children,
  hover = true,
}: {
  className?: string
  children: React.ReactNode
  hover?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'rounded-2xl border border-white/[0.06] bg-zinc-900/80 p-5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
