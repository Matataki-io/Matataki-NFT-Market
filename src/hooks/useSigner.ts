import { ethers } from 'ethers';
import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';

export function useSigner(addressOrIndex?: string | number) {
  const wallet = useWallet();
  const signer = useMemo(() => {
    if (!wallet.ethereum) return null;
    const provider = new ethers.providers.Web3Provider(wallet.ethereum as any);
    return provider.getSigner(addressOrIndex);
  }, [wallet.ethereum]);

  function isSignerReady(
    signer: ethers.providers.JsonRpcSigner | null
  ): signer is ethers.providers.JsonRpcSigner {
    return Boolean(signer);
  }

  return { signer, isSignerReady };
}
