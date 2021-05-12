import { useBoolean } from 'ahooks';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ZERO_ADDRESS } from '../constant';
import { useMarket } from './useMarket';
import { useMulticall } from './useMulticall';

type MarketAsk = {
  currency: string;
  amount: BigNumber;
};

type MarketPriceBook = Record<string, MarketAsk>;

export function useMarketPrices(ids: BigNumber[]) {
  const { account } = useWallet();
  const marketContract = useMarket();
  const [isLoading, { setFalse: finishLoading }] = useBoolean(true);
  const { aggerateQuery } = useMulticall();

  const [priceBook, updatePriceBook] = useState<MarketPriceBook>({});

  const isAskExist = (currentAsk: MarketAsk) =>
    currentAsk.currency !== ZERO_ADDRESS;

  const getDetailOf = useCallback(async () => {
    const queries = ids.map(id => ({
      target: marketContract.address,
      iface: marketContract.interface,
      funcFrag: marketContract.interface.getFunction('currentAskForToken'),
      data: [id],
    }));
    const { returns } = await aggerateQuery(queries);
    const currentAsks = (returns.map(r => r[0]) as unknown) as Array<{
      amount: BigNumber;
      currency: string;
    }>;
    const _tmpB: MarketPriceBook = {};
    ids.forEach((id, idx) => {
      _tmpB[id.toString()] = currentAsks[idx];
    });
    updatePriceBook(_tmpB);
    finishLoading();
  }, [marketContract, account, ids, aggerateQuery, finishLoading]);

  useEffect(() => {
    if (ids) {
      getDetailOf();
    }
    let refreshInterval = setInterval(getDetailOf, 1000 * 30);
    return () => clearInterval(refreshInterval);
  }, [JSON.stringify(ids), getDetailOf]);

  return { priceBook, isAskExist, isLoading };
}
