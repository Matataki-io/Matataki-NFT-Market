import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Artist: React.FC = () => {
  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadTitle>Featured Artists</StyledHeadTitle>
      </StyledHead>
      <StyledBanner></StyledBanner>
      <StyledLine></StyledLine>
      <StyledWord>
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
  margin: 48px 0 64px;
  height: 576px;
  background: #000;
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
export default Artist;
