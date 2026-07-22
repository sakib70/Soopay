import { useReadContract } from 'wagmi'
import { USDC_CONTRACT, USDC_DECIMALS, ERC20_ABI } from '@/lib/wagmi'
import { formatUnits } from 'viem'

export function useUSDCBalance(address: `0x${string}` | undefined) {
  const { data, isLoading, refetch } = useReadContract({
    address: USDC_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  })

  const balance = data ? Number(formatUnits(data as bigint, USDC_DECIMALS)) : 0

  return {
    balance,
    isLoading,
    refetch,
  }
}
