'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, AlertCircle } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { isAddress } from 'viem'
import { toast } from 'sonner'

interface ScanModalProps {
  isOpen: boolean
  onClose: () => void
  onScan: (address: string) => void
}

export function ScanModal({ isOpen, onClose, onScan }: ScanModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !isScanning) {
      startScanner()
    }

    return () => {
      stopScanner()
    }
  }, [isOpen])

  const startScanner = async () => {
    if (!containerRef.current) return

    try {
      setError(null)
      setIsScanning(true)

      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Check if it's a valid Ethereum address
          const address = decodedText.replace('ethereum:', '').split('@')[0]
          
          if (isAddress(address)) {
            toast.success('Address scanned!')
            onScan(address)
            stopScanner()
            onClose()
          } else {
            setError('Invalid Ethereum address')
          }
        },
        () => {
          // Ignore scan failures (no QR code in view)
        }
      )
    } catch (err) {
      console.error('Scanner error:', err)
      setError('Camera access denied or unavailable')
      setIsScanning(false)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current = null
      } catch {
        // Ignore stop errors
      }
    }
    setIsScanning(false)
  }

  const handleClose = () => {
    stopScanner()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={handleClose}
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
              <h2 className="font-pixel text-lg text-foreground">SCAN QR</h2>
              <button onClick={handleClose} className="p-1 hover:bg-secondary rounded-sm">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Scanner Container */}
            <div 
              ref={containerRef}
              className="relative aspect-square bg-secondary rounded-sm overflow-hidden mb-4"
            >
              <div id="qr-reader" className="w-full h-full" />
              
              {/* Scan Frame Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-accent rounded-sm" />
                </div>
                {/* Corner accents */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
                </div>
              </div>

              {/* Loading State */}
              {!isScanning && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                  <Camera className="w-8 h-8 text-muted-foreground animate-pulse" />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-sm mb-4"
              >
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            {/* Instructions */}
            <p className="text-center text-xs text-muted-foreground font-mono">
              Point camera at a wallet QR code
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
