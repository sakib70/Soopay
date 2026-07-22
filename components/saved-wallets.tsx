'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Trash2, Send } from 'lucide-react'
import { useAccount } from 'wagmi'
import { isAddress } from 'viem'
import { toast } from 'sonner'
import { PixelButton } from './pixel-button'
import { createClient } from '@/lib/supabase/client'
import type { SavedWallet } from '@/lib/types'

interface SavedWalletsProps {
  wallets: SavedWallet[]
  onUpdate: () => void
  onQuickSend: (address: string) => void
}

export function SavedWallets({ wallets, onUpdate, onQuickSend }: SavedWalletsProps) {
  const { address } = useAccount()
  const [showAddForm, setShowAddForm] = useState(false)
  const [nickname, setNickname] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async () => {
    if (!address) return
    if (!nickname.trim()) {
      toast.error('Enter a nickname')
      return
    }
    if (!isAddress(walletAddress)) {
      toast.error('Invalid wallet address')
      return
    }

    setIsAdding(true)
    const supabase = createClient()
    
    const { error } = await supabase.from('saved_wallets').insert({
      wallet_address: address.toLowerCase(),
      nickname: nickname.trim(),
      saved_address: walletAddress.toLowerCase(),
    })

    if (error) {
      if (error.code === '23505') {
        toast.error('Wallet already saved')
      } else {
        toast.error('Failed to save wallet')
      }
    } else {
      toast.success('Wallet saved!')
      setNickname('')
      setWalletAddress('')
      setShowAddForm(false)
      onUpdate()
    }
    
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('saved_wallets').delete().eq('id', id)
    
    if (error) {
      toast.error('Failed to delete')
    } else {
      toast.success('Wallet removed')
      onUpdate()
    }
  }

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-pixel text-sm text-foreground">SAVED</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1 hover:bg-secondary rounded-sm transition-colors"
        >
          {showAddForm ? (
            <X className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Plus className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="p-3 bg-secondary/50 border border-border rounded-sm space-y-3">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Nickname"
                className="w-full p-2 bg-card border border-border rounded-sm text-sm font-mono text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none"
              />
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-2 bg-card border border-border rounded-sm text-sm font-mono text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none"
              />
              <PixelButton
                onClick={handleAdd}
                disabled={isAdding}
                variant="accent"
                size="sm"
                className="w-full"
              >
                {isAdding ? 'Saving...' : 'Save'}
              </PixelButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallets List */}
      {wallets.length === 0 ? (
        <p className="text-xs text-muted-foreground font-mono text-center py-4">
          No saved wallets
        </p>
      ) : (
        <div className="space-y-2 max-h-[150px] overflow-y-auto no-scrollbar">
          {wallets.map((wallet, index) => (
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-2 bg-secondary/50 border border-border rounded-sm group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{wallet.nickname}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {truncateAddress(wallet.saved_address)}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onQuickSend(wallet.saved_address)}
                  className="p-1.5 hover:bg-card rounded-sm transition-colors"
                  title="Quick send"
                >
                  <Send className="w-3 h-3 text-accent" />
                </button>
                <button
                  onClick={() => handleDelete(wallet.id)}
                  className="p-1.5 hover:bg-card rounded-sm transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
