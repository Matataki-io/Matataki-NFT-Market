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
  });
  const [isAllApprove, setAllApprove] = useState(false);

  const getDetailOf = useCallback(async () => {
    const owner = await mediaContract.ownerOf(id);
    const approvedOperator = await mediaContract.getApproved(id);
    const creator = await mediaContract.tokenCreators(id);
    const bidsShares = await marketContract.bidSharesForToken(id);
    setProfile({
      owner,
      creator,
      approvedOperator,
      bidsShares,
    });
    if (account) {
      const isApproveForAll = await mediaContract.isApprovedForAll(
        owner,
        account
      );
      setAllApprove(isApproveForAll);
    }
  }, [mediaContract, id]);

  useEffect(() => {
    if (id) {
      getDetailOf();
    }
  }, [id]);

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
