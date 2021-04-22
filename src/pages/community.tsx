import React from 'react';
import styled from 'styled-components';

import CommunityCard from '../components/CommunityCard';

const Community: React.FC = () => {
  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadTitle>Community</StyledHeadTitle>
      </StyledHead>
      <StyledItem>
        <CommunityCard></CommunityCard>
        <CommunityCard></CommunityCard>
        <CommunityCard></CommunityCard>
        <CommunityCard></CommunityCard>
      </StyledItem>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1480px;
  padding: 48px 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;
const StyledHead = styled.div``;
const StyledHeadTitle = styled.h2`
  font-size: 48px;
  font-family: BigCaslon-Medium, BigCaslon;
  font-weight: 500;
  color: #333333;
  line-height: 58px;
  padding: 0;
  margin: 0;
`;
const StyledItem = styled.div`
  & > div {
    margin: 48px 0;
  }
`;
export default Community;
