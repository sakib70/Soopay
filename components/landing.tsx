'use client'

import { motion } from 'framer-motion'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { FXTicker } from './fx-ticker'
import { PixelButton } from './pixel-button'
import { ExternalLink } from 'lucide-react'

export function Landing() {
  const { openConnectModal } = useConnectModal()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* FX Ticker */}
      <FXTicker />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              className="w-10 h-10 bg-primary rounded flex items-center justify-center pixel-border-primary"
              animate={{ 
                boxShadow: [
                  '0 0 10px rgba(255, 59, 59, 0.3)',
                  '0 0 20px rgba(255, 59, 59, 0.5)',
                  '0 0 10px rgba(255, 59, 59, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-primary-foreground font-pixel text-lg">◉</span>
            </motion.div>
            <h1 className="font-pixel text-3xl md:text-4xl text-foreground tracking-wider">
              SOOPAY
            </h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-muted-foreground text-lg md:text-xl mb-12 font-sans"
          >
            Pay globally, think locally<span className="cursor-blink text-accent">_</span>
          </motion.p>

          {/* Connect Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <PixelButton
              onClick={openConnectModal}
              variant="primary"
              size="lg"
              className="min-w-[200px]"
            >
              Connect
            </PixelButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="flex flex-col items-center gap-4 pb-8 px-4"
      >
        <p className="text-muted-foreground text-sm font-mono">
          Built on <span className="text-accent">Arc</span>
        </p>
        
        <a
          href="https://faucet.circle.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors font-mono"
        >
          <span>Get testnet USDC</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <a
          href="https://x.com/KingSakib0"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>@KingSakib0</span>
        </a>
      </motion.div>
    </div>
  )
}
