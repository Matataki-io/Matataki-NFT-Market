import { BigNumberish, ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { WETH9__factory } from '../blockchain/contracts/WETH9__factory';
import { ZERO_ADDRESS } from '../constant';
import { currentWETH } from '../constant/contracts';
import { currentProvider } from '../constant/providers';
import { useBalance } from './useBalance';
import { useSigner } from './useSigner';

export function useWETH() {
  const { signer, isSignerReady } = useSigner();
  const weth = useMemo(() => {
    const readonlyProvider = currentProvider as ethers.providers.Provider;
    if (isSignerReady(signer)) {
      return WETH9__factory.connect(currentWETH, signer);
    } else {
      return WETH9__factory.connect(currentWETH, readonlyProvider);
    }
  }, [signer]);

  const deposit = useCallback(
    async (amount: BigNumberish) => {
      if (!isSignerReady(signer))
        throw new Error('Please connect wallet to continue');

      const txRequest = await weth.deposit({ value: amount });
      const receipt = await txRequest.wait();
      return { txRequest, receipt };
    },
    [signer, weth]
  );

  const withdraw = useCallback(
    async (amount: BigNumberish) => {
      if (!isSignerReady(signer))
        throw new Error('Please connect wallet to continue');

      const txRequest = await weth.withdraw(amount);
      const receipt = await txRequest.wait();
      return { txRequest, receipt };
    },
    [signer, weth]
  );

  return { weth, deposit, withdraw };
}
