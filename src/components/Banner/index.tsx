import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'antd';
import { Banner } from '../../types/banner';
import Link from 'next/link';

interface Props {
  data: Banner[];
}

const BannerComponents: React.FC<Props> = ({ data }) => {
  return (
    <StyledWrapper>
      <Carousel autoplay autoplaySpeed={5000} dotPosition={'top'}>
        {data.map((i: Banner, idx: number) => (
          <Link key={idx} href={i.url}>
            <a target='_blank'>
              <StyledItem>
                <img src={i.image} alt={i.title} title={i.title} />
                <StyledItemText>
                  <p>{i.title}</p>
                </StyledItemText>
              </StyledItem>
            </a>
          </Link>
        ))}
      </Carousel>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  /* height: 648px; */
`;
const StyledItem = styled.div`
  width: 100%;
  height: 648px;
  position: relative;
  @media screen and (max-width: 768px) {
    height: 400px;
  }
  @media screen and (max-width: 576px) {
    height: 200px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const StyledItemText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  box-sizing: border-box;
  @media screen and (max-width: 768px) {
    padding: 10px;
  }

  p {
    color: #fff;
    line-height: 1.2;
    padding: 0;
    margin: 0;
    font-size: 26px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @media screen and (max-width: 768px) {
      font-size: 18px;
    }
    @media screen and (max-width: 576px) {
      font-size: 14px;
    }
  }
`;

export default BannerComponents;
