import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Avatar, Carousel, message, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { ReactSVG } from 'react-svg';
import { useRouter } from 'next/router';

import { UserInfoState } from '../../store/userInfoSlice';
import { getUser } from '../../backend/user';
import { useLogin } from '../../hooks/useLogin';
import IconTelegram from '../../assets/icons/telegram.svg';
import IconEmail from '../../assets/icons/email1.svg';
import IconTwitter from '../../assets/icons/twitter.svg';

const keyMessage = 'fetchUser';

const GalleryId: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const [userInfo, setUserInfo] = useState<UserInfoState>({
    avatar: '',
    nickname: '',
    username: '',
  });
  useEffect(() => {
    const fetchUserInfoData = async () => {
      if (typeof username !== 'string') return;
      try {
        const userInfo = await getUser(username as string);
        console.log('userInfo', userInfo);
        setUserInfo(userInfo);
      } catch (e) {
        let err = e.toString();
        console.log('e', e.toString());

        if (err.includes('status code 404')) {
          message.destroy(keyMessage);
          message.error({ content: 'No such user！', key: keyMessage });
          router.push('/');
        }
      }
    };

    fetchUserInfoData();
  }, []);

  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadUser>
          <Avatar icon={<UserOutlined />} src={userInfo.avatar} size={66} />
          <StyledHeadUserInfo>
            <h1>
              {userInfo.nickname}({userInfo.username})
            </h1>
            <p>{userInfo.bio || 'Not...'}</p>
          </StyledHeadUserInfo>
        </StyledHeadUser>
        <StyledHeadIcon>
          <ReactSVG className='icon' src={IconTelegram} />
          <ReactSVG className='icon' src={IconTwitter} />
          <ReactSVG className='icon' src={IconEmail} />
        </StyledHeadIcon>
      </StyledHead>
      <StyledLine></StyledLine>
      <StyledItem>
        <StyledItemTitle>Presentation</StyledItemTitle>
        <StyledVideo>
          <video
            src={
              'https://ipfs.fleek.co/ipfs/QmUDqKPSgRaGNjjDnJ89wWecpFzMGaiPcHZ76FsuepAD5Y'
            }
            loop
            playsInline
            // autoPlay
            // poster={'https://placeimg.com/1440/810/nature?t=1617247698083'}
            className='media-video'></video>
        </StyledVideo>
      </StyledItem>
      <StyledLine></StyledLine>
      <StyledItem>
        <StyledItemTitle>Artworks</StyledItemTitle>
        <StyledArtworks>
          <Carousel>
            <StyledArtworksItem>
              <div>
                <div className='cover'>
                  <img
                    src='https://placeimg.com/1280/720/nature?t=1617247698083'
                    alt=''
                  />
                </div>
                <p>45a Festa de la Verema d&apos;Alella</p>
                <p>© Phoebe Geber Attila 2021 </p>
              </div>
            </StyledArtworksItem>
            <StyledArtworksItem>
              <div>
                <div className='cover'>
                  <img
                    src='https://placeimg.com/300/300/nature?t=1617247698083'
                    alt=''
                  />
                </div>
                <p>45a Festa de la Verema d&apos;Alella</p>
                <p>© Phoebe Geber Attila 123123 </p>
              </div>
            </StyledArtworksItem>
            <StyledArtworksItem>
              <div>
                <div className='cover'>
                  <img
                    src='https://placeimg.com/500/500/nature?t=1617247698083'
                    alt=''
                  />
                </div>
                <p>45a Festa de la Verema d&apos;Alella</p>
                <p>© Phoebe Geber Attila 123123 </p>
              </div>
            </StyledArtworksItem>
          </Carousel>
        </StyledArtworks>
      </StyledItem>

      <StyledLine></StyledLine>
      <StyledItem>
        <StyledItemTitle>About</StyledItemTitle>
        <StyledAbout>
          <div className='item'>
            <p className='text'>
              Since Kukje Gallery opened at the center of Seoul in 1982, it has
              been committed to presenting the work of the most current and
              significant Korean and international contemporary artists. The
              Gallery has established itself as a leading venue for showing
              works by major international artists such as Damien Hirst, Eva
              Hesse, Jean-Michel Basquiat, Joan Mitchell, Cy Twombly, Ed Ruscha,
              Joseph Beuys, Anselm Kiefer, Louise Bourgeois, Jenny Holzer,
              Candida Hofer, Bill Viola, Anish Kapoor, etc. The exhibitions
              provided the foremost rare opportunity for the Korean art
              audiences to encounter the works of world-renowned contemporary
              artists without going abroad.
            </p>
            <p className='text'>
              Recognizing the importance of promoting Korean artists abroad,
              Kukje Gallery participates annually in major art fairs such as Art
              Basel, Art Basel Miami Beach and The Armory Show. The Gallery
              first presented the most significant artworks by Korean artists
              alongside more recognizable works of high caliber by international
              artists. Consequently, the Korean artists as well as the Gallery
              have been successfully gaining wide exposure and receiving much
              attention from the non-Korean collectors. The Gallery has also
              been promoting Korean artists to non-commercial venues, using its
              solid network of museum curators and critics worldwide. Many of
              Korean artists who have been presented by Kukje Gallery have gone
              on to participate in international biennials and major art museum
              exhibitions.
            </p>
            <p className='text'>
              Kukje Gallery has an unmatched reputation in Korea for having
              introduced many of the most critically acclaimed international
              artists, and for supporting the most promising Korean artists. The
              Gallery continues to play a key role in developing the domestic
              art market and promoting Korean artists; as well as drawing the
              national audience’s attention to the currently international art
              world.
            </p>
          </div>
          <div className='item'>
            <div className='cover'>
              <img
                src='https://placeimg.com/540/184/nature?t=1617247698083'
                alt=''
              />
            </div>
            <p className='gallery-name'>K1 Gallery</p>
            <StyledAboutItem>
              <ReactSVG className='icon' src={IconTelegram} />
              <span>@K1Gallery</span>
            </StyledAboutItem>
            <StyledAboutItem>
              <ReactSVG className='icon' src={IconTwitter} />
              <span>@K1Gallery</span>
            </StyledAboutItem>
            <StyledAboutItem>
              <ReactSVG className='icon' src={IconEmail} />
              <span>@K1Gallery</span>
            </StyledAboutItem>
          </div>
        </StyledAbout>
      </StyledItem>
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

const StyledHead = styled.div`
  /* display: flex;
  align-items: cennter;
  justify-content: space-between;
  flex-wrap: wrap; */
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
const StyledHeadIcon = styled.div`
  display: flex;
  align-items: center;
  .icon {
    width: 32px;
    height: 32px;
    margin-left: 32px;
    &:nth-of-type(1) {
      margin-left: 0;
    }
    svg {
      font-size: 32px;
      color: #333333;
    }
  }
`;
const StyledItemTitle = styled.h3`
  font-size: 32px;
  font-family: BigCaslon-Medium, BigCaslon;
  font-weight: 500;
  color: #333333;
  line-height: 39px;
  padding: 0;
  margin: 0;
`;
const StyledItem = styled.div`
  margin: 24px 0 64px;
`;
const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  background: #dbdbdb;
`;
const StyledVideo = styled.div`
  margin: 64px 0 0;
  height: 810px;
  .media-video {
    width: 100%;
    height: 100%;
  }
`;
const StyledArtworks = styled.div`
  margin-top: 64px;
`;
const StyledArtworksItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  .cover {
    width: 100%;
    max-height: 720px;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 100%;
      object-fit: contain;
    }
  }
`;

const StyledAbout = styled.div`
  margin-top: 64px;
  display: flex;
  flex-wrap: wrap;
  .item {
    flex: 1;
    &:nth-child(1) {
      margin-right: 24px;
    }
    &:nth-child(2) {
      margin-left: 24px;
    }
  }
  .text {
    font-size: 16px;
    font-family: BigCaslon-Medium, BigCaslon;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    padding: 0;
    margin: 40px 0 0 0;
    &:nth-child(1) {
      margin-top: 0;
    }
  }
  .cover {
    width: 100%;
    height: 392px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .gallery-name {
    font-size: 24px;
    font-family: BigCaslon-Medium, BigCaslon;
    font-weight: 500;
    color: #333333;
    line-height: 28px;
    padding: 0;
    margin: 24px 0 0 0;
  }
`;
const StyledAboutItem = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  .icon {
    width: 20px;
    height: 20px;
    margin-left: 20px;
    &:nth-of-type(1) {
      margin-left: 0;
    }
    svg {
      font-size: 20px;
      color: #333333;
    }
  }
  span {
    font-size: 16px;
    font-family: BigCaslon-Medium, BigCaslon;
    font-weight: 500;
    color: #333333;
    line-height: 19px;
    margin-left: 6px;
  }
`;
export default GalleryId;
