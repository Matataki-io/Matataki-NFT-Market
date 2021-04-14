import { BigNumber, BigNumberish } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { Decimal } from '../utils/Decimal';
import { useMarket } from './useMarket';
import { useMedia } from './useMedia';

export function useMediaToken(id: BigNumberish) {
  const { account } = useWallet();
  const mediaContract = useMedia();
  const marketContract = useMarket();
  const [profile, setProfile] = useState({
    owner: '',
    creator: '',
    approvedOperator: '',
    bidsShares: {
      creator: Decimal.new(0),
      prevOwner: Decimal.new(0),
      owner: Decimal.new(0),
    },
    currentAsk: {
      currency: '',
      amount: BigNumber.from(0),
    },
  });
  const [isAllApprove, setAllApprove] = useState(false);

  const getDetailOf = useCallback(async () => {
    console.info('gdo', id);
    if (Number(id) === NaN) {
      return;
    }
    console.info('getDetailOf');
    const owner = await mediaContract.ownerOf(id);
    console.info('owner');

    const approvedOperator = await mediaContract.getApproved(id);
    console.info('approvedOperator');

    const creator = await mediaContract.tokenCreators(id);
    const bidsShares = await marketContract.bidSharesForToken(id);
    const currentAsk = await marketContract.currentAskForToken(id);
    setProfile({
      owner,
      creator,
      approvedOperator,
      bidsShares,
      currentAsk,
    });
    if (account) {
      const isApproveForAll = await mediaContract.isApprovedForAll(
        owner,
        account
      );
      const bidForTokenBidder = await marketContract.bidForTokenBidder(
        id,
        account
      );
      setAllApprove(isApproveForAll);
    }
  }, [mediaContract, account, id]);

  useEffect(() => {
    if (id) {
      getDetailOf();
    }
    let refreshInterval = setInterval(getDetailOf, 1000 * 10);
    return () => clearInterval(refreshInterval);
  }, [id, getDetailOf]);

  const isMeTheOwner = useMemo(() => profile.owner === account, [
    profile,
    account,
  ]);

  const isOwnerOrApproved = useMemo(() => {
    return (
      isAllApprove ||
      profile.approvedOperator === account ||
      profile.owner === account
    );
  }, [isAllApprove, profile, account]);

  return { isOwnerOrApproved, isMeTheOwner, profile };
}
