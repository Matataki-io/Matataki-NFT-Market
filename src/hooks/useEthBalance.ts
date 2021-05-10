import { BigNumber, BigNumberish, Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { useLastUpdated } from './useLastUpdated';
import { useSigner } from './useSigner';

export function useEthBalance() {
  const { account } = useWallet();
  const { signer, isSignerReady } = useSigner();

  const [balance, setBalance] = useState(BigNumber.from(0));
  const { lastUpdated, updated } = useLastUpdated();

  const fetchBalance = useCallback(async () => {
    if (!isSignerReady(signer)) return;
    const result = await signer.getBalance();
    setBalance(result);
    updated();
  }, [signer]);
  /**
   * use Dan's example
   * https://github.com/facebook/react/issues/14326#issuecomment-441680293
   */
  useEffect(() => {
    if (!isSignerReady(signer)) return;
    if (account && signer) {
      fetchBalance();
    }
    let refreshInterval = setInterval(fetchBalance, 1000 * 10);
    return () => clearInterval(refreshInterval);
  }, [account, fetchBalance, signer]);

  const isEnoughEth = (x: BigNumberish) => balance.gte(x);

  return { balance, isEnoughEth, lastUpdated };
}
