import React from 'react';
import styled from 'styled-components';
import { Carousel, Image, Spin } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Media } from '../../types/Media.entity';

const ArtworksCarousel: React.FC<{ media?: Media[] }> = ({ media = [] }) => {
  const settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    arrows: true,
    adaptiveHeight: true,
    nextArrow: <RightOutlined />,
    prevArrow: <LeftOutlined />,
  };
  return (
    <Carousel {...settings}>
      {media &&
        media.map(x => (
          <div key={x.id}>
            <StyledArtworksItem>
              <div className='cover'>
                <Image src={x.tokenURI} alt='cover' />
              </div>
              <p className='title'>{x.title}</p>
              <p className='desc'>{x.description}</p>
            </StyledArtworksItem>
          </div>
        ))}
    </Carousel>
  );
};

const StyledArtworksItem = styled.div`
  display: flex !important;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  /* height: 792px; */

  .cover {
    width: 100%;
    max-height: 720px;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height: 100%;
      object-fit: contain;
    }

    @media screen and (max-width: 678px) {
      max-height: 240px;
    }
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
    padding: 0;
    margin: 24px 0 8px;
  }

  .desc {
    font-size: 14px;
    font-weight: 400;
    color: #b2b2b2;
    line-height: 20px;
    padding: 0;
    margin: 0;
  }
`;

export default ArtworksCarousel;
