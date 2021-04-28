import React from 'react';
import styled from 'styled-components';

const GalleryCard: React.FC = () => {
  return (
    <StyledWrapper>
      <StyledCover>
        <img src='https://placeimg.com/540/184/nature?t=1617247698083' alt='' />
      </StyledCover>
      <StyledTitle>K2 Gallery</StyledTitle>
      <Styleddescription>
        Jongno-gu Seoul, Republic of Korea | 119 works
      </Styleddescription>
    </StyledWrapper>
  );
};
const StyledWrapper = styled.div``;
const StyledCover = styled.div`
  width: 100%;
  height: 192px;
  overflow: hidden;
  border: 1px solid rgb(0 0 0 / 5%);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const StyledTitle = styled.p`
  font-size: 24px;
  font-family: BigCaslon-Medium, BigCaslon;
  font-weight: 500;
  color: #333333;
  line-height: 28px;
  padding: 0;
  margin: 24px 0 16px;
`;
const Styleddescription = styled.p`
  font-size: 14px;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: #777777;
  line-height: 20px;
  padding: 0;
  margin: 0;
`;
export default GalleryCard;
