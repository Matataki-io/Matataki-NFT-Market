import React from 'react';
import styled from 'styled-components';
import { Article } from '../../types/Article';
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
  @media screen and (max-width: 576px) {
    display: block;
  }
`;
const StyledCover = styled.div`
  flex: 0 0 342px;
  width: 342px;
  height: 192px;
  overflow: hidden;
  margin-right: 24px;
  @media screen and (max-width: 576px) {
    width: 100%;
    height: 160px;
    flex: 1;
    margin-right: 0;
  }
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
  font-weight: 400;
  color: #777777;
  line-height: 20px;
  @media screen and (max-width: 576px) {
    margin-top: 10px;
    display: inline-block;
  }
`;
const StyledTitle = styled.p`
  font-size: 24px;
  font-weight: 500;
  color: #333333;
  line-height: 1.2;
  padding: 0;
  margin: 10px 0 24px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  @media screen and (max-width: 576px) {
    margin: 10px 0 10px;
    font-size: 18px;
  }
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
  word-break: break-word;
  @media screen and (max-width: 576px) {
    font-size: 14px;
  }
`;
export default CommunityCard;
