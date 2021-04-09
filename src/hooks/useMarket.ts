import { ethers } from 'ethers';
import { useMemo } from 'react';
import { MarketFactory } from '../blockchain/contracts/MarketFactory';
import { currentContracts } from '../constant/contracts';
import { currentProvider } from '../constant/providers';
import { useSigner } from './useSigner';

export function useMarket() {
  const { signer, isSignerReady } = useSigner();

  const market = useMemo(() => {
    if (isSignerReady(signer)) {
      return MarketFactory.connect(currentContracts?.MARKET as string, signer);
    } else {
      return MarketFactory.connect(
        currentContracts?.MARKET as string,
        currentProvider as ethers.providers.Provider
      );
    }
  }, [signer]);

  return market;
}
