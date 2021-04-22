import { BigNumberish } from '@ethersproject/bignumber';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ZERO_ADDRESS } from '../constant';
import { Bid } from '../types/ContractTypes';
import { getBidFor } from '../utils/MarketHelper';
import { constructBid } from '../utils/zdkUtils';
import { useLastUpdated } from './useLastUpdated';
import { useMedia } from './useMedia';

export function useMyBid(tokenId: BigNumberish) {
  const { account } = useWallet();
  const [myBid, updateMyBid] = useState<Bid | null>(
    constructBid(ZERO_ADDRESS, 0, ZERO_ADDRESS, ZERO_ADDRESS, 0)
  );
  const { lastUpdated, updated } = useLastUpdated();
  const media = useMedia();

  const getBidsDetail = useCallback(async () => {
    if (!account) return;
    if (!tokenId) return;
    const res = await getBidFor(tokenId, [account]);
    updateMyBid(res[account]);
    updated();
  }, [tokenId, account]);

  useEffect(() => {
    if (!account) return;
    if (!tokenId) return;
    if (account && tokenId) {
      getBidsDetail();
    }
    let refreshInterval = setInterval(getBidsDetail, 1000 * 10);
    return () => clearInterval(refreshInterval);
  }, [tokenId, account, getBidsDetail]);

  const removeBid = useCallback(async () => {
    if (!tokenId) return;
    const tx = await media.removeBid(tokenId);
    const receipt = await tx.wait();
    return receipt;
  }, [tokenId, media]);

  return { myBid, lastUpdated, removeBid };
}
