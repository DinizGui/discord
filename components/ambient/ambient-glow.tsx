'use client'

import { motion } from 'framer-motion'

export function AmbientGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -left-1/4 top-0 h-[520px] w-[520px] rounded-full opacity-40 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
        }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-1/4 bottom-0 h-[480px] w-[480px] rounded-full opacity-35 blur-[90px]"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.28) 0%, transparent 70%)',
        }}
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[80px]"
        style={{
          background: 'radial-gradient(circle, rgba(244,114,182,0.2) 0%, transparent 65%)',
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
