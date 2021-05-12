import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'antd';
import { Banner } from '../../types/banner';
import Link from 'next/link';

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
          <Link key={idx} href={i.url}>
            <a target='_blank'>
              <StyledItem>
                <img src={i.image} alt={i.title} title={i.title} />
              </StyledItem>
            </a>
          </Link>
        ))}
      </Carousel>
    </StyledWrapper>
  );
};
export default BannerComponents;
