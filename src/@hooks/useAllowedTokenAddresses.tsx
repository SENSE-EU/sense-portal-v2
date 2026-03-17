'use client'
import { useMemo } from 'react'
import { getAddress } from 'ethers'
import { getAllowedErc20Map } from '@utils/runtimeConfig'
/**
 * Returns a checksummed array of allowed token addresses for a given network.
 * Uses only addresses configured in NEXT_PUBLIC_ALLOWED_ERC20_ADDRESSES.
 * @param networkId Chain ID or network name
 */
export default function useAllowedTokenAddresses(
  networkId?: string | number
): string[] {
  return useMemo(() => {
    if (!networkId) return []
    const normalizedNetworkId = Number(networkId)
    const tokenAddresses =
      getAllowedErc20Map()[normalizedNetworkId.toString()] || []

    if (!Array.isArray(tokenAddresses) || tokenAddresses.length === 0) {
      return []
    }

    return tokenAddresses.reduce((acc: string[], address: string) => {
      try {
        acc.push(getAddress(address)) // checksum + validate
      } catch (e) {
        console.warn(
          `[useAllowedTokenAddresses] Invalid address skipped: ${address}`
        )
      }
      return acc
    }, [])
  }, [networkId])
}
