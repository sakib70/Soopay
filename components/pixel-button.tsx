'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PixelButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export function PixelButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  type = 'button',
}: PixelButtonProps) {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 pixel-border-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 pixel-border',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/90 pixel-border-accent',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        'font-pixel uppercase tracking-wider transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.button>
  )
}
