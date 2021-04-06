import React from 'react';
import styled from 'styled-components';

export interface MediaMarketInfoProps {
  value: number;
}

const MediaMarketInfo: React.FC<MediaMarketInfoProps> = ({ value }) => (
  <Container>
    <SmallLabel>Creator Share</SmallLabel>
    <LargeValue>{value}%</LargeValue>
  </Container>
);

const Container = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

const SmallLabel = styled.label`
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  line-height: 20px;
  margin-bottom: 5px;
  display: block;
`;

const LargeValue = styled.h2`
  font-weight: 500;
  font-size: 30px;
  margin-bottom: 30px;
  margin-top: 0;
`;

export default MediaMarketInfo;
