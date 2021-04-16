import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Timeline } from 'antd';
import { utils } from 'ethers';
import Link from 'next/link';

import { isBackendAsk } from '../../utils/TypeGuards';
import { getDecimalOf, getSymbolOf } from '../../utils/tokens';
import { Ask } from '../../types/Ask';
import { BidLog } from '../../types/Bid';
import { MediaLog } from '../../types/MediaLog';
import { ZERO_ADDRESS } from '../../constant';
import { shortedWalletAccount } from '../../utils/index';

interface Props {
  timeline: Array<Ask | MediaLog | BidLog>;
  creator: string;
}

const NFTTimeline: React.FC<Props> = ({ timeline, creator }) => {
  console.log('timeline', timeline);
  const timelineDate = (timestamp: number) => {
    dayjs.extend(relativeTime);
    return dayjs(timestamp * 1000).fromNow();
  };

  const timeDescription = (log: any) => {
    console.log('c', shortedWalletAccount);
    let type = log.type || log.status;
    const symbol = getSymbolOf(log.currency);
    const decimal = getDecimalOf(log.currency);
    if (type === 'AskCreated') {
      return (
        <p className='logs'>
          Bid {utils.formatUnits(log.amount, decimal)} {symbol}
        </p>
      );
    } else if (type === 'BidFinalized') {
      return (
        <p className='logs'>
          <a
            href={`${process.env.NEXT_PUBLIC_SCAN_PREFIX}/address/${log.bidder}`}>
            {shortedWalletAccount(log.bidder)}
          </a>{' '}
          buy with {utils.formatUnits(log.amount, decimal)} {symbol}
        </p>
      );
    } else {
      return 'Other';
    }
  };

  return (
    <StyledWrapper>
      <StyledHead>
        <StyledTitle>Provenance</StyledTitle>
      </StyledHead>
      <Timeline>
        {timeline.map((i: any, idx: number) => (
          <>
            {idx === timeline.length - 1 &&
            i.type === 'Transfer' &&
            i.from === ZERO_ADDRESS ? (
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
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #808080;
`;

export default NFTTimeline;
