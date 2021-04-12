import { ethers } from 'ethers';
import { useMemo } from 'react';
import { BaseErc20Factory } from '../blockchain/contracts/BaseErc20Factory';
import { ZERO_ADDRESS } from '../constant';
import { currentProvider } from '../constant/providers';
import { useSigner } from './useSigner';

export function useERC20(tokenAddress: string) {
  const { signer, isSignerReady } = useSigner();
  const token = useMemo(() => {
    const readonlyProvider = currentProvider as ethers.providers.Provider;
    if (!tokenAddress)
      return BaseErc20Factory.connect(ZERO_ADDRESS, readonlyProvider);
    if (isSignerReady(signer)) {
      return BaseErc20Factory.connect(tokenAddress, signer);
    } else {
      return BaseErc20Factory.connect(tokenAddress, readonlyProvider);
    }
  }, [tokenAddress, signer]);

  return token;
}
