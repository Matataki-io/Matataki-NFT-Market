import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useMount } from 'ahooks';
import { message } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import Creators from '../components/Creators';
import About from '../components/About';
import NFT from '../components/NFTSimple';
import { NFTProps } from '../../next-env';
import BannerComponents from '../components/Banner';
import { Media, MediaMetadata } from '../types/Media.entity';
import { getMediaList } from '../backend/media';
import { getArticlesRecommed } from '../backend/article';
import { userTopArtist } from '../backend/user';
import { User } from '../types/User.types';
import { Article } from '../types/Article';
import { getBanners } from '../backend/bannner';
import { Banner } from '../types/banner';

const Home: React.FC<void> = () => {
  // Banner
  const [BannerData, setBannerData] = useState<Array<Banner>>([]);
  // NFT
  const [NFTList, setNFTList] = useState<Array<NFTProps>>([]);
  // creators
  const [creatorsList, setCreatorsList] = useState<Array<User>>([]);
  // article list
  const [articleList, setArticleList] = useState<Array<Article>>([]);

  // 获取Banner
  const fetchBanner = async (): Promise<void> => {
    try {
      const res = await getBanners();
      if (res.status === 200) {
        setBannerData(res.data);
      } else {
        throw new Error('faild');
      }
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
    }
  };
  // 获取NFT数据
  const fetchNFTData = async (): Promise<void> => {
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
        tags: i.tags,
      }));
      setNFTList(list);
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
    }
  };
  // 获取用户 艺术家数据
  const fetchUserTopArtist = async (): Promise<void> => {
    try {
      const res = await userTopArtist();
      if (res.status !== 200) {
        throw new Error('status is not 200');
      }
      let { data } = res.data;
      setCreatorsList(data);
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
    }
  };
  // fetch article
  const fetchArticle = async (): Promise<void> => {
    try {
      const res = await getArticlesRecommed();
      if (res.status === 200) {
        setArticleList(res.data);
      } else {
        throw new Error('faild');
      }
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
    }
  };

  useEffect(() => {
    fetchBanner();
    fetchNFTData();
    fetchUserTopArtist();
    fetchArticle();
  }, []);

  useMount(() => {});

  return (
    <StyledWrapper>
      <BannerComponents data={BannerData}></BannerComponents>
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
                <NFT {...i} />
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
          {creatorsList.map((i: any, idx: number) => (
            <Link href={`/${i.username}`} key={idx}>
              <a target='_blank'>
                <Creators {...i}></Creators>
              </a>
            </Link>
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
  @media screen and (max-width: 768px) {
    &.creators {
      margin-top: 20px;
    }
    &.about {
      margin-top: 20px;
    }
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
  grid: repeat(1, 1fr) / repeat(2, 1fr);
  grid-row-gap: 48px;
  grid-column-gap: 80px;
  margin-top: 48px;
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-row-gap: 20px;
    grid-column-gap: 0;
  }
  & > a {
    width: 100%;
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
  @media screen and (max-width: 576px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
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
