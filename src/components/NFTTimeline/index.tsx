import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Timeline } from 'antd';
import { utils } from 'ethers';
import Link from 'next/link';

import { isBackendAsk } from '../../utils/TypeGuards';
import { getDecimalOf, getSymbolOf } from '../../utils/tokens';
import { Ask, AskActionType } from '../../types/Ask.d';
import { ZERO_ADDRESS } from '../../constant';
import { shortedWalletAccount } from '../../utils/index';
import {
  BidLogWithUser,
  MediaLogWithUser,
  isBidLogWithUser,
  isMediaLogWithUser,
} from '../../types/TokenLog.dto';
import { BidActionType } from '../../types/Bid.d';
import { MediaActionType } from '../../types/MediaLog.d';

interface Props {
  timeline: Array<Ask | MediaLogWithUser | BidLogWithUser>;
  creator: string;
}

const NFTTimeline: React.FC<Props> = ({ timeline, creator }) => {
  console.log('timeline', timeline);
  const timelineDate = (timestamp: number) => {
    dayjs.extend(relativeTime);
    return dayjs(timestamp * 1000).fromNow();
  };

  // let me demo you how to use the typeguard for better code
  const timeDescription = (log: Ask | MediaLogWithUser | BidLogWithUser) => {
    console.log('c', shortedWalletAccount);

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
    // now, log types narrowed down to Ask | BidLogWithUser, they share the `currency` property
    const symbol = getSymbolOf(log.currency);
    const decimal = getDecimalOf(log.currency);
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
      const symbol = getSymbolOf(log.currency);
      const decimal = getDecimalOf(log.currency);
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
    <StyledWrapper>
      <StyledHead>
        <StyledTitle>Provenance</StyledTitle>
      </StyledHead>
      <Timeline>
        {timeline.map((i, idx: number) => (
          <>
            {idx === timeline.length - 1 &&
            (i as MediaLogWithUser).type === 'Transfer' &&
            (i as MediaLogWithUser).from === ZERO_ADDRESS ? (
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
                <time>{timelineDate(i.at.timestamp)}</time>
              </Timeline.Item>
            ) : (
              <Timeline.Item key={idx}>
                {timeDescription(i)}
                <time>{timelineDate(i.at.timestamp)}</time>
              </Timeline.Item>
            )}
          </>
        ))}
      </Timeline>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  box-sizing: border-box;
  margin: 0px 0px 30px;
  min-width: 0px;
  padding: 20px 20px 0px;
  width: 100%;
  flex-direction: column;
  border-radius: 4px;
  border: 2px solid #f2f2f2;
  display: flex;
  .username {
    font-weight: 500;
    color: rgb(0, 0, 0);
    display: inline-block;
    cursor: pointer;
  }
  .logs {
    a {
      font-weight: 500;
      color: rgb(0, 0, 0);
      display: inline-block;
      cursor: pointer;
    }
  }
`;
const StyledHead = styled.div`
  box-sizing: border-box;
  margin: 0px 0px 15px;
  width: 100%;
`;
const StyledTitle = styled.h2`
  box-sizing: border-box;
  margin: 0px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #808080;
`;

export default NFTTimeline;
