import useSWR from 'swr'
import type { ExchangeRates } from '@/lib/types'

const EXCHANGE_API_URL = 'https://v6.exchangerate-api.com/v6/02c1c408c33cd7e69b88f460/latest/USD'

const fetcher = async (url: string): Promise<ExchangeRates> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch exchange rates')
  const data = await response.json()
  return data.conversion_rates
}

export function useExchangeRates() {
  const { data, error, isLoading } = useSWR<ExchangeRates>(
    EXCHANGE_API_URL,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: false,
    }
  )

  const convertToUSDC = (amount: number, currencyCode: string): number => {
    if (!data || !data[currencyCode]) return 0
    return amount / data[currencyCode]
  }

  const convertFromUSDC = (usdcAmount: number, currencyCode: string): number => {
    if (!data || !data[currencyCode]) return 0
    return usdcAmount * data[currencyCode]
  }

  return {
    rates: data,
    isLoading,
    error,
    convertToUSDC,
    convertFromUSDC,
  }
}
