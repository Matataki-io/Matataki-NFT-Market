import { BigNumber, BigNumberish, Contract } from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { BaseErc20 } from '../blockchain/contracts/BaseErc20';
import { useLastUpdated } from './useLastUpdated';
import { ZERO_ADDRESS } from '../constant';

export function useAllowance(token: BaseErc20, spender: string) {
  const { account } = useWallet();
  const [allowance, setAllowance] = useState(BigNumber.from(0));
  const [isUnlocking, setUnlockStat] = useState(false);
  const { lastUpdated, updated } = useLastUpdated();

  const fetchAllowance = useCallback(async () => {
    if (account && spender !== ZERO_ADDRESS && token.address !== ZERO_ADDRESS) {
      const result = await token.allowance(account as string, spender);
      setAllowance(result);
      updated();
    }
  }, [account, token, spender]);
  /**
   * use Dan's example
   * https://github.com/facebook/react/issues/14326#issuecomment-441680293
   */
  useEffect(() => {
    if (account && spender !== ZERO_ADDRESS && token.address !== ZERO_ADDRESS) {
      fetchAllowance();
    }
    let refreshInterval = setInterval(fetchAllowance, 1000 * 10);
    return () => clearInterval(refreshInterval);
  }, [account, spender, fetchAllowance, token]);

  const isEnough = useCallback((x: BigNumberish) => allowance.gte(x), [
    allowance,
  ]);

  const approve = useCallback(
    async (value: BigNumber = MaxUint256) => {
      setUnlockStat(true);
      try {
        const txResp = await token.approve(spender, value);
        await txResp.wait();
        await fetchAllowance();
        //   setAllowance(value);
        setUnlockStat(false);
      } catch (error) {
        console.error('Error happened when trying to unlock');
        //   setAllowance(value);
        setUnlockStat(false);
      }
      return true;
    },
    [token, spender]
  );

  return { allowance, isEnough, approve, lastUpdated, isUnlocking };
}
