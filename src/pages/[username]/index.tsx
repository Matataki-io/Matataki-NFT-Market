import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Avatar, Button, List, message, Spin, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import { ReactSVG } from 'react-svg';
import { UserInfoState } from '../../store/userInfoSlice';
import { useAppSelector } from '../../hooks/redux';
import { NFTProps } from '../../../next-env';
import NFTSimple from '../../components/NFTSimple';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useLogin } from '../../hooks/useLogin';
import { getUser, getUserTags } from '../../backend/user';
import {
  backendSWRFetcher,
  getMediaById,
  getMediaMetadata,
} from '../../backend/media';
import { User } from '../../types/User.types';
import { BidLog } from '../../types/Bid';
import ArtworksCarousel from '../../components/ArtworksCarousel';

import IconTelegram from '../../assets/icons/telegram.svg';
import IconTwitter from '../../assets/icons/twitter.svg';
import IconEmail from '../../assets/icons/email1.svg';
import IconMedium from '../../assets/icons/medium.svg';
import IconFacebook from '../../assets/icons/facebook.svg';
import useSWR from 'swr';

interface Props {
  setIsProfile: (value: boolean) => void;
}

const UserInfoPage: React.FC<Props> = ({ setIsProfile }) => {
  const router = useRouter();
  const { username } = router.query;
  const [userInfo, setUserInfo] = useState<UserInfoState>({
    avatar: '',
    nickname: '',
    username: '',
    role: undefined,
    telegram: '',
    twitter: '',
    email: '',
    medium: '',
    facebook: '',
  });
  const [isVerifiedUser, setIsVerifiedUser] = useState(false);
  const [isMyself, setIsMyself] = useState(false);
  const appUserInfo = useAppSelector(state => state.userInfo);
  const [nftListData, setNFTListData] = useState<Array<NFTProps>>([]);
  const [switchFeedOrBids, setSwitchFeedOrBids] = useState<'feed' | 'bids'>(
    'feed'
  );
  const [bidsList, setBidsList] = useState<Array<BidLog>>([]);
  const { userDataByWallet } = useLogin();
  // show bid cancel modal
  const [isModalVisibleBidsCancel, setIsModalVisibleBidsCancel] = useState(
    false
  );
  // click bid idx
  const [currentBidsIdx, setCurrentBidsIdx] = useState<number>(0);
  const keyMessage = 'fetchUser';

  const { data: contractedArtists, error: artistsError } = useSWR<User[], any>(
    userDataByWallet ? `/user/${userDataByWallet.id}/owned-artists` : null,
    backendSWRFetcher
  );

  const { data: ownedGalleries, error: galleryError } = useSWR<User, any>(
    username ? `/user/@${username}/ownedGalleries` : null,
    backendSWRFetcher
  );

  const [tagsList, setTagsList] = useState<Array<string>>([]);

  useEffect(() => {
    const fetchUserInfoData = async () => {
      if (typeof username !== 'string') return;
      try {
        const userInfo = await getUser(username as string);
        console.log('userInfo', userInfo);
        if (userDataByWallet && userDataByWallet.username === username) {
          setIsMyself(true);
        }
        setUserInfo(userInfo);
        setIsVerifiedUser(false);
        return userInfo;
      } catch (e) {
        let err = e.toString();
        console.log('e', e.toString());

        if (err.includes('status code 404')) {
          message.destroy(keyMessage);
          message.error({ content: 'No such user！', key: keyMessage });
          router.push('/');
        }

        setIsVerifiedUser(false);
        return;
      }
    };

    const fetchNFTListData = async (userInfo: User) => {
      const uniNftId = new Set<number>();
      if (userInfo.createdMedia) {
        userInfo.createdMedia.map(item => uniNftId.add(item));
      }
      if (userInfo.ownedMedia) {
        userInfo.ownedMedia.map(item => uniNftId.add(item));
      }
      const getUserMediaList = Array.from(uniNftId).map(async id => {
        const media = await getMediaById(id);
        return media;
      });
      const userMediaList = await Promise.all(getUserMediaList);
      const getUserNftList: Promise<NFTProps>[] = userMediaList.map(
        async media => {
          const metadata = await getMediaMetadata(media.metadataURI);
          return {
            id: media.id,
            type: metadata.mimeType.split('/')[0],
            title: metadata.name,
            fields: {
              low: { stringValue: media.tokenURI },
              stream: { stringValue: media.tokenURI },
              medium: { stringValue: media.tokenURI },
              high: { stringValue: media.tokenURI },
              thumbnail: { stringValue: media.tokenURI },
            },
            content: {
              low: media.tokenURI,
              stream: media.tokenURI,
              medium: media.tokenURI,
              high: media.tokenURI,
              thumbnail: media.tokenURI,
            },
            owner: media.owner,
            creator: media.creator,
          };
        }
      );
      const userNftList = await Promise.all(getUserNftList);
      setNFTListData(userNftList || []);
    };

    const fetchAll = async () => {
      const userInfo = await fetchUserInfoData();
      if (!isEmpty(userInfo)) {
        await fetchNFTListData(userInfo!);
      }
    };

    fetchAll();
  }, [appUserInfo, userDataByWallet, username, router]);

  useEffect(() => {
    const fetch = async () => {
      if (typeof username !== 'string') return;
      const data = await getUserTags(username);
      console.log('getUserTags', data);
      const list = data.tags.map(i => i.name);
      setTagsList(list);
    };
    fetch();
  }, [userInfo, username]);

  const collectionContainer = () => {
    return (
      <>
        <StyledTitle>Collection</StyledTitle>
        <StyledMediaCardContainer>
          {nftListData.map((item, index) => (
            <Link href={`/p/${item.id}`} key={`media-card-${index}`}>
              <a target='_blank'>
                <NFTSimple {...item} />
              </a>
            </Link>
          ))}
        </StyledMediaCardContainer>
      </>
    );
  };
  const ArtworksContainer = () => {
    return (
      <>
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
              className='media-video'
            />
          </StyledVideo>
        </StyledItem>
        <StyledLine />
        <StyledItem>
          <StyledItemTitle>Artworks</StyledItemTitle>
          <StyledArtworks>
            <ArtworksCarousel />
          </StyledArtworks>
        </StyledItem>

        <StyledLine />
        <StyledItem>
          <StyledItemTitle>About</StyledItemTitle>
          <StyledAbout>
            <div className='item'>
              <p className='text'>
                Since Kukje Gallery opened at the center of Seoul in 1982, it
                has been committed to presenting the work of the most current
                and significant Korean and international contemporary artists.
                The Gallery has established itself as a leading venue for
                showing works by major international artists such as Damien
                Hirst, Eva Hesse, Jean-Michel Basquiat, Joan Mitchell, Cy
                Twombly, Ed Ruscha, Joseph Beuys, Anselm Kiefer, Louise
                Bourgeois, Jenny Holzer, Candida Hofer, Bill Viola, Anish
                Kapoor, etc. The exhibitions provided the foremost rare
                opportunity for the Korean art audiences to encounter the works
                of world-renowned contemporary artists without going abroad.
              </p>
              <p className='text'>
                Recognizing the importance of promoting Korean artists abroad,
                Kukje Gallery participates annually in major art fairs such as
                Art Basel, Art Basel Miami Beach and The Armory Show. The
                Gallery first presented the most significant artworks by Korean
                artists alongside more recognizable works of high caliber by
                international artists. Consequently, the Korean artists as well
                as the Gallery have been successfully gaining wide exposure and
                receiving much attention from the non-Korean collectors. The
                Gallery has also been promoting Korean artists to non-commercial
                venues, using its solid network of museum curators and critics
                worldwide. Many of Korean artists who have been presented by
                Kukje Gallery have gone on to participate in international
                biennials and major art museum exhibitions.
              </p>
              <p className='text'>
                Kukje Gallery has an unmatched reputation in Korea for having
                introduced many of the most critically acclaimed international
                artists, and for supporting the most promising Korean artists.
                The Gallery continues to play a key role in developing the
                domestic art market and promoting Korean artists; as well as
                drawing the national audience’s attention to the currently
                international art world.
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
      </>
    );
  };

  const GalleryContainer = () => {
    return (
      <>
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
              className='media-video'
            />
          </StyledVideo>
        </StyledItem>
        <StyledLine />
        <StyledItem>
          <StyledItemTitle>Artworks</StyledItemTitle>
          <StyledArtworks>
            <ArtworksCarousel />
          </StyledArtworks>
        </StyledItem>

        <StyledLine />
        <StyledItem>
          <StyledItemTitle>About</StyledItemTitle>
          <StyledAbout>
            <div className='item'>
              <p className='text'>
                Since Kukje Gallery opened at the center of Seoul in 1982, it
                has been committed to presenting the work of the most current
                and significant Korean and international contemporary artists.
                The Gallery has established itself as a leading venue for
                showing works by major international artists such as Damien
                Hirst, Eva Hesse, Jean-Michel Basquiat, Joan Mitchell, Cy
                Twombly, Ed Ruscha, Joseph Beuys, Anselm Kiefer, Louise
                Bourgeois, Jenny Holzer, Candida Hofer, Bill Viola, Anish
                Kapoor, etc. The exhibitions provided the foremost rare
                opportunity for the Korean art audiences to encounter the works
                of world-renowned contemporary artists without going abroad.
              </p>
              <p className='text'>
                Recognizing the importance of promoting Korean artists abroad,
                Kukje Gallery participates annually in major art fairs such as
                Art Basel, Art Basel Miami Beach and The Armory Show. The
                Gallery first presented the most significant artworks by Korean
                artists alongside more recognizable works of high caliber by
                international artists. Consequently, the Korean artists as well
                as the Gallery have been successfully gaining wide exposure and
                receiving much attention from the non-Korean collectors. The
                Gallery has also been promoting Korean artists to non-commercial
                venues, using its solid network of museum curators and critics
                worldwide. Many of Korean artists who have been presented by
                Kukje Gallery have gone on to participate in international
                biennials and major art museum exhibitions.
              </p>
              <p className='text'>
                Kukje Gallery has an unmatched reputation in Korea for having
                introduced many of the most critically acclaimed international
                artists, and for supporting the most promising Korean artists.
                The Gallery continues to play a key role in developing the
                domestic art market and promoting Korean artists; as well as
                drawing the national audience’s attention to the currently
                international art world.
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

        <StyledLine />
        <StyledItem>
          <StyledItemTitle>Contracted Artists</StyledItemTitle>
          <StyledWord>
            <List
              dataSource={contractedArtists}
              renderItem={artist => (
                <List.Item>
                  <Link href={`/${artist.username}`}>
                    <a>
                      {artist.username}({artist.nickname})
                    </a>
                  </Link>
                </List.Item>
              )}
            />
          </StyledWord>
        </StyledItem>
      </>
    );
  };
  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadUser>
          <Avatar icon={<UserOutlined />} src={userInfo.avatar} size={66} />
          <StyledHeadUserInfo>
            {userInfo.nickname || userInfo.username ? (
              <>
                <h1>
                  {userInfo.nickname}({userInfo.username})
                </h1>
                <p>{userInfo.bio || 'Not...'}</p>
              </>
            ) : null}
          </StyledHeadUserInfo>
        </StyledHeadUser>
        <StyledHeadRight>
          <StyledHeadIcon>
            {userInfo?.telegram ? (
              <CopyToClipboard
                text={userInfo?.telegram}
                onCopy={() => message.info('复制成功！')}>
                {userInfo?.telegram ? (
                  <ReactSVG className='icon' src={IconTelegram} />
                ) : null}
              </CopyToClipboard>
            ) : null}
            {userInfo?.twitter ? (
              <CopyToClipboard
                text={userInfo?.twitter}
                onCopy={() => message.info('复制成功！')}>
                {userInfo?.twitter ? (
                  <ReactSVG className='icon' src={IconTwitter} />
                ) : null}
              </CopyToClipboard>
            ) : null}
            {userInfo?.email ? (
              <CopyToClipboard
                text={userInfo?.email}
                onCopy={() => message.info('复制成功！')}>
                {userInfo?.email ? (
                  <ReactSVG className='icon' src={IconEmail} />
                ) : null}
              </CopyToClipboard>
            ) : null}
            {userInfo?.medium ? (
              <CopyToClipboard
                text={userInfo?.medium}
                onCopy={() => message.info('复制成功！')}>
                {userInfo?.medium ? (
                  <ReactSVG className='icon' src={IconMedium} />
                ) : null}
              </CopyToClipboard>
            ) : null}
            {userInfo?.facebook ? (
              <CopyToClipboard
                text={userInfo?.facebook}
                onCopy={() => message.info('复制成功！')}>
                {userInfo?.facebook ? (
                  <ReactSVG className='icon' src={IconFacebook} />
                ) : null}
              </CopyToClipboard>
            ) : null}
          </StyledHeadIcon>
          {tagsList.length ? (
            <StyledHeadTags>
              {tagsList.map((i, idx) => (
                <Tag key={idx}>{i}</Tag>
              ))}
            </StyledHeadTags>
          ) : null}
          {isMyself ? (
            <StyledHeadEdit>
              <Button
                onClick={() => router.push(`/${username}/edit`)}
                size='small'>
                EDIT PROFILE
              </Button>
            </StyledHeadEdit>
          ) : null}
        </StyledHeadRight>
      </StyledHead>
      <StyledLine />
      {/*{!isEmpty(ownedGalleries?.ownedGalleries) && <GalleryContainer />}*/}
      {userInfo?.role === 'COLLECTOR' ? (
        collectionContainer()
      ) : userInfo?.role === 'ARTIST' ? (
        ArtworksContainer()
      ) : userInfo?.role === 'SUPER_ADMIN' ? (
        collectionContainer()
      ) : (
        <Spin />
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1480px;
  padding: 0 20px 256px;
  box-sizing: border-box;

  margin: 0 auto;
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
const StyledTitle = styled.div`
  font-size: 32px;
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  color: #333333;
  line-height: 39px;
  padding: 0;
  margin: 24px 0 0 0;
`;
const StyledHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 48px 0;
`;
const StyledHeadUser = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  @media screen and (max-width: 678px) {
    justify-content: center;
    flex-direction: column;
    width: 100%;
  }
`;
const StyledHeadUserInfo = styled.div`
  margin: 0 0 0 15px;
  position: relative;
  top: 10px;
  @media screen and (max-width: 678px) {
    margin: 10px 0;
    top: 0;
    text-align: center;
  }

  h1 {
    font-size: 34px;
    font-weight: bold;
    color: #333333;
    line-height: 1;
    padding: 0;
    margin: 0;
    @media screen and (max-width: 678px) {
      font-size: 20px;
    }
  }

  p {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    line-height: 1.2;
    padding: 0;
    margin: 6px 0 0 0;
  }
`;
const StyledHeadRight = styled.div`
  @media screen and (max-width: 678px) {
    width: 100%;
  }
`;
const StyledHeadIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media screen and (max-width: 678px) {
    justify-content: center;
  }

  .icon {
    width: 32px;
    height: 32px;
    margin-left: 32px;
    cursor: pointer;

    &:nth-of-type(1) {
      margin-left: 0;
    }

    svg {
      font-size: 32px;
      color: #333333;
    }

    @media screen and (max-width: 678px) {
      margin: 0 10px;
      width: 16px;
      height: 16px;
      svg {
        font-size: 16px;
      }
    }
  }
`;
const StyledHeadTags = styled.div`
  max-width: 400px;
  text-align: right;
  margin: 6px 0;

  .ant-tag {
    margin: 4px 0 4px 8px;
  }

  @media screen and (max-width: 678px) {
    text-align: center;
    .ant-tag {
      margin: 4px;
    }
  }
`;
const StyledHeadEdit = styled.div`
  text-align: right;
  @media screen and (max-width: 678px) {
    text-align: center;
  }
`;

const StyledMediaCardContainer = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
  gap: 30px 20px;
  margin: 48px auto 0;
  min-height: 320px;
  grid-template-columns: repeat(4, minmax(0px, 330px));

  & > a {
    width: 100%;
  }

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
`;

// artist start
const StyledItemTitle = styled.h3`
  font-size: 32px;
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  color: #333333;
  line-height: 1.2;
  padding: 0;
  margin: 0;
  @media screen and (max-width: 678px) {
    font-size: 20px;
  }
`;
const StyledItem = styled.div`
  margin: 24px 0 64px;
  @media screen and (max-width: 678px) {
    margin: 20px 0;
  }
`;
const StyledVideo = styled.div`
  margin: 64px 0 0;
  height: 810px;

  .media-video {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 678px) {
    margin: 20px 0 0;
    height: 240px;
  }
`;
const StyledArtworks = styled.div`
  margin-top: 64px;

  .ant-carousel .slick-prev,
  .ant-carousel .slick-next,
  .ant-carousel .slick-prev:hover,
  .ant-carousel .slick-next:hover {
    font-size: inherit;
    color: currentColor;
  }
`;

const StyledAbout = styled.div`
  margin-top: 64px;
  display: flex;
  flex-wrap: wrap;
  @media screen and (max-width: 678px) {
    margin-top: 20px;
    flex-direction: column;
  }

  .item {
    flex: 1;

    &:nth-child(1) {
      margin-right: 24px;
    }

    &:nth-child(2) {
      margin-left: 24px;
    }

    @media screen and (max-width: 678px) {
      &:nth-child(1) {
        margin-right: 0;
      }

      &:nth-child(2) {
        margin-left: 0;
      }
    }
  }

  .text {
    font-size: 16px;
    font-family: 'Playfair Display', serif;
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
    @media screen and (max-width: 678px) {
      height: 200px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .gallery-name {
    font-size: 24px;
    font-family: 'Playfair Display', serif;
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
    cursor: pointer;

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
    font-family: 'Playfair Display', serif;
    font-weight: 500;
    color: #333333;
    line-height: 19px;
    margin-left: 6px;
  }
`;
// artist end

// gallery start
const StyledWord = styled.div`
  display: block;
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
// gallery end
export default UserInfoPage;
