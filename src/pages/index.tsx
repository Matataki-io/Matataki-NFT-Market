import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useMount } from 'ahooks';
import { Spin, message } from 'antd';
import { RightOutlined } from '@ant-design/icons';

import Creators from '../components/Creators';
import About from '../components/About';
import NFT from '../components/NFTSimple';
import { NFTProps } from '../../next-env';
import Banner from '../components/Banner';
import { PaginationResult } from '../types/PaginationResult';
import { Media, MediaMetadata } from '../types/Media.entity';
import {
  getHotMediaList,
  getMediaMetadata,
  getMediaList,
} from '../backend/media';
import { getArticles } from '../backend/article';
import { listUsersArtist } from '../backend/user';
import { User } from '../types/User.types.d';
import { Article } from '../types/Article.d';

type PaginationMeta = PaginationResult['meta'];

type MediaWithMetadata = Media & {
  metadata: MediaMetadata;
};

const Home: React.FC<void> = () => {
  // 更多 NFT
  const [NFTList, setNFTList] = useState<Array<NFTProps>>([]);
  const [creatorsList, setCreatorsList] = useState<Array<User>>([]);
  const [articleList, setArticleList] = useState<Array<Article>>([]);

  // 获取NFT数据
  const fetchNFTData = async () => {
    try {
      const mediaList = await getMediaList(1, 8);
      console.log('mediaList', mediaList);
      const list: Array<NFTProps> = mediaList.items.map(i => ({
        id: i.id,
        type: 'image',
        content: {
          low: i.tokenURI,
          stream: i.tokenURI,
          medium: i.tokenURI,
          high: i.tokenURI,
          thumbnail: i.tokenURI,
        },
        title: i.title,
        owner: i.owner,
        creator: i.creator,
      }));
      setNFTList(list);
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
    }
  };
  // 获取用户 艺术家数据
  const fetchUserArtist = async () => {
    try {
      const data: Array<User> = await listUsersArtist();
      console.log('listUsersArtist', data);
      // 不足四个
      if (data.length < 4) {
        let len = 4 - data.length;
        let list: User = Object.assign({}, data[0]);
        let arr = data.slice(0);
        for (let i = 0; i < len; i++) {
          arr.push(list);
        }
        setCreatorsList(arr);
      } else {
        setCreatorsList(data.slice(0, 4));
      }
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
    }
  };
  const fetchArticle = async () => {
    try {
      const res: any = await getArticles({
        page: 1,
        limit: 4,
      });
      console.log('getArticles', res);
      if (res.status === 200) {
        setArticleList(res.data.items);
      } else {
        throw new Error('faild');
      }
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
    }
  };

  useEffect(() => {
    fetchNFTData();
    fetchUserArtist();
    fetchArticle();
  }, []);

  useMount(() => {});

  return (
    <StyledWrapper>
      <Banner></Banner>
      <StyledModule className='nfts'>
        <StyledModuleHead>
          <StyledTitle>
            NFTs<span>New</span>
          </StyledTitle>
          <Link href='/market'>
            <a target='_blank' className='more'>
              VIEW MORE
              <RightOutlined />
            </a>
          </Link>
        </StyledModuleHead>
        <StyledNfts>
          {NFTList.map((i, idx) => (
            // 这里有报错
            // Warning: validateDOMNesting(...): <a> cannot appear as a descendant of <a>.
            <Link href={`/p/${i.id}`} key={idx}>
              <a target='_blank'>
                <NFT {...i}></NFT>
              </a>
            </Link>
          ))}
        </StyledNfts>
      </StyledModule>
      <StyledModule className='creators'>
        <StyledModuleHead>
          <StyledTitle>
            Top NFT Creators<span>Hot</span>
          </StyledTitle>
          <Link href='/artist'>
            <a target='_blank' className='more'>
              VIEW MORE
              <RightOutlined />
            </a>
          </Link>
        </StyledModuleHead>
        <StyledCreators>
          {creatorsList.map((i, idx) => (
            <Creators
              key={idx}
              bc={i.avatar}
              avatar={i.avatar}
              username={i.nickname || i.username}></Creators>
          ))}
        </StyledCreators>
      </StyledModule>

      <StyledModule className='about'>
        <StyledModuleHead>
          <StyledTitle>
            Learn More about NFT Market<span>Fun</span>
          </StyledTitle>
          <Link href='/community'>
            <a target='_blank' className='more'>
              VIEW MORE
              <RightOutlined />
            </a>
          </Link>
        </StyledModuleHead>
        <StyledAbout>
          {articleList.map((i, idx) => (
            <div key={idx} className='box'>
              <About
                img={i.cover}
                text={i.title}
                link={`/community/${i.id}`}></About>
            </div>
          ))}
        </StyledAbout>
      </StyledModule>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1480px;
  padding: 0 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const StyledTitle = styled.h3`
  font-size: 32px;
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  color: #333333;
  line-height: 1.2;
  padding: 0;
  margin: 0;
  position: relative;
  span {
    position: absolute;
    top: -10px;
    font-size: 24px;
    font-weight: normal;
    color: #f4cf1f;
    line-height: 37px;
  }
  @media screen and (max-width: 768px) {
    font-size: 18px;
    span {
      font-size: 12px;
    }
  }
`;

const StyledModule = styled.div`
  .empty {
    height: 800px;
    background-color: #f1f1f1;
  }

  &.nfts {
    /* margin-top: 46px; */
  }
  &.creators {
    margin-top: 100px;
  }
  &.about {
    margin-top: 100px;
  }
`;

const StyledModuleHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  margin: 20px 0;
  .more {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
  }
  @media screen and (max-width: 768px) {
    .more {
      font-size: 12px;
    }
  }
`;
const StyledAbout = styled.div`
  display: grid;
  grid: repeat(2, 1fr) / repeat(4, 1fr);
  grid-row-gap: 22px;
  grid-column-gap: 24px;
  margin-top: 48px;
  .box {
    width: 100%;
    height: 100%;
    /* background: red; */
    &:nth-of-type(1) {
      grid-row: 1 / 3;
      grid-column: 1 / 3;
      .cover {
        height: 342px;
      }
    }
    &:nth-of-type(2) {
      grid-row: 1 / 3;
      grid-column: 3 / 4;
      .cover {
        height: 342px;
      }
    }
    &:nth-of-type(3),
    &:nth-of-type(4) {
      .cover {
        height: 128px;
      }
    }
  }
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    .box {
      .cover {
        height: 120px !important;
      }
    }
  }
`;

const StyledCreators = styled.div`
  display: grid;
  grid: repeat(2, 1fr) / repeat(2, 1fr);
  grid-row-gap: 48px;
  grid-column-gap: 80px;
  margin-top: 48px;
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const StyledNfts = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(4, minmax(0px, 330px));
  gap: 30px 20px;
  margin: 48px auto 0;
  min-height: 320px;
  @media screen and (max-width: 1366px) {
    grid-template-columns: repeat(3, minmax(0px, 330px));
  }
  @media screen and (max-width: 1140px) {
    grid-template-columns: repeat(2, minmax(0px, 330px));
  }
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .loading-container {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
  & > a {
    height: 456px;
    width: 100%;
  }
`;

export default Home;
