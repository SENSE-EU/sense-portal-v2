import { useMemo } from 'react'
import { getAllowedErc20ChainIds } from '@utils/runtimeConfig'
import useActiveWalletChainId from './useActiveWalletChainId'

export default function useAllowedWalletChain() {
  const chainId = useActiveWalletChainId()

  const allowedChainIds = useMemo(() => getAllowedErc20ChainIds(), [])

  const isAllowedChain = chainId ? allowedChainIds.includes(chainId) : false

  return {
    chainId,
    isAllowedChain
  }
}
