import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'antd';
import { Banner } from '../../types/banner';

const StyledWrapper = styled.div`
  width: 100%;
  /* height: 648px; */
`;
const StyledItem = styled.div`
  width: 100%;
  height: 648px;
  @media screen and (max-width: 768px) {
    height: 160px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

interface Props {
  data: Banner[];
}

const BannerComponents: React.FC<Props> = ({ data }) => {
  return (
    <StyledWrapper>
      <Carousel autoplay autoplaySpeed={5000}>
        {data.map((i: Banner, idx: number) => (
          <StyledItem key={idx}>
            <img src={i.image} alt={i.title} />
          </StyledItem>
        ))}
      </Carousel>
    </StyledWrapper>
  );
};
export default BannerComponents;
