import { Button, ButtonDropdown, Divider, Grid, Text, Tooltip } from '@geist-ui/react'
import Banner from '../components/Banner';
import styled from 'styled-components';

import Creators from '../components/Creators';
import About from '../components/About';

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
`

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
  font-family: Playlist-Script, Playlist, 'Dancing Script', cursive;;
  font-weight: normal;
  color: #F4CF1F;
  line-height: 37px;
}
`

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

`

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
`
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
`


const StyledCreators = styled.div`
  display: grid;
  grid: repeat(2, 1fr) / repeat(2, 1fr);
  grid-row-gap: 48px;
  grid-column-gap: 80px;
  margin-top: 48px;
  .box {
    width: 100%;
    height: 100%;
    /* background: red; */
  }
`

export default function NFTsList() {

  // 作家列表
  const creatorsList = [
    {
      bc: 'https://placeimg.com/540/184/nature?t=1617247698083',
      avatar: 'https://placeimg.com/200/200/people',
      username: '@Skull Pedestal'
    },
    {
      bc: 'https://placeimg.com/540/184/nature',
      avatar: 'https://placeimg.com/200/200/people?t=1617247587231',
      username: '@Skull Pedestal'
    },
    {
      bc: 'https://placeimg.com/540/184/nature?t=1617247711431',
      avatar: 'https://placeimg.com/200/200/people?t=1617247595366',
      username: '@Skull Pedestal'
    },
    {
      bc: 'https://placeimg.com/540/184/nature?t=1617247718870',
      avatar: 'https://placeimg.com/200/200/people?t=1617247602577',
      username: '@Skull Pedestal'
    }
  ]

  // 关于更多 NFT
  const AboutNFT = [
    {
      img: 'https://placeimg.com/700/340/arch',
      text: 'How to collect your favorite NFTs at NFT Market?',
      link: 'https://matataki.io'
    },
    {
      img: 'https://placeimg.com/700/340/arch?t=1617248569810',
      text: 'Collecting NFTs is more easier then you think,it’s only 3 steps to collect them!',
      link: 'https://matataki.io'
    },
    {
      img: 'https://placeimg.com/700/340/arch?t=1617248576772',
      text: 'NFTs, explained: what they are,why are some worth millions?',
      link: 'https://matataki.io'
    },
    {
      img: 'https://placeimg.com/700/340/arch?t=1617248585076',
      text: 'How to make, buy and sell NFTs',
      link: 'https://matataki.io'
    }
  ]

  return (
    <StyledWrapper>
      <Banner></Banner>
      <StyledModule className="nfts">
        <StyledModuleHead>
          <StyledTitle>Upcoming NFTs<span>New</span></StyledTitle>
          <span className="more">VIEW MORE</span>
        </StyledModuleHead>
        <div className="empty"></div>
      </StyledModule>

      <StyledModule className="creators">
        <StyledModuleHead>
          <StyledTitle>Top NFT Creators<span>Hot</span></StyledTitle>
          <span className="more">VIEW MORE</span>
        </StyledModuleHead>
        <StyledCreators>
          {
            creatorsList.map(i => (
              <div className="box"><Creators bc={ i.bc } avatar={ i.avatar } username= { i.username }></Creators></div>
            ))
          }
        </StyledCreators>
      </StyledModule>

      <StyledModule className="about">
        <StyledModuleHead>
          <StyledTitle>Learn More about NFT Market<span>Fun</span></StyledTitle>
          <span className="more">VIEW MORE</span>
        </StyledModuleHead>
        <StyledAbout>
        {
            AboutNFT.map(i => (
              <div className="box"><About img={ i.img } text={ i.text } link={ i.link }></About></div>
            ))
          }
        </StyledAbout>
      </StyledModule>
    </StyledWrapper>
  )
}
