import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'antd';

const StyledWrapper = styled.div`
  width: 100%;
  height: 648px;
  @media screen and (max-width: 768px) {
    height: 160px;
  }
`;
const StyledItem = styled.div`
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Banner = () => {
  return (
    <StyledWrapper>
      <Carousel autoplay>
        <StyledItem>
          <img src='https://placeimg.com/700/300/arch' alt='collect' />
        </StyledItem>
        <StyledItem>
          <img src='https://placeimg.com/700/300/arch' alt='collect' />
        </StyledItem>
        <StyledItem>
          <img src='https://placeimg.com/700/300/arch' alt='collect' />
        </StyledItem>
        <StyledItem>
          <img src='https://placeimg.com/700/300/arch' alt='collect' />
        </StyledItem>
      </Carousel>
    </StyledWrapper>
  );
};
export default Banner;
