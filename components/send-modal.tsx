'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ArrowRight, Loader2 } from 'lucide-react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, isAddress } from 'viem'
import { toast } from 'sonner'
import { PixelButton } from './pixel-button'
import { useExchangeRates } from '@/hooks/use-exchange-rates'
import { useUSDCBalance } from '@/hooks/use-usdc-balance'
import { SUPPORTED_CURRENCIES, type Currency, type SavedWallet } from '@/lib/types'
import { USDC_CONTRACT, USDC_DECIMALS, ERC20_ABI, arcTestnet } from '@/lib/wagmi'
import { createClient } from '@/lib/supabase/client'

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
  savedWallets: SavedWallet[]
  prefillRecipient?: string | null
}

export function SendModal({ isOpen, onClose, savedWallets, prefillRecipient }: SendModalProps) {
  const { address } = useAccount()
  const { balance, refetch } = useUSDCBalance(address as `0x${string}`)
  const { convertToUSDC } = useExchangeRates()
  
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0])
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const [localAmount, setLocalAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [showSavedWallets, setShowSavedWallets] = useState(false)

  // Prefill recipient when provided
  useEffect(() => {
    if (prefillRecipient && isOpen) {
      setRecipient(prefillRecipient)
    }
  }, [prefillRecipient, isOpen])

  const usdcAmount = localAmount ? convertToUSDC(Number(localAmount), selectedCurrency.code) : 0

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Transaction successful!')
      saveTransaction()
      refetch()
      onClose()
      resetForm()
    }
  }, [isSuccess])

  const resetForm = () => {
    setLocalAmount('')
    setRecipient('')
  }

  const saveTransaction = async () => {
    if (!address || !hash) return
    const supabase = createClient()
    await supabase.from('transactions').insert({
      wallet_address: address.toLowerCase(),
      tx_hash: hash,
      recipient: recipient.toLowerCase(),
      amount_usdc: usdcAmount,
      amount_local: Number(localAmount),
      currency: selectedCurrency.code,
      status: 'confirmed',
    })
  }

  const handleSend = async () => {
    if (!isAddress(recipient)) {
      toast.error('Invalid recipient address')
      return
    }
    if (usdcAmount <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    if (usdcAmount > balance) {
      toast.error('Insufficient balance')
      return
    }

    try {
      writeContract({
        address: USDC_CONTRACT,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, parseUnits(usdcAmount.toFixed(6), USDC_DECIMALS)],
        chainId: arcTestnet.id,
      })
    } catch {
      toast.error('Transaction failed')
    }
  }

  const selectSavedWallet = (wallet: SavedWallet) => {
    setRecipient(wallet.saved_address)
    setShowSavedWallets(false)
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
            className="w-full max-w-md bg-card border border-border rounded-sm p-6 pixel-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-pixel text-lg text-foreground">SEND</h2>
              <button onClick={onClose} className="p-1 hover:bg-secondary rounded-sm">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Currency Selector */}
            <div className="mb-4">
              <label className="text-xs font-mono text-muted-foreground mb-2 block">CURRENCY</label>
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="w-full flex items-center justify-between p-3 bg-secondary border border-border rounded-sm hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedCurrency.flag}</span>
                    <span className="font-mono text-foreground">{selectedCurrency.code}</span>
                    <span className="text-muted-foreground text-sm">({selectedCurrency.country})</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
                
                <AnimatePresence>
                  {showCurrencyDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-sm overflow-hidden z-10"
                    >
                      {SUPPORTED_CURRENCIES.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => {
                            setSelectedCurrency(currency)
                            setShowCurrencyDropdown(false)
                          }}
                          className="w-full flex items-center gap-2 p-3 hover:bg-secondary transition-colors"
                        >
                          <span className="text-lg">{currency.flag}</span>
                          <span className="font-mono text-foreground">{currency.code}</span>
                          <span className="text-muted-foreground text-sm">{currency.country}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="text-xs font-mono text-muted-foreground mb-2 block">AMOUNT</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                  {selectedCurrency.symbol}
                </span>
                <input
                  type="number"
                  value={localAmount}
                  onChange={(e) => setLocalAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 pl-10 bg-secondary border border-border rounded-sm font-mono text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none transition-colors"
                />
              </div>
              {localAmount && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-accent font-mono flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3" />
                  {usdcAmount.toFixed(2)} USDC
                </motion.p>
              )}
            </div>

            {/* Recipient Input */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-muted-foreground">RECIPIENT</label>
                {savedWallets.length > 0 && (
                  <button
                    onClick={() => setShowSavedWallets(!showSavedWallets)}
                    className="text-xs text-accent hover:underline font-mono"
                  >
                    Saved wallets
                  </button>
                )}
              </div>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full p-3 bg-secondary border border-border rounded-sm font-mono text-foreground text-sm placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none transition-colors"
              />
              
              <AnimatePresence>
                {showSavedWallets && savedWallets.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="bg-secondary border border-border rounded-sm">
                      {savedWallets.map((wallet) => (
                        <button
                          key={wallet.id}
                          onClick={() => selectSavedWallet(wallet)}
                          className="w-full flex items-center justify-between p-2 hover:bg-card transition-colors text-left"
                        >
                          <span className="text-sm text-foreground">{wallet.nickname}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {wallet.saved_address.slice(0, 6)}...{wallet.saved_address.slice(-4)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Send Button */}
            <PixelButton
              onClick={handleSend}
              disabled={isPending || isConfirming || !localAmount || !recipient}
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
            >
              {(isPending || isConfirming) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isPending ? 'Confirm in wallet' : 'Processing...'}
                </>
              ) : (
                'Send'
              )}
            </PixelButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
