import { ethers } from 'ethers';
import { useMemo } from 'react';
import { MediaFactory } from '../blockchain/contracts/MediaFactory';
import { currentContracts } from '../constant/contracts';
import { currentProvider } from '../constant/providers';
import { useSigner } from './useSigner';

export function useMedia() {
  const { signer, isSignerReady } = useSigner();

  const media = useMemo(() => {
    if (isSignerReady(signer)) {
      return MediaFactory.connect(currentContracts?.MEDIA as string, signer);
    } else {
      return MediaFactory.connect(
        currentContracts?.MEDIA as string,
        currentProvider as ethers.providers.Provider
      );
    }
  }, [isSignerReady, signer]);

  return media;
}
