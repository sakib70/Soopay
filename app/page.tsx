'use client'

import { useAccount } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { Landing } from '@/components/landing'
import { Dashboard } from '@/components/dashboard'

export default function Home() {
  const { isConnected, isConnecting } = useAccount()

  return (
    <AnimatePresence mode="wait">
      {isConnecting ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              className="w-12 h-12 bg-primary rounded flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 10px rgba(255, 59, 59, 0.3)',
                  '0 0 25px rgba(255, 59, 59, 0.6)',
                  '0 0 10px rgba(255, 59, 59, 0.3)',
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-primary-foreground font-pixel text-xl">◉</span>
            </motion.div>
            <p className="text-muted-foreground font-mono text-sm">Connecting<span className="cursor-blink text-accent">_</span></p>
          </div>
        </motion.div>
      ) : isConnected ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard />
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Landing />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
