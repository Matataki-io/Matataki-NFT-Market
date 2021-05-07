import React from 'react';
import styled from 'styled-components';
import { Article } from '../../types/article';
import moment from 'moment';

const CommunityCard: React.FC<{ article: Article }> = ({ article: post }) => {
  const { updatedAt, title, intro, cover } = post;
  return (
    <StyledWrapper>
      <StyledCover>
        {cover ? <img src={cover} alt='cover' /> : null}
      </StyledCover>
      <StyledInfo>
        <StyledTime>
          {moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')}
        </StyledTime>
        <StyledTitle>{title}</StyledTitle>
        <Styleddescription>{intro}</Styleddescription>
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
const StyledInfo = styled.div`
  overflow: hidden;
`;
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
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
