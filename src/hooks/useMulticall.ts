import { ethers } from 'ethers';
import { useMemo } from 'react';
import { Multicall__factory } from '../blockchain/contracts/MulticallFactory';
import { currentMulticallAddress } from '../constant/contracts';
import { currentProvider } from '../constant/providers';
import { useSigner } from './useSigner';

export function useMulticall() {
  const { signer, isSignerReady } = useSigner();
  const multicall = useMemo(() => {
    const readonlyProvider = currentProvider as ethers.providers.Provider;
    if (isSignerReady(signer)) {
      return Multicall__factory.connect(currentMulticallAddress, signer);
    } else {
      return Multicall__factory.connect(
        currentMulticallAddress,
        readonlyProvider
      );
    }
  }, [signer]);

  return multicall;
}
