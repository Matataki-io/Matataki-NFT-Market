import { ethers } from 'ethers';
import { useMemo } from 'react';
import { BaseErc20Factory } from '../blockchain/contracts/BaseErc20Factory';
import { currentProvider } from '../constant/providers';
import { useSigner } from './useSigner';

export function useERC20(tokenAddress: string) {
  const { signer, isSignerReady } = useSigner();
  const token = useMemo(() => {
    if (isSignerReady(signer)) {
      return BaseErc20Factory.connect(tokenAddress, signer);
    } else {
      return BaseErc20Factory.connect(
        tokenAddress,
        currentProvider as ethers.providers.Provider
      );
    }
  }, [tokenAddress, signer]);

  return token;
}
