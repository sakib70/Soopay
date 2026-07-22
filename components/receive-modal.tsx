'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check } from 'lucide-react'
import { useAccount } from 'wagmi'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ReceiveModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReceiveModal({ isOpen, onClose }: ReceiveModalProps) {
  const { address } = useAccount()
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    toast.success('Address copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-card border border-border rounded-sm p-6 pixel-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-pixel text-lg text-foreground">RECEIVE</h2>
              <button onClick={onClose} className="p-1 hover:bg-secondary rounded-sm">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-white rounded-sm"
              >
                <QRCodeSVG
                  value={address || ''}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#050505"
                  level="M"
                />
              </motion.div>
            </div>

            {/* Address */}
            <div className="text-center mb-4">
              <p className="text-xs font-mono text-muted-foreground mb-2">YOUR WALLET ADDRESS</p>
              <p className="text-sm font-mono text-foreground break-all">
                {address}
              </p>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyAddress}
              className="w-full flex items-center justify-center gap-2 p-3 bg-secondary border border-border rounded-sm hover:border-accent/50 transition-colors font-mono text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-accent">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Copy Address</span>
                </>
              )}
            </button>

            {/* Network Info */}
            <p className="mt-4 text-center text-xs text-muted-foreground font-mono">
              Only send USDC on <span className="text-accent">Arc Testnet</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
