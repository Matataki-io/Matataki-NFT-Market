import { BigNumber, BigNumberish, Contract } from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { BaseErc20 } from '../blockchain/contracts/BaseErc20';

export function useAllowance(token: BaseErc20, spender: string) {
  const { account } = useWallet();
  const [allowance, setAllowance] = useState(BigNumber.from(0));
  const [lastUpdated, setUpdateTime] = useState(new Date());

  const fetchAllowance = useCallback(async () => {
    const result = await token.allowance(account as string, spender);
    setAllowance(result);
    setUpdateTime(new Date());
  }, [account, spender]);
  /**
   * use Dan's example
   * https://github.com/facebook/react/issues/14326#issuecomment-441680293
   */
  useEffect(() => {
    if (account && spender && token) {
      fetchAllowance();
    }
    let refreshInterval = setInterval(fetchAllowance, 1000 * 10);
    return () => clearInterval(refreshInterval);
  }, [account, spender, fetchAllowance, token]);

  const isEnough = (x: BigNumberish) => allowance.gte(x);

  const approve = useCallback(
    async (value: BigNumber = MaxUint256) => {
      const txResp = await token.approve(spender, value);
      await txResp.wait();
      //   setAllowance(value);
      return true;
    },
    [token, spender]
  );

  return { allowance, isEnough, approve, lastUpdated };
}
