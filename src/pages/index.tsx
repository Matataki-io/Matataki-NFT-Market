import { Button, ButtonDropdown, Divider, Grid, Text, Tooltip } from '@geist-ui/react'
import Banner from '../components/Banner';
import styled from 'styled-components';

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
  font-family: Playlist-Script, Playlist;
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
const StyledAboutComponents = styled.div`
  .cover {
    width: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  p {
    font-size: 20px;
    font-family: BigCaslon-Medium, BigCaslon;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    padding: 0;
    margin: 16px 0 0 0;
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
    &:nth-of-type(1) {
    }
    &:nth-of-type(2) {
    }
    &:nth-of-type(3),
    &:nth-of-type(4) {
    }
  }
`

const StyledCreatorsComponents = styled.div`
  .cover {
    height: 184px;
    position: relative;
    &-bc {
      width: calc(100% - 122px);
      height: 100%;
      margin-left: 122px;
      }
      .avatar-box {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 184px;
        height: 184px;
        &::after {
          content: "";
          display: block;
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(180deg ,#fd9d00,#fa6400);
          z-index: 1;
          /* animation: _rotate-data-v-8cb9f5fa 3s linear infinite; */
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
        }
      }
      .avatar {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
        border: 4px solid #fff;
        z-index: 2;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    p {
      font-size: 20px;
      font-family: BigCaslon-Medium, BigCaslon;
      font-weight: 500;
      color: #333333;
      line-height: 24px;
      padding: 0;
      margin: 24px 0 0 0;
    }
`

export default function NFTsList() {

  const AboutComponents = () => {
    return (
      <StyledAboutComponents>
        <div className="cover">
          <img src="https://placeimg.com/1280/720/arch/grayscale" alt="About" />
        </div>
        <p>How to collect your favorite NFTs at NFT Market?</p>
      </StyledAboutComponents>
    )
  }

  const CreatorsComponents = () => {
    return (
      <StyledCreatorsComponents>
        <div className="cover">
          <img className="cover-bc" src="https://placeimg.com/1280/720/arch/grayscale" alt="About" />
          <div className="avatar-box">
            <div className="avatar">
              <img src="https://placeimg.com/1280/720/arch/grayscale" alt="Avatar" />
            </div>
          </div>
        </div>
        <p>@Skull Pedestal</p>
      </StyledCreatorsComponents>
    )
  }

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
          <div className="box"><CreatorsComponents></CreatorsComponents></div>
          <div className="box"><CreatorsComponents></CreatorsComponents></div>
          <div className="box"><CreatorsComponents></CreatorsComponents></div>
          <div className="box"><CreatorsComponents></CreatorsComponents></div>
        </StyledCreators>
      </StyledModule>

      <StyledModule className="about">
        <StyledModuleHead>
          <StyledTitle>Learn More about NFT Market<span>Fun</span></StyledTitle>
          <span className="more">VIEW MORE</span>
        </StyledModuleHead>
        <StyledAbout>
          <div className="box">
            <AboutComponents></AboutComponents>
          </div>
          <div className="box">
            <AboutComponents></AboutComponents>
          </div>
          <div className="box">
            <AboutComponents></AboutComponents>
          </div>
          <div className="box">
            <AboutComponents></AboutComponents>
          </div>
        </StyledAbout>
      </StyledModule>
    </StyledWrapper>
  )
}
