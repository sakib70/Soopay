export interface Currency {
  code: string
  name: string
  country: string
  flag: string
  symbol: string
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'BDT', name: 'Bangladeshi Taka', country: 'Bangladesh', flag: '🇧🇩', symbol: '৳' },
  { code: 'INR', name: 'Indian Rupee', country: 'India', flag: '🇮🇳', symbol: '₹' },
  { code: 'PKR', name: 'Pakistani Rupee', country: 'Pakistan', flag: '🇵🇰', symbol: '₨' },
  { code: 'IDR', name: 'Indonesian Rupiah', country: 'Indonesia', flag: '🇮🇩', symbol: 'Rp' },
  { code: 'CNY', name: 'Chinese Yuan', country: 'China', flag: '🇨🇳', symbol: '¥' },
  { code: 'VND', name: 'Vietnamese Dong', country: 'Vietnam', flag: '🇻🇳', symbol: '₫' },
]

export interface ExchangeRates {
  [key: string]: number
}

export interface SavedWallet {
  id: string
  wallet_address: string
  nickname: string
  saved_address: string
  created_at: string
}

export interface Transaction {
  id: string
  wallet_address: string
  tx_hash: string
  recipient: string
  amount_usdc: number
  amount_local: number | null
  currency: string | null
  status: string
  created_at: string
}
