'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useDisconnect } from 'wagmi'
import { Send, QrCode, ScanLine, ExternalLink, LogOut } from 'lucide-react'
import { FXTicker } from './fx-ticker'
import { PortfolioCard } from './portfolio-card'
import { PixelButton } from './pixel-button'
import { SendModal } from './send-modal'
import { ReceiveModal } from './receive-modal'
import { ScanModal } from './scan-modal'
import { TransactionsList } from './transactions-list'
import { SavedWallets } from './saved-wallets'
import { createClient } from '@/lib/supabase/client'
import type { SavedWallet, Transaction } from '@/lib/types'

export function Dashboard() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  
  const [showSendModal, setShowSendModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showScanModal, setShowScanModal] = useState(false)
  const [savedWallets, setSavedWallets] = useState<SavedWallet[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [scannedAddress, setScannedAddress] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!address) return
    
    const supabase = createClient()
    const walletAddress = address.toLowerCase()

    const [walletsRes, txRes] = await Promise.all([
      supabase
        .from('saved_wallets')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false }),
      supabase
        .from('transactions')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false })
        .limit(10),
    ])

    if (walletsRes.data) setSavedWallets(walletsRes.data)
    if (txRes.data) setTransactions(txRes.data)
    setIsLoadingData(false)
  }, [address])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleScan = (scannedAddr: string) => {
    setScannedAddress(scannedAddr)
    setShowSendModal(true)
  }

  const handleQuickSend = (addr: string) => {
    setScannedAddress(addr)
    setShowSendModal(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* FX Ticker */}
      <FXTicker />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-6 h-6 bg-primary rounded flex items-center justify-center"
            animate={{ 
              boxShadow: [
                '0 0 5px rgba(255, 59, 59, 0.3)',
                '0 0 10px rgba(255, 59, 59, 0.5)',
                '0 0 5px rgba(255, 59, 59, 0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-primary-foreground font-pixel text-xs">◉</span>
          </motion.div>
          <span className="font-pixel text-sm text-foreground">SOOPAY</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://faucet.circle.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-accent transition-colors font-mono flex items-center gap-1"
          >
            Faucet
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => disconnect()}
            className="p-2 hover:bg-secondary rounded-sm transition-colors"
            title="Disconnect"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Portfolio Card */}
            <PortfolioCard />

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSendModal(true)}
                className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-sm pixel-border-primary hover:border-primary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Send className="w-5 h-5 text-primary" />
                </div>
                <span className="font-pixel text-xs text-foreground">SEND</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowReceiveModal(true)}
                className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-sm pixel-border-accent hover:border-accent/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-accent" />
                </div>
                <span className="font-pixel text-xs text-foreground">RECEIVE</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowScanModal(true)}
                className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-sm pixel-border hover:border-muted-foreground/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <ScanLine className="w-5 h-5 text-foreground" />
                </div>
                <span className="font-pixel text-xs text-foreground">SCAN</span>
              </motion.button>
            </div>

            {/* Saved Wallets (Mobile: hidden, Desktop: visible) */}
            <div className="hidden md:block bg-card border border-border rounded-sm p-4 pixel-border">
              <SavedWallets 
                wallets={savedWallets} 
                onUpdate={fetchData}
                onQuickSend={handleQuickSend}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Transactions */}
            <div className="bg-card border border-border rounded-sm p-4 pixel-border">
              <h3 className="font-pixel text-sm text-foreground mb-3">RECENT</h3>
              <TransactionsList transactions={transactions} isLoading={isLoadingData} />
            </div>

            {/* Saved Wallets (Mobile: visible, Desktop: hidden) */}
            <div className="md:hidden bg-card border border-border rounded-sm p-4 pixel-border">
              <SavedWallets 
                wallets={savedWallets} 
                onUpdate={fetchData}
                onQuickSend={handleQuickSend}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center py-3 border-t border-border">
        <p className="text-xs text-muted-foreground font-mono">
          Built on <span className="text-accent">Arc Testnet</span>
        </p>
      </footer>

      {/* Modals */}
      <SendModal 
        isOpen={showSendModal} 
        onClose={() => {
          setShowSendModal(false)
          setScannedAddress(null)
          fetchData()
        }}
        savedWallets={savedWallets}
        prefillRecipient={scannedAddress}
      />
      <ReceiveModal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} />
      <ScanModal 
        isOpen={showScanModal} 
        onClose={() => setShowScanModal(false)}
        onScan={handleScan}
      />
    </div>
  )
}
