import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { utils } from 'ethers';
import Link from 'next/link';
import { Timeline } from 'antd';

import { getDecimalOf, getSymbolOf } from '../../utils/tokens';
import { ZERO_ADDRESS } from '../../constant';
import { shortedWalletAccount } from '../../utils/index';
import { BidActionType } from '../../types/Bid.d';
import { MediaActionType } from '../../types/MediaLog.d';
import { isBackendAsk } from '../../utils/TypeGuards';
import { useERC20Single } from '../../hooks/useERC20Single';
import { Ask, AskActionType } from '../../types/Ask.d';
import {
  BidLogWithUser,
  MediaLogWithUser,
  isBidLogWithUser,
  isMediaLogWithUser,
} from '../../types/TokenLog.dto';

interface Props {
  log: Ask | MediaLogWithUser | BidLogWithUser;
  idx: number;
  timeline: Array<Ask | MediaLogWithUser | BidLogWithUser>;
  creator: string;
}

const TimeLineItem = ({ log, idx, timeline, creator }: Props) => {
  // token profile
  const { tokenProfile } = useERC20Single(log ? (log as Ask).currency : '');

  // 时间轴 时间
  const timelineDate = (timestamp: number) => {
    dayjs.extend(relativeTime);
    return dayjs(timestamp * 1000).fromNow();
  };

  // let me demo you how to use the typeguard for better code
  const timeDescription = (log: Ask | MediaLogWithUser | BidLogWithUser) => {
    // now, log types narrowed down to Ask | BidLogWithUser, they share the `currency` property
    const symbol = tokenProfile.symbol;
    const decimal = tokenProfile.decimals;

    // use if and return
    if (isMediaLogWithUser(log)) {
      // here, log is type `MediaLog`
      if (log.type === MediaActionType.Transfer) {
        return (
          <p className='logs'>
            {log.fromUser?.nickname || shortedWalletAccount(log.from)} Transfer
            the ownership to{' '}
            {log.toUser?.nickname || shortedWalletAccount(log.to)}
          </p>
        );
      } else {
        return (
          <p className='logs'>
            {log.fromUser?.nickname || shortedWalletAccount(log.from)} Approve
            {log.toUser?.nickname || shortedWalletAccount(log.to)} to manage the
            token.
          </p>
        );
      }
    }

    if (isBackendAsk(log)) {
      if (log.type === AskActionType.AskCreated) {
        return (
          <p className='logs'>
            {log?.who.username ? (
              <a
                target='_blank'
                href={`/${log?.who.username}`}
                rel='noreferrer'>
                {log?.who.username}
              </a>
            ) : (
              'Owner'
            )}{' '}
            Ask for {utils.formatUnits(log.amount, decimal)} {symbol}
          </p>
        );
      }
    }

    if (isBidLogWithUser(log)) {
      const bidderDisplayName = log.matchedBidder
        ? '@' + log.matchedBidder.username
        : shortedWalletAccount(log.bidder);
      const thePrice = `${utils.formatUnits(log.amount, decimal)} ${symbol}`;
      if (log.status === BidActionType.BidFinalized) {
        return (
          <p className='logs'>
            <a
              href={
                log.matchedBidder
                  ? `${process.env.NEXT_PUBLIC_SCAN_PREFIX}/${log.matchedBidder?.username}`
                  : '#'
              }>
              {bidderDisplayName}
            </a>{' '}
            buy with {thePrice}
          </p>
        );
      }
    }

    return 'Other';
  };

  return (
    <>
      {idx === timeline.length - 1 &&
      (log as MediaLogWithUser).type === 'Transfer' &&
      (log as MediaLogWithUser).from === ZERO_ADDRESS ? (
        // mint logs
        <Timeline.Item>
          <p>
            <Link href={`/${creator}`}>
              <a target='_blank' className='username'>
                @{creator}
              </a>
            </Link>{' '}
            minted this media
          </p>
          <time>{timelineDate(log.at.timestamp)}</time>
        </Timeline.Item>
      ) : (
        <Timeline.Item key={idx}>
          {timeDescription(log)}
          <time>{timelineDate(log.at.timestamp)}</time>
        </Timeline.Item>
      )}
    </>
  );
};

export default TimeLineItem;
