import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const ArtworksCarousel: React.FC = () => {
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
      <div>
        <StyledArtworksItem>
          <div className='cover'>
            <img
              src='https://placeimg.com/1280/720/nature?t=1617247698083'
              alt=''
            />
          </div>
          <p className='title'>45a Festa de la Verema d&apos;Alella</p>
          <p className='desc'>© Phoebe Geber Attila 2021 </p>
        </StyledArtworksItem>
      </div>
      <div>
        <StyledArtworksItem>
          <div className='cover'>
            <img
              src='https://placeimg.com/300/300/nature?t=1617247698083'
              alt=''
            />
          </div>
          <p className='title'>45a Festa de la Verema d&apos;Alella</p>
          <p className='desc'>© Phoebe Geber Attila 123123 </p>
        </StyledArtworksItem>
      </div>
      <div>
        <StyledArtworksItem>
          <div className='cover'>
            <img
              src='https://placeimg.com/500/500/nature?t=1617247698083'
              alt=''
            />
          </div>
          <p className='title'>45a Festa de la Verema d&apos;Alella</p>
          <p className='desc'>© Phoebe Geber Attila 123123 </p>
        </StyledArtworksItem>
      </div>
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
  }
  .title {
    font-size: 16px;
    font-family: BigCaslon-Medium, BigCaslon;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
    padding: 0;
    margin: 24px 0 8px;
  }
  .desc {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #b2b2b2;
    line-height: 20px;
    padding: 0;
    margin: 0;
  }
`;

export default ArtworksCarousel;
