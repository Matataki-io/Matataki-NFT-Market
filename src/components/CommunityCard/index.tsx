import React from 'react';
import styled from 'styled-components';

const CommunityCard: React.FC = () => {
  return (
    <StyledWrapper>
      <StyledCover>
        <img src='https://placeimg.com/540/184/nature?t=1617247698083' alt='' />
      </StyledCover>
      <StyledInfo>
        <StyledTime>Apr 08</StyledTime>
        <StyledTitle>
          How to collect your favorite NFTs at Maven NFT?
        </StyledTitle>
        <Styleddescription>
          Wonder how much your art or object might be worth and how to sell it?
          Simply follow the steps below and our specialists will review your
          submission at no cost and provide preliminary estimates for items that
          can be included in our sales in 5 to 7 business days blah blah blah
          blah blah blah blah blah blah blah blah blah blah blah blah blah blah
          blah blah blah blah blah blah blah blah blah blah blah blah blah blah
          blah blah blah blah blah blah blah blah blah blah blah blah blah blah
          blah blah blah blah blah blah blah blah blah blah blah blah blah blah
          blah blah blah blah blah blah blah blah blah blah bla
        </Styleddescription>
      </StyledInfo>
    </StyledWrapper>
  );
};
const StyledWrapper = styled.div`
  display: flex;
  align-items: stretch;
`;
const StyledCover = styled.div`
  flex: 0 0 342px;
  width: 342px;
  height: 192px;
  overflow: hidden;
  margin-right: 24px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const StyledInfo = styled.div``;
const StyledTime = styled.time`
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #777777;
  line-height: 20px;
`;
const StyledTitle = styled.p`
  font-size: 24px;
  font-family: BigCaslon-Medium, BigCaslon;
  font-weight: 500;
  color: #333333;
  line-height: 28px;
  padding: 0;
  margin: 8px 0 24px;
`;
const Styleddescription = styled.p`
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 24px;
  padding: 0;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
export default CommunityCard;
