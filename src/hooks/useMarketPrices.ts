import { useBoolean } from 'ahooks';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ZERO_ADDRESS } from '../constant';
import { useMarket } from './useMarket';
import { useMulticall } from './useMulticall';

export type MarketAsk = {
  currency: string;
  amount: BigNumber;
};

export function isAskExist(currentAsk?: MarketAsk): currentAsk is MarketAsk {
  return Boolean(currentAsk) && currentAsk?.currency !== ZERO_ADDRESS;
}

type MarketPriceBook = Record<string, MarketAsk>;

export function useMarketPrices(ids: Array<number | null>) {
  const { account } = useWallet();
  const marketContract = useMarket();
  const [isLoading, { setFalse: finishLoading }] = useBoolean(true);
  const { aggerateQuery } = useMulticall();

  const [priceBook, updatePriceBook] = useState<MarketPriceBook>({});

  const getDetailOf = useCallback(async () => {
    const queries = ids.map(id => ({
      target: marketContract.address,
      iface: marketContract.interface,
      funcFrag: marketContract.interface.getFunction('currentAskForToken'),
      data: [id],
    }));
    console.info('queries', queries);
    const { returns } = await aggerateQuery(queries);
    const currentAsks = (returns.map(r => ({
      amount: r[0][0],
      currency: r[0][1],
    })) as unknown) as Array<{
      amount: BigNumber;
      currency: string;
    }>;
    const _tmpB: MarketPriceBook = {};
    ids.forEach((id, idx) => {
      if (id) _tmpB[id] = currentAsks[idx];
    });
    updatePriceBook(_tmpB);
    finishLoading();
  }, [marketContract, account, ids, aggerateQuery, finishLoading]);

  useEffect(() => {
    if (ids.length > 0) {
      getDetailOf();
    }
    let refreshInterval = setInterval(getDetailOf, 1000 * 30);
    return () => clearInterval(refreshInterval);
  }, [JSON.stringify(ids), getDetailOf]);

  return { priceBook, isLoading };
}
