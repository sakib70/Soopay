'use client'

import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { useUSDCBalance } from '@/hooks/use-usdc-balance'
import { Copy, Check, Wallet } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function PortfolioCard() {
  const { address } = useAccount()
  const { balance, isLoading } = useUSDCBalance(address as `0x${string}`)
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    toast.success('Address copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-sm p-4 pixel-border-accent"
    >
      {/* Balance */}
      <div className="mb-4">
        <p className="text-muted-foreground text-xs font-mono mb-1">USDC BALANCE</p>
        <motion.div
          key={balance}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="flex items-baseline gap-2"
        >
          {isLoading ? (
            <div className="h-8 w-32 bg-secondary animate-pulse rounded-sm" />
          ) : (
            <>
              <span className="text-3xl font-pixel text-foreground tabular-nums">
                {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-accent text-sm font-mono">USDC</span>
            </>
          )}
        </motion.div>
      </div>

      {/* Wallet Info */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground">
            {address ? truncateAddress(address) : '---'}
          </span>
        </div>
        <button
          onClick={copyAddress}
          className="p-1.5 hover:bg-secondary rounded-sm transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-accent" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Network Badge */}
      <div className="mt-3 flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-accent"
          animate={{
            boxShadow: [
              '0 0 4px rgba(0, 212, 212, 0.5)',
              '0 0 8px rgba(0, 212, 212, 0.8)',
              '0 0 4px rgba(0, 212, 212, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs font-mono text-muted-foreground">Arc Testnet</span>
      </div>
    </motion.div>
  )
}
