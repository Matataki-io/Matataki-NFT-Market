import { BigNumber, BigNumberish, utils } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ZERO_ADDRESS } from '../constant';
import { DecimalValue } from '../types/ContractTypes';
import { Decimal } from '../utils/Decimal';
import { useMarket } from './useMarket';
import { useMedia } from './useMedia';
import { useMulticall } from './useMulticall';
import useRefCallback from './useRefCallback';

export function useMediaToken(id: BigNumberish) {
  const { account } = useWallet();
  const mediaContract = useMedia();
  const marketContract = useMarket();
  const { aggerateQuery } = useMulticall();
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
      currency: ZERO_ADDRESS,
      amount: BigNumber.from(0),
    },
  });
  const [isAllApprove, setAllApprove] = useState(false);
  const isAskExist = useMemo(
    () => profile.currentAsk.currency !== ZERO_ADDRESS,
    [profile]
  );

  const getDetailOf = useRefCallback(async () => {
    if (Number(id) === NaN) {
      return;
    }
    const { returns } = await aggerateQuery([
      {
        target: mediaContract.address,
        iface: mediaContract.interface,
        funcFrag: mediaContract.interface.getFunction('ownerOf'),
        data: [id],
      },
      {
        target: mediaContract.address,
        iface: mediaContract.interface,
        funcFrag: mediaContract.interface.getFunction('getApproved'),
        data: [id],
      },
      {
        target: mediaContract.address,
        iface: mediaContract.interface,
        funcFrag: mediaContract.interface.getFunction('tokenCreators'),
        data: [id],
      },
      {
        target: marketContract.address,
        iface: marketContract.interface,
        funcFrag: marketContract.interface.getFunction('bidSharesForToken'),
        data: [id],
      },
      {
        target: marketContract.address,
        iface: marketContract.interface,
        funcFrag: marketContract.interface.getFunction('currentAskForToken'),
        data: [id],
      },
    ]);
    console.info('re', returns);
    const [
      [owner],
      [approvedOperator],
      [creator],
      [bidsShares],
      [currentAsk],
    ] = (returns as unknown) as [
      [string],
      [string],
      [string],
      {
        creator: DecimalValue;
        owner: DecimalValue;
        prevOwner: DecimalValue;
      }[],
      {
        amount: BigNumber;
        currency: string;
      }[]
    ];
    setProfile({
      owner,
      creator,
      approvedOperator,
      bidsShares: {
        creator: bidsShares.creator,
        prevOwner: bidsShares.prevOwner,
        owner: bidsShares.owner,
      },
      currentAsk: { amount: currentAsk.amount, currency: currentAsk.currency },
    });
    // if (account) {
    //   const isApproveForAll = await mediaContract.isApprovedForAll(
    //     owner,
    //     account
    //   );
    //   const bidForTokenBidder = await marketContract.bidForTokenBidder(
    //     id,
    //     account
    //   );
    //   setAllApprove(isApproveForAll);
    // }
  }, [
    mediaContract,
    id,
    aggerateQuery,
    marketContract.address,
    marketContract.interface,
  ]);

  useEffect(() => {
    if (id) {
      getDetailOf();
    }
    let refreshInterval = setInterval(getDetailOf, 1000 * 10);
    return () => clearInterval(refreshInterval);
  }, [id, getDetailOf]);

  const isMeTheOwner = useMemo(
    () =>
      account &&
      profile.owner &&
      utils.getAddress(profile.owner) === utils.getAddress(account),
    [profile, account]
  );

  const isOwnerOrApproved = useMemo(() => {
    return (
      isAllApprove ||
      profile.approvedOperator === account ||
      profile.owner === account
    );
  }, [isAllApprove, profile, account]);

  const removeAsk = useCallback(async () => {
    const req = await mediaContract.removeAsk(id);
    const receipt = await req.wait();
    return receipt;
  }, [mediaContract, id]);

  return { isOwnerOrApproved, isMeTheOwner, profile, removeAsk, isAskExist };
}
