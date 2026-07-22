'use client'

import { useExchangeRates } from '@/hooks/use-exchange-rates'
import { SUPPORTED_CURRENCIES } from '@/lib/types'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'

export function FXTicker() {
  const { rates, isLoading } = useExchangeRates()

  const tickerItems = SUPPORTED_CURRENCIES.map((currency) => {
    const rate = rates?.[currency.code]
    // Simulate small random change for visual effect
    const isUp = Math.random() > 0.5
    
    return {
      ...currency,
      rate: rate ? (1 / rate).toFixed(6) : '-.------',
      isUp,
    }
  })

  // Duplicate items for seamless loop
  const allItems = [...tickerItems, ...tickerItems]

  return (
    <div className="w-full bg-secondary/50 border-b border-border overflow-hidden">
      <div className="relative h-8 flex items-center">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: isLoading ? 0 : '-50%' }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {allItems.map((item, index) => (
            <div
              key={`${item.code}-${index}`}
              className="flex items-center gap-2 text-xs font-mono"
            >
              <span className="text-muted-foreground">{item.code}/USD</span>
              <span className="text-foreground tabular-nums">{item.rate}</span>
              {item.isUp ? (
                <TrendingUp className="w-3 h-3 text-accent" />
              ) : (
                <TrendingDown className="w-3 h-3 text-primary" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
