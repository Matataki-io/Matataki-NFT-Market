import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { User } from '../../types/User.types.d';

interface Props {
  list: User[][];
}

const ArtistCarousel = ({ list }: Props) => {
  const settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    arrows: true,
    nextArrow: <RightOutlined />,
    prevArrow: <LeftOutlined />,
  };

  return (
    <StyledBanner>
      <Carousel {...settings}>
        {list.map((i: User[], idx: number) => (
          <div key={idx}>
            <StyledAbout>
              {i.map((j: User, idxItem: number) => (
                <Link key={idxItem} href={`/${j.username}`}>
                  <a className='box' target='_blank'>
                    {j.avatar ? (
                      <img src={j.avatar} alt={j.nickname || j.username} />
                    ) : null}
                  </a>
                </Link>
              ))}
            </StyledAbout>
          </div>
        ))}
      </Carousel>
    </StyledBanner>
  );
};

const StyledBanner = styled.div`
  /* height: 576px; */
  margin: 48px 0 64px;
  .ant-carousel .slick-prev,
  .ant-carousel .slick-next,
  .ant-carousel .slick-prev:hover,
  .ant-carousel .slick-next:hover {
    font-size: inherit;
    color: currentColor;
  }
  @media screen and (max-width: 576px) {
    margin: 20px 0 0;
  }
`;

const StyledAbout = styled.div`
  display: grid;
  grid: repeat(2, 1fr) / repeat(13, 1fr);
  grid-row-gap: 24px;
  grid-column-gap: 24px;
  height: 576px;
  .box {
    width: 100%;
    height: 100%;
    /* background: red; */
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.2);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    @media screen and (min-width: 576px) {
      &:nth-of-type(1) {
        grid-row: 1 / 3;
        grid-column: 1 / 6;
      }
      &:nth-of-type(2) {
        grid-row: 1 / 3;
        grid-column: 6 / 10;
      }
      &:nth-of-type(3) {
        grid-row: 1 / 2;
        grid-column: 10 / 14;
      }
      &:nth-of-type(4) {
        grid-row: 2 / 3;
        grid-column: 10 / 14;
      }
    }
  }
  @media screen and (max-width: 576px) {
    grid: repeat(2, 1fr) / repeat(2, 1fr);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    height: 340px;
    .box {
      height: 160px;
    }
  }
`;

export default ArtistCarousel;
