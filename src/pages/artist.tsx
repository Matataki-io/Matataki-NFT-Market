import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import {
  userFeaturedArtistInBanner,
  userFeaturedArtist,
} from '../backend/user';
import { User } from '../types/User.types.d';
import { wordItem } from '../utils/index';
import { WordItemState } from '../types/utiils.d';
import ArtistCarousel from '../components/ArtistPage/Carousel';
import Word from '../components/Word';

const Artist: React.FC = () => {
  // featured artist bannner
  const [artistList, setArtistList] = useState<User[][]>([]);
  // featured artist
  const [artistWordList, setArtistWordList] = useState<Array<User>>([]);

  // 获取 Featured Artists Banner 并且处理数据
  const userFeaturedArtistInBannerFn = async (): Promise<void> => {
    try {
      const res = await userFeaturedArtistInBanner();
      if (res.status !== 200) {
        throw new Error('status is not 200');
      }
      let { data } = res.data;
      // console.log('userFeaturedArtistInBanner', data);

      let list = [];
      let len = data.length;
      let n = 4;
      let lineNum = len % n === 0 ? len / n : Math.floor(len / n + 1);

      for (let i = 0; i < lineNum; i++) {
        let temp = data.slice(i * n, i * n + n);
        list.push(temp);
      }

      setArtistList(list);
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
    }
  };
  // 获取 Featured Artists 数据
  const userFeaturedArtistFn = async (): Promise<void> => {
    try {
      const res = await userFeaturedArtist();
      if (res.status !== 200) {
        throw new Error('status is not 200');
      }
      let { data } = res.data;
      // console.log('userFeaturedArtist', data);
      setArtistWordList(data);
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
    }
  };

  // 处理数据格式
  const artistWord: WordItemState = useMemo(() => {
    return wordItem(artistWordList);
  }, [artistWordList]);

  useEffect(() => {
    userFeaturedArtistInBannerFn();
    userFeaturedArtistFn();
  }, []);

  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadTitle>Featured Artists</StyledHeadTitle>
      </StyledHead>
      <ArtistCarousel list={artistList}></ArtistCarousel>
      <StyledLine />
      <Word list={artistWord}></Word>
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
  line-height: 1.2;
  padding: 0;
  margin: 0;
  @media screen and (max-width: 678px) {
    font-size: 30px;
  }
`;

const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  background: #dbdbdb;
`;

export default Artist;
