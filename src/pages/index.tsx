import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  ButtonDropdown,
  Divider,
  Grid,
  Text,
  Tooltip,
} from '@geist-ui/react';
import Banner from '../components/Banner';
import styled from 'styled-components';

import { NFTProps } from '../../next-env';

import Creators from '../components/Creators';
import About from '../components/About';
import NFT from '../components/NFT';

import InfiniteScroll from 'react-infinite-scroller';

export default function Home() {
  // 更多 NFT
  const [NFTList, setNFTList] = useState<Array<NFTProps>>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [hasMore, setHasMore] = useState<Boolean>(true);

  // 作家列表
  const creatorsList = [
    {
      bc: 'https://placeimg.com/540/184/nature?t=1617247698083',
      avatar: 'https://placeimg.com/200/200/people',
      username: '@Skull Pedestal',
    },
    {
      bc: 'https://placeimg.com/540/184/nature',
      avatar: 'https://placeimg.com/200/200/people?t=1617247587231',
      username: '@Skull Pedestal',
    },
    {
      bc: 'https://placeimg.com/540/184/nature?t=1617247711431',
      avatar: 'https://placeimg.com/200/200/people?t=1617247595366',
      username: '@Skull Pedestal',
    },
    {
      bc: 'https://placeimg.com/540/184/nature?t=1617247718870',
      avatar: 'https://placeimg.com/200/200/people?t=1617247602577',
      username: '@Skull Pedestal',
    },
  ];

  // 关于更多 NFT
  const AboutNFTList = [
    {
      img: 'https://placeimg.com/700/340/arch',
      text: 'How to collect your favorite NFTs at NFT Market?',
      link: 'https://matataki.io',
    },
    {
      img: 'https://placeimg.com/700/340/arch?t=1617248569810',
      text:
        'Collecting NFTs is more easier then you think,it’s only 3 steps to collect them!',
      link: 'https://matataki.io',
    },
    {
      img: 'https://placeimg.com/700/340/arch?t=1617248576772',
      text: 'NFTs, explained: what they are,why are some worth millions?',
      link: 'https://matataki.io',
    },
    {
      img: 'https://placeimg.com/700/340/arch?t=1617248585076',
      text: 'How to make, buy and sell NFTs',
      link: 'https://matataki.io',
    },
  ];

  // 获取NFT数据
  const fetchNFTData = useCallback(() => {
    const NFTListData: Array<NFTProps> = [
      {
        id: 2020,
        type: 'image', // type is image video audio text file url
        content: {
          low: 'https://placeimg.com/700/340/arch',
          medium: 'https://placeimg.com/700/340/arch',
          high: 'https://placeimg.com/700/340/arch',
          thumbnail: 'https://placeimg.com/700/340/arch',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 2024,
        type: 'image',
        content: {
          low:
            'https://ipfs.fleek.co/ipfs/bafybeifwauzh4mtqunlj2mnj3fusfod2kdq7rjf4y6epai7faahsc6gl6a',
          medium:
            'https://ipfs.fleek.co/ipfs/bafybeifwauzh4mtqunlj2mnj3fusfod2kdq7rjf4y6epai7faahsc6gl6a',
          high:
            'https://ipfs.fleek.co/ipfs/bafybeifwauzh4mtqunlj2mnj3fusfod2kdq7rjf4y6epai7faahsc6gl6a',
          thumbnail:
            'https://ipfs.fleek.co/ipfs/bafybeifwauzh4mtqunlj2mnj3fusfod2kdq7rjf4y6epai7faahsc6gl6a',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 1065,
        type: 'image',
        img:
          'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4', // 暂时先展示 img
        content: {
          low:
            'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
          medium:
            'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
          high:
            'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
          thumbnail:
            'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 2475,
        type: 'image',
        content: {
          low:
            'https://ipfs.fleek.co/ipfs/bafybeiedsxxcvdtx7nker4xrhgaex5encj6p5u3qlfzkloduusnodt76pu',
          medium:
            'https://ipfs.fleek.co/ipfs/bafybeiedsxxcvdtx7nker4xrhgaex5encj6p5u3qlfzkloduusnodt76pu',
          high:
            'https://ipfs.fleek.co/ipfs/bafybeiedsxxcvdtx7nker4xrhgaex5encj6p5u3qlfzkloduusnodt76pu',
          thumbnail:
            'https://ipfs.fleek.co/ipfs/bafybeiedsxxcvdtx7nker4xrhgaex5encj6p5u3qlfzkloduusnodt76pu',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 2085,
        type: 'image',
        content: {
          low:
            'https://ipfs.fleek.co/ipfs/bafybeigknh3nyru3rl5tqslctz52ymfulo3pzsz73ydojlkkpqxjb2shoe',
          medium:
            'https://ipfs.fleek.co/ipfs/bafybeigknh3nyru3rl5tqslctz52ymfulo3pzsz73ydojlkkpqxjb2shoe',
          high:
            'https://ipfs.fleek.co/ipfs/bafybeigknh3nyru3rl5tqslctz52ymfulo3pzsz73ydojlkkpqxjb2shoe',
          thumbnail:
            'https://ipfs.fleek.co/ipfs/bafybeigknh3nyru3rl5tqslctz52ymfulo3pzsz73ydojlkkpqxjb2shoe',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 2034,
        type: 'image',
        content: {
          low:
            'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
          medium:
            'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
          high:
            'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
          thumbnail:
            'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 2504,
        type: 'video',
        fields: {
          low: {
            stringValue:
              'https://stream.mux.com/sX001r6PlJeeGp5nhfr9FxDSrRfABMShhg2FWxDEWuKY/low.mp4',
          },
          stream: {
            stringValue:
              'https://stream.mux.com/sX001r6PlJeeGp5nhfr9FxDSrRfABMShhg2FWxDEWuKY.m3u8',
          },
          medium: {
            stringValue:
              'https://stream.mux.com/sX001r6PlJeeGp5nhfr9FxDSrRfABMShhg2FWxDEWuKY/medium.mp4',
          },
          high: {
            stringValue:
              'https://stream.mux.com/sX001r6PlJeeGp5nhfr9FxDSrRfABMShhg2FWxDEWuKY/high.mp4',
          },
          thumbnail: {
            stringValue:
              'https://image.mux.com/sX001r6PlJeeGp5nhfr9FxDSrRfABMShhg2FWxDEWuKY/thumbnail.png',
          },
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 2505,
        type: 'audio',
        content: {
          low:
            'https://ipfs.io/ipfs/bafybeih6ob427hktbl6xfzunyz4tjop4cwmhzhgp4zp5dd3jwa2fyfn264',
          medium:
            'https://ipfs.io/ipfs/bafybeih6ob427hktbl6xfzunyz4tjop4cwmhzhgp4zp5dd3jwa2fyfn264',
          high:
            'https://ipfs.io/ipfs/bafybeih6ob427hktbl6xfzunyz4tjop4cwmhzhgp4zp5dd3jwa2fyfn264',
          thumbnail:
            'https://ipfs.io/ipfs/bafybeih6ob427hktbl6xfzunyz4tjop4cwmhzhgp4zp5dd3jwa2fyfn264',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 2506,
        type: 'text',
        content: {
          low:
            'https://ipfs.fleek.co/ipfs/bafybeie2woanvrkua3zgzw7qifrbd46ksr45skjsny35bc542yik6cuizi',
          medium:
            'https://ipfs.fleek.co/ipfs/bafybeie2woanvrkua3zgzw7qifrbd46ksr45skjsny35bc542yik6cuizi',
          high:
            'https://ipfs.fleek.co/ipfs/bafybeie2woanvrkua3zgzw7qifrbd46ksr45skjsny35bc542yik6cuizi',
          thumbnail:
            'https://ipfs.fleek.co/ipfs/bafybeie2woanvrkua3zgzw7qifrbd46ksr45skjsny35bc542yik6cuizi',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 2505,
        type: 'file',
        content: {
          thumbnail:
            'https://ipfs.fleek.co/ipfs/bafybeibjhlwso6swp5gomkg75brvqpcmaai65wjskqpkvac2qolc6mw7hy',
          low:
            'https://ipfs.fleek.co/ipfs/bafybeibjhlwso6swp5gomkg75brvqpcmaai65wjskqpkvac2qolc6mw7hy',
          medium:
            'https://ipfs.fleek.co/ipfs/bafybeibjhlwso6swp5gomkg75brvqpcmaai65wjskqpkvac2qolc6mw7hy',
          high:
            'https://ipfs.fleek.co/ipfs/bafybeibjhlwso6swp5gomkg75brvqpcmaai65wjskqpkvac2qolc6mw7hy',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 2508,
        type: 'url',
        content: {
          thumbnail: 'https://matataki.io',
          low: 'https://matataki.io',
          medium: 'https://matataki.io',
          high: 'https://matataki.io',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 1065,
        type: 'image',
        content: {
          low:
            'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
          medium:
            'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
          high:
            'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
          thumbnail:
            'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
      {
        id: 5265,
        type: 'image',
        content: {
          low:
            'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
          medium:
            'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
          high:
            'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
          thumbnail:
            'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
          stream: '',
        },
        avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
        username: '@subtle-bubble',
        title: 'Scream Alone',
        time: Date.now(),
      },
    ];
    let list = NFTList.concat(NFTListData);
    setNFTList(list);
  }, [NFTList]);

  useEffect(() => {
    console.log('222');
    fetchNFTData();
  }, [fetchNFTData]);

  // 处理滚动Load
  const handleInfiniteOnLoad = async () => {
    setLoading(true);
    console.log('1111');
    if (NFTList.length > 60) {
      setLoading(false);
      setHasMore(false);
      return;
    }
    await fetchNFTData();
    setLoading(false);
  };

  return (
    <StyledWrapper>
      <Banner></Banner>
      <StyledModule className='nfts'>
        <StyledModuleHead>
          <StyledTitle>
            Upcoming NFTs<span>New</span>
          </StyledTitle>
          <span className='more'>VIEW MORE</span>
        </StyledModuleHead>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleInfiniteOnLoad}
          hasMore={!loading && hasMore}
          loader={
            <div className='loader' key={0}>
              Loading ...
            </div>
          }>
          <StyledNfts>
            {NFTList.map((i, idx) => (
              <NFT key={idx} {...i}></NFT>
            ))}
          </StyledNfts>
        </InfiniteScroll>
      </StyledModule>

      <StyledModule className='creators'>
        <StyledModuleHead>
          <StyledTitle>
            Top NFT Creators<span>Hot</span>
          </StyledTitle>
          <span className='more'>VIEW MORE</span>
        </StyledModuleHead>
        <StyledCreators>
          {creatorsList.map((i, idx) => (
            <Creators
              key={idx}
              bc={i.bc}
              avatar={i.avatar}
              username={i.username}></Creators>
          ))}
        </StyledCreators>
      </StyledModule>

      <StyledModule className='about'>
        <StyledModuleHead>
          <StyledTitle>
            Learn More about NFT Market<span>Fun</span>
          </StyledTitle>
          <span className='more'>VIEW MORE</span>
        </StyledModuleHead>
        <StyledAbout>
          {AboutNFTList.map((i, idx) => (
            <div key={idx} className='box'>
              <About img={i.img} text={i.text} link={i.link}></About>
            </div>
          ))}
        </StyledAbout>
      </StyledModule>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  max-width: 1480px;
  padding: 0 20px 200px;
  box-sizing: border-box;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const StyledTitle = styled.h3`
  font-size: 32px;
  font-family: BigCaslon-Medium, BigCaslon;
  font-weight: 500;
  color: #333333;
  line-height: 39px;
  padding: 0;
  margin: 0;
  position: relative;
  span {
    position: absolute;
    top: -10px;
    font-size: 24px;
    font-family: Playlist-Script, Playlist, 'Dancing Script', cursive;
    font-weight: normal;
    color: #f4cf1f;
    line-height: 37px;
  }
`;

const StyledModule = styled.h3`
  .empty {
    height: 800px;
    background-color: #f1f1f1;
  }

  &.nfts {
    margin-top: 46px;
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
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
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
`;

const StyledCreators = styled.div`
  display: grid;
  grid: repeat(2, 1fr) / repeat(2, 1fr);
  grid-row-gap: 48px;
  grid-column-gap: 80px;
  margin-top: 48px;
`;

const StyledNfts = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0px, 1fr));
  gap: 50px 30px;
  margin-top: 48px;
`;
