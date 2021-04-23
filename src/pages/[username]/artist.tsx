import React from 'react';
import styled from 'styled-components';
import { Avatar, Carousel } from 'antd';
import Link from 'next/link';
import { UserOutlined } from '@ant-design/icons';
import { ReactSVG } from 'react-svg';

import IconTelegram from '../../assets/icons/telegram.svg';
import IconTwitter from '../../assets/icons/twitter.svg';
import IconEmail from '../../assets/icons/email1.svg';

const UserArtist: React.FC = () => {
  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadUser>
          <Avatar icon={<UserOutlined />} size={66} />
          <StyledHeadUserInfo>
            <h1>Username</h1>
            <p>{'' || 'Not...'}</p>
          </StyledHeadUserInfo>
        </StyledHeadUser>
      </StyledHead>
      <StyledLine></StyledLine>
      <StyledTitle>Presentation</StyledTitle>
      <StyledPresentations>
        <img src='https://placeimg.com/600/284/nature?t=1617247698083' alt='' />
      </StyledPresentations>
      <StyledLine></StyledLine>
      <StyledTitle>Artworks</StyledTitle>
      <StyledArtworks>
        <Carousel autoplay>
          <StyledArtworksItem>
            <div className='cover'>
              <img
                src='https://placeimg.com/400/344/nature?t=1617247698083'
                alt=''
              />
            </div>
            <p>45a Festa de la Verema d&apos;Alella</p>
            <p>© Phoebe Geber Attila 2021 </p>
          </StyledArtworksItem>
          <StyledArtworksItem>
            <div className='cover'>
              <img
                src='https://placeimg.com/400/344/nature?t=1617247698083'
                alt=''
              />
            </div>
            <p>45a Festa de la Verema d&apos;Alella</p>
            <p>© Phoebe Geber Attila 123123 </p>
          </StyledArtworksItem>
        </Carousel>
      </StyledArtworks>

      <StyledLine></StyledLine>
      <StyledTitle>About</StyledTitle>
      <StyledAbout>
        <StyledAboutContainer>
          <p className='about'>
            Since Kukje Gallery opened at the center of Seoul in 1982, it has
            been committed to presenting the work of the most current and
            significant Korean and international contemporary artists. The
            Gallery has established itself as a leading venue for showing works
            by major international artists such as Damien Hirst, Eva Hesse,
            Jean-Michel Basquiat, Joan Mitchell, Cy Twombly, Ed Ruscha, Joseph
            Beuys, Anselm Kiefer, Louise Bourgeois, Jenny Holzer, Candida Hofer,
            Bill Viola, Anish Kapoor, etc. The exhibitions provided the foremost
            rare opportunity for the Korean art audiences to encounter the works
            of world-renowned contemporary artists without going abroad.
            Recognizing the importance of promoting Korean artists abroad, Kukje
            Gallery participates annually in major art fairs such as Art Basel,
            Art Basel Miami Beach and The Armory Show. The Gallery first
            presented the most significant artworks by Korean artists alongside
            more recognizable works of high caliber by international artists.
            Consequently, the Korean artists as well as the Gallery have been
            successfully gaining wide exposure and receiving much attention from
            the non-Korean collectors. The Gallery has also been promoting
            Korean artists to non-commercial venues, using its solid network of
            museum curators and critics worldwide. Many of Korean artists who
            have been presented by Kukje Gallery have gone on to participate in
            international biennials and major art museum exhibitions. Kukje
            Gallery has an unmatched reputation in Korea for having introduced
            many of the most critically acclaimed international artists, and for
            supporting the most promising Korean artists. The Gallery continues
            to play a key role in developing the domestic art market and
            promoting Korean artists; as well as drawing the national audience’s
            attention to the currently international art world.
          </p>
        </StyledAboutContainer>
        <StyledAboutContainer>
          <div className='cover'>
            <img
              src='https://placeimg.com/540/184/nature?t=1617247698083'
              alt=''
            />
          </div>
          <p className='title'>Phoebe Geber Attila</p>
          <StyledAboutSocial>
            <ReactSVG className='icon' src={IconTelegram} />
            <span className='name'>@K1Gallery</span>
          </StyledAboutSocial>
          <StyledAboutSocial>
            <ReactSVG className='icon' src={IconTwitter} />
            <span className='name'>@K1Gallery</span>
          </StyledAboutSocial>
          <StyledAboutSocial>
            <ReactSVG className='icon' src={IconEmail} />
            <span className='name'>@K1Gallery</span>
          </StyledAboutSocial>
        </StyledAboutContainer>
      </StyledAbout>
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

const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  background: #dbdbdb;
`;
const StyledTitle = styled.p`
  font-size: 32px;
  font-family: BigCaslon-Medium, BigCaslon;
  font-weight: 500;
  color: #333333;
  line-height: 39px;
  padding: 0;
  margin: 24px 0 0 0;
`;

const StyledHead = styled.div`
  display: flex;
  align-items: cennter;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 48px 0;
`;
const StyledHeadUser = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;
const StyledHeadUserInfo = styled.div`
  margin: 0 0 0 15px;
  h1 {
    font-size: 34px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #333333;
    line-height: 1;
    padding: 0;
    margin: 0;
  }
  p {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 1.2;
    padding: 0;
    margin: 0;
  }
`;

const StyledPresentations = styled.div`
  height: 810px;
  margin-top: 64px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const StyledArtworks = styled.div`
  height: 790px;
  margin-top: 64px;
`;
const StyledArtworksItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  .cover {
    width: 904px;
    height: 720px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;
const StyledAbout = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 64px;
`;
const StyledAboutContainer = styled.div`
  flex: 1;
  &:nth-child(1) {
    margin-right: 24px;
  }
  &:nth-child(2) {
    margin-left: 24px;
  }
  .about {
    font-size: 16px;
    font-family: BigCaslon-Medium, BigCaslon;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    padding: 0;
    margin: 0;
  }
  .cover {
    width: 100%;
    height: 390px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .title {
    font-size: 24px;
    font-family: BigCaslon-Medium, BigCaslon;
    font-weight: 500;
    color: #333333;
    line-height: 28px;
    padding: 0;
    margin: 24px 0 0 0;
  }
`;
const StyledAboutSocial = styled.div`
  display: flex;
  align-items: center;
  margin-top: 24px;
  .icon {
    width: 20px;
    height: 20px;
    svg {
      font-size: 20px;
      color: #333333;
    }
  }
  .name {
    font-size: 16px;
    font-family: BigCaslon-Medium, BigCaslon;
    font-weight: 500;
    color: #333333;
    line-height: 19px;
    padding: 0;
    margin: 0 0 0 10px;
  }
`;
export default UserArtist;
