import React from 'react';
import styled from 'styled-components';
import { Carousel, Image } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { NFTProps } from '../../../next-env';
import Link from 'next/link';

interface Props {
  data: Array<string>;
  // data: Array<NFTProps>;
}

const ArtworksCarousel: React.FC<Props> = ({ data }) => {
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
      {/* {data
        ? data.map((i: NFTProps, idx: number) => (
            <Link key={idx} href={`/p/${i.id}`}>
              <a target='_blank'>
                <div>
                  <StyledArtworksItem>
                    <div className='cover'>
                      <img
                        src={i.content?.medium}
                        alt={i?.title}
                        title={i?.title}
                      />
                    </div>
                    <p className='title'>{i?.title}</p>
                    <p className='desc'>{i?.description}</p>
                  </StyledArtworksItem>
                </div>
              </a>
            </Link>
          ))
        : null} */}
      {data
        ? data.map((i: string, idx: number) => (
            <div key={idx}>
              <StyledArtworksItem>
                <div className='cover'>
                  <img src={i} alt={'Artwork'} title={'Artwork'} />
                </div>
              </StyledArtworksItem>
            </div>
          ))
        : null}
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
