import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Carousel } from 'antd';

// 关于更多 NFT
const AboutNFTList = [
  {
    img: 'https://placeimg.com/700/700/arch',
    text: 'How to collect your favorite NFTs at NFT Market?',
    link: 'https://matataki.io',
  },
  {
    img: 'https://placeimg.com/400/700/arch',
    text:
      'Collecting NFTs is more easier then you think,it’s only 3 steps to collect them!',
    link: 'https://matataki.io',
  },
  {
    img: 'https://placeimg.com/700/400/arch',
    text: 'NFTs, explained: what they are,why are some worth millions?',
    link: 'https://matataki.io',
  },
  {
    img: 'https://placeimg.com/700/400/arch',
    text: 'How to make, buy and sell NFTs',
    link: 'https://matataki.io',
  },
];

const Artist: React.FC = () => {
  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadTitle>Featured Artists</StyledHeadTitle>
      </StyledHead>
      <StyledBanner>
        <Carousel autoplay>
          <div>
            <StyledAbout>
              {AboutNFTList.map((i, idx) => (
                <Link key={idx} href='/'>
                  <a className='box'>
                    <img src={i.img} alt={i.text} />
                  </a>
                </Link>
              ))}
            </StyledAbout>
          </div>
          <div>
            <StyledAbout>
              {AboutNFTList.map((i, idx) => (
                <Link key={idx} href='/'>
                  <a className='box'>
                    <img src={i.img} alt={i.text} />
                  </a>
                </Link>
              ))}
            </StyledAbout>
          </div>
        </Carousel>
      </StyledBanner>
      <StyledLine></StyledLine>
      <StyledWord>
        {/* 需要合并组件 */}
        {[...new Array(26)].map((i, idx) => (
          <ul key={idx} className='item'>
            <li>
              <h3>{(idx + 10).toString(36).toLocaleUpperCase()}</h3>
            </li>
            {idx % 2 === 0 ? (
              <>
                <li>
                  <Link href='/'>
                    <a>Alicja Kwade</a>
                  </Link>
                </li>
                <li>
                  <Link href='/'>
                    <a>Alicja Kwade</a>
                  </Link>
                </li>
                <li>
                  <Link href='/'>
                    <a>Alicja Kwade</a>
                  </Link>
                </li>
                <li>
                  <Link href='/'>
                    <a>Alicja Kwade</a>
                  </Link>
                </li>
                <li>
                  <Link href='/'>
                    <a>Alicja Kwade</a>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href='/'>
                    <a>Alicja Kwade</a>
                  </Link>
                </li>
                <li>
                  <Link href='/'>
                    <a>Alicja Kwade</a>
                  </Link>
                </li>
                <li>
                  <Link href='/'>
                    <a>Alicja Kwade</a>
                  </Link>
                </li>
              </>
            )}
          </ul>
        ))}
      </StyledWord>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1480px;
  padding: 48px 20px 256px;
  box-sizing: border-box;
  margin: 0 auto;
`;
const StyledHead = styled.div``;
const StyledHeadTitle = styled.h2`
  font-size: 48px;
  font-family: BigCaslon-Medium, BigCaslon;
  font-weight: 500;
  color: #333333;
  line-height: 58px;
  padding: 0;
  margin: 0;
`;
const StyledBanner = styled.div`
  height: 576px;
  margin: 48px 0 64px;
`;
const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  background: #dbdbdb;
`;
const StyledWord = styled.div`
  column-count: 4;
  margin-top: 16px;
  column-gap: 20px;
  .item {
    /* 防止多列布局，分页媒体和多区域上下文中的意外中断 */
    break-inside: avoid;
    padding: 48px 0 0 0;
    list-style: none;
    li {
      margin: 9px 0;
      font-family: BigCaslon-Medium, BigCaslon;
      font-weight: 500;
      color: #333333;
      a {
        font-size: 16px;
        line-height: 19px;
        color: #333333;
        &:hover {
          text-decoration: underline;
        }
      }
      &:nth-child(1) {
        margin: 0;
      }
      &:nth-child(2) {
        margin-top: 16px;
      }
      h3 {
        font-size: 32px;
        line-height: 39px;
        padding: 0;
        margin: 0;
      }
    }
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
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
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
`;
export default Artist;
