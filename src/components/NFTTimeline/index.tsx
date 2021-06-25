import React from 'react';
import styled from 'styled-components';
import { Timeline } from 'antd';

import { Ask } from '../../types/Ask.d';
import { BidLogWithUser, MediaLogWithUser } from '../../types/TokenLog.dto';
import TimeLineItem from './TimelineItem';

interface Props {
  timeline: Array<Ask | MediaLogWithUser | BidLogWithUser>;
  creator: string;
}

const NFTTimeline: React.FC<Props> = ({ timeline, creator }) => {
  console.log('timeline', timeline);

  return (
    <StyledWrapper>
      <StyledHead>
        <StyledTitle>Provenance</StyledTitle>
      </StyledHead>
      <Timeline>
        {timeline.map((i, idx: number) => (
          <TimeLineItem
            key={idx}
            log={i}
            idx={idx}
            timeline={timeline}
            creator={creator}></TimeLineItem>
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
