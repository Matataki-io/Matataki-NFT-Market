import { BigNumber, BigNumberish, Contract } from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { BaseErc20 } from '../blockchain/contracts/BaseErc20';

export function useBalance(token: BaseErc20) {
  const { account } = useWallet();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [lastUpdated, setUpdateTime] = useState(new Date());

  const fetchBalance = useCallback(async () => {
    const result = await token.balanceOf(account as string);
    setBalance(result);
    setUpdateTime(new Date());
  }, [account]);
  /**
   * use Dan's example
   * https://github.com/facebook/react/issues/14326#issuecomment-441680293
   */
  useEffect(() => {
    if (account && token) {
      fetchBalance();
    }
    let refreshInterval = setInterval(fetchBalance, 1000 * 10);
    return () => clearInterval(refreshInterval);
  }, [account, fetchBalance, token]);

  const isEnough = (x: BigNumberish) => balance.gte(x);

  return { allowance: balance, isEnough, lastUpdated };
}
