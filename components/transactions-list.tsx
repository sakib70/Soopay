'use client'

import { motion } from 'framer-motion'
import { ExternalLink, ArrowUpRight, Clock } from 'lucide-react'
import type { Transaction } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

interface TransactionsListProps {
  transactions: Transaction[]
  isLoading: boolean
}

export function TransactionsList({ transactions, isLoading }: TransactionsListProps) {
  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-secondary animate-pulse rounded-sm" />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground font-mono">No transactions yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-[200px] overflow-y-auto no-scrollbar">
      {transactions.map((tx, index) => (
        <motion.div
          key={tx.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-sm hover:border-accent/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-mono text-foreground">
                To {truncateAddress(tx.recipient)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-mono text-foreground tabular-nums">
                {Number(tx.amount_usdc).toFixed(2)} USDC
              </p>
              {tx.amount_local && tx.currency && (
                <p className="text-xs text-muted-foreground tabular-nums">
                  {Number(tx.amount_local).toLocaleString()} {tx.currency}
                </p>
              )}
            </div>
            <a
              href={`https://testnet.arcscan.app/tx/${tx.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-card rounded-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-accent" />
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
