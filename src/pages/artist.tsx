import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Carousel, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { listUsersArtist } from '../backend/user';
import { User } from '../types/User.types.d';
import { isEmpty } from 'lodash';

const Artist: React.FC = () => {
  const [artistList, setArtistList] = useState<Array<User>>([]);
  const [artistWordList, setArtistWordList] = useState<Array<User>>([]);

  // 获取用户 艺术家数据
  const fetchUserArtist = async () => {
    try {
      const data: Array<User> = await listUsersArtist();
      console.log('listUsersArtist', data);
      setArtistWordList(data);

      // 不足四个
      if (data.length < 4) {
        let len = 4 - data.length;
        let list: User = Object.assign({}, data[0]);
        let arr = data.slice(0);
        for (let i = 0; i < len; i++) {
          arr.push(list);
        }
        console.log('arr', arr);
        setArtistList(arr);
      } else {
        setArtistList(data.slice(0, 4));
      }
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
    }
  };

  const artistWord = useMemo(() => {
    let list: any = {};
    for (let i = 10; i < 36; i++) {
      //   console.log(i.toString(36))
      list[i.toString(36)] = [];
    }
    list['#'] = [];

    artistWordList.forEach(i => {
      let key = i.username.substr(0, 1).toLocaleLowerCase();
      if (list[key]) {
        list[key].push(i);
      } else {
        list['#'].push(i);
      }
    });

    for (const key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        const element = list[key];
        if (isEmpty(element)) {
          delete list[key];
        }
      }
    }

    return list;
  }, [artistWordList]);

  useEffect(() => {
    fetchUserArtist();
  }, []);

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
    <StyledWrapper>
      <StyledHead>
        <StyledHeadTitle>Featured Artists</StyledHeadTitle>
      </StyledHead>
      <StyledBanner>
        <Carousel {...settings}>
          <div>
            <StyledAbout>
              {artistList.map((i, idx) => (
                <Link key={idx} href={`/${i.username}`}>
                  <a className='box' target='_blank'>
                    {i.avatar ? (
                      <img src={i.avatar} alt={i.nickname || i.username} />
                    ) : null}
                  </a>
                </Link>
              ))}
            </StyledAbout>
          </div>
          <div>
            <StyledAbout>
              {artistList.map((i, idx) => (
                <Link key={idx} href={`/${i.username}`}>
                  <a className='box' target='_blank'>
                    {i.avatar ? (
                      <img src={i.avatar} alt={i.nickname || i.username} />
                    ) : null}
                  </a>
                </Link>
              ))}
            </StyledAbout>
          </div>
        </Carousel>
      </StyledBanner>
      <StyledLine></StyledLine>
      <StyledWord>
        {Object.keys(artistWord).map((key, idx) => (
          <ul key={idx} className='item'>
            <li>
              <h3>{key.toLocaleUpperCase()}</h3>
            </li>
            {artistWord[key].map(
              (i: { username: string; nickname: string }, idx: number) => (
                <li key={idx}>
                  <Link href={`/${i.username}`}>
                    <a>
                      {i.username}({i.nickname})
                    </a>
                  </Link>
                </li>
              )
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
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  color: #333333;
  line-height: 58px;
  padding: 0;
  margin: 0;
`;
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
  @media screen and (max-width: 768px) {
    column-count: 2;
  }
  .item {
    /* 防止多列布局，分页媒体和多区域上下文中的意外中断 */
    break-inside: avoid;
    padding: 48px 0 0 0;
    list-style: none;
    li {
      margin: 9px 0;
      font-family: 'Playfair Display', serif;
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
    border: 1px solid rgba(0, 0, 0, 0.2);
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
  @media screen and (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    .box {
      height: 134px;
    }
  }
`;
export default Artist;
