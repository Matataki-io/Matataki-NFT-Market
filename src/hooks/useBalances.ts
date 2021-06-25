import { BigNumber, BigNumberish, utils } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { useLastUpdated } from './useLastUpdated';
import { staticMulticall } from './useMulticall';

type BalanceSheet = Record<string, BigNumber | undefined>;

const ABI = ['function balanceOf(address) view returns (uint256)'];
const balanceOfInterface = new utils.Interface(ABI);

export function useBalances(tokens: string[]) {
  // make sure every `tokens` addresses is checksumed
  const checksumedTokenAddresses = useMemo(
    () => tokens.map(t => utils.getAddress(t)),
    [tokens]
  );

  const { account } = useWallet();
  const [balanceSheet, setBalances] = useState<BalanceSheet>({});
  const { lastUpdated, updated } = useLastUpdated();

  const balanceOf = useCallback(
    (target: string) => {
      // @todo: if `target` not exist, enlist the `target` into the BalanceSheet and update
      return balanceSheet[utils.getAddress(target)] || BigNumber.from(0);
    },
    [tokens.join(), balanceSheet]
  );

  const fetchBalances = useCallback(async () => {
    if (!account) return;
    // const result = await tokens.balanceOf(account as string);
    // setBalances(result);
    const calls = checksumedTokenAddresses.map(target => ({
      target,
      callData: balanceOfInterface.encodeFunctionData('balanceOf', [account]),
    }));
    const { returnData } = await staticMulticall.callStatic.aggregate(calls);
    console.info('returnData', returnData);
    const sheet: BalanceSheet = {};
    checksumedTokenAddresses.forEach((token, idx) => {
      let [balance] = balanceOfInterface.decodeFunctionResult(
        'balanceOf',
        returnData[idx]
      );
      sheet[token] = balance as BigNumber;
    });
    console.info('sheet', sheet);
    setBalances(sheet);
    updated();
  }, [checksumedTokenAddresses.join(), account]);
  /**
   * use Dan's example
   * https://github.com/facebook/react/issues/14326#issuecomment-441680293
   */
  useEffect(() => {
    if (tokens.length === 0 || !account) return;
    // if (account && tokens) {
    fetchBalances();
    // }
    let refreshInterval = setInterval(fetchBalances, 1000 * 10);
    return () => clearInterval(refreshInterval);
  }, [account, fetchBalances, tokens]);

  const isEnough = useCallback(
    (target: string, x: BigNumberish) => balanceOf(target).gte(x),
    [balanceSheet, balanceOf]
  );

  return { balanceOf, isEnough, lastUpdated };
}
