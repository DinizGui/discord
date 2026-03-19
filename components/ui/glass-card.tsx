'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function GlassCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
