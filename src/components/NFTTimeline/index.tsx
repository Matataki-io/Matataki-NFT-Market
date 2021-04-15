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
import { MediaLog } from '../../types/MediaLog';

// const timeline = [
//   {
//     id: 6,
//     type: 'AskCreated',
//     amount: '120000000000000000',
//     currency: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
//     at: {
//       blockNumber: 7988905,
//       timestamp: 1618456887,
//       txHash:
//         '0x124a53ce4ea90c37ede4054cca0918fd6110ae652194e3e4fd6bd64672935f9f',
//     },
//     mediaId: 22,
//   },
//   {
//     id: 5,
//     type: 'AskRemoved',
//     amount: '100000000000000000',
//     currency: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
//     at: {
//       blockNumber: 7988863,
//       timestamp: 1618456761,
//       txHash:
//         '0xd0bacdb7af9c39895ffaa7ebe509535df87b28ee66010df651fdd4bf872e0648',
//     },
//     mediaId: 22,
//   },
//   {
//     id: 4,
//     type: 'AskCreated',
//     amount: '100000000000000000',
//     currency: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
//     at: {
//       blockNumber: 7988811,
//       timestamp: 1618456605,
//       txHash:
//         '0xeec51a3f6745c809f131be09fde16ea2b23d1d1afbce3371f62b15cb24ea2df4',
//     },
//     mediaId: 22,
//   },
// ];

interface Props {
  timeline: Array<Ask | MediaLog>;
  creator: string;
}

const NFTTimeline: React.FC<Props> = ({ timeline, creator }) => {
  console.log('timeline', timeline);
  const timelineDate = (timestamp: number) => {
    dayjs.extend(relativeTime);
    return dayjs(timestamp * 1000).fromNow();
  };

  const timeDescription = (log: any) => {
    if (isBackendAsk(log)) {
      const symbol = getSymbolOf(log.currency);
      const decimal = getDecimalOf(log.currency);
      let description = '';
      if (log.type === 'AskCreated')
        description = `主人 定价为 ${utils.formatUnits(
          log.amount,
          decimal
        )} ${symbol}`;
      if (log.type === 'AskRemoved')
        description = `主人删除了 ${utils.formatUnits(
          log.amount,
          decimal
        )} ${symbol} 的定价`;
      return description;
    } else {
      const actionName = log.type === 'Approval' ? '授权' : '转让';
      const description = `${log.from} ${actionName}该 Token 给 ${log.to}`;
      return description;
    }
  };

  return (
    <StyledWrapper>
      <StyledHead>
        <StyledTitle>Provenance</StyledTitle>
      </StyledHead>
      <Timeline>
        {timeline.map((i: any, idx: number) => (
          <Timeline.Item key={idx}>
            <p>{i.type}</p>
            <p>{timeDescription(i)}</p>
            <time>{timelineDate(i.at.timestamp)}</time>
          </Timeline.Item>
        ))}
        <Timeline.Item>
          <p>
            <Link href={`/${creator}`}>
              <a target='_blank' className='username'>
                @{creator}
              </a>
            </Link>{' '}
            minted this media
          </p>
        </Timeline.Item>
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
