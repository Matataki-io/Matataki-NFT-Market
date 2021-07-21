import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Tag, Form, Image, Avatar, Button, message, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import { ReactSVG } from 'react-svg';
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
import ArtworksCarousel from '../../components/ArtworksCarouselUser';

import IconTelegram from '../../assets/icons/telegram.svg';
import IconEmail from '../../assets/icons/email1.svg';
import IconMedium from '../../assets/icons/medium.svg';
import IconTwitter from '../../assets/icons/twitter.svg';
import IconDiscord from '../../assets/icons/discord.svg';
import IconFacebook from '../../assets/icons/facebook.svg';
import useSWR from 'swr';
import GalleryCard from '../../components/GalleryCard';
import { Gallery } from '../../types/Gallery';
import { shortedAccount } from '../../utils/index';

interface Props {
  setIsProfile: (value: boolean) => void;
}

const UserInfoPage: React.FC<Props> = ({ setIsProfile }) => {
  const router = useRouter();
  const { username } = router.query;
  const [userInfo, setUserInfo] = useState<User | any>({
    avatar: '',
    nickname: '',
    username: '',
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
  const [
    isModalVisibleBidsCancel,
    setIsModalVisibleBidsCancel,
  ] = useState<boolean>(false);

  // click bid idx
  const [currentBidsIdx, setCurrentBidsIdx] = useState<number>(0);

  const keyMessage = 'fetchUser';

  const { data: galleryOwner, error: galleryError } = useSWR<User, any>(
    username ? `/user/@${username}/ownedGalleries` : null,
    backendSWRFetcher
  );

  const [tagsList, setTagsList] = useState<Array<string>>([]);

  // 获取用户信息
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
    // 获取NFT信息
    const fetchNFTListData = async (userInfo: User) => {
      const uniNftId = new Set<number>();
      if (userInfo.createdMedia) {
        userInfo.createdMedia.map((item: any) => uniNftId.add(item));
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
            description: metadata.description,
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
            tags: media.tags,
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
  // 获取用户tags
  useEffect(() => {
    const fetch = async () => {
      if (typeof username !== 'string') return;
      const data = await getUserTags(username);
      // console.log('getUserTags', data);
      const list = data.tags.map(i => i.name);
      setTagsList(list);
    };
    fetch();
  }, [userInfo, username]);

  // user info icon list
  const IconList = useMemo(() => {
    let list = [
      {
        name: userInfo?.telegram,
        icon: IconTelegram,
      },
      {
        name: userInfo?.twitter,
        icon: IconTwitter,
      },
      {
        name: userInfo?.email,
        icon: IconEmail,
      },
      {
        name: userInfo?.medium,
        icon: IconMedium,
      },
      {
        name: userInfo?.facebook,
        icon: IconFacebook,
      },
    ];
    return list;
  }, [userInfo]);

  // user about icon list
  const userAboutIconList = useMemo(() => {
    return [
      {
        name: userInfo?.about?.telegram,
        icon: IconTelegram,
      },
      {
        name: userInfo?.about?.twitter,
        icon: IconTwitter,
      },
      {
        name: userInfo?.about?.medium,
        icon: IconMedium,
      },
      {
        name: userInfo?.about?.facebook,
        icon: IconFacebook,
      },
      {
        name: userInfo?.about?.discord,
        icon: IconDiscord,
      },
      {
        name: userInfo?.about?.email,
        icon: IconEmail,
      },
    ];
  }, [userInfo]);

  const collectionContainer = () => {
    return (
      <>
        <StyledItemTitle style={{ marginTop: 20 }}>Collection</StyledItemTitle>
        <StyledMediaCardContainer>
          {nftListData.map(item => (
            <Link href={`/p/${item.id}`} key={`media-card-${item.id}`}>
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
        {!isEmpty(userInfo?.presentations) ? (
          <>
            <StyledItem>
              <StyledItemTitle>Presentation</StyledItemTitle>
              <StyledPresentation>
                <Image
                  src={
                    userInfo?.presentations ? userInfo?.presentations[0] : ''
                  }
                />
              </StyledPresentation>
            </StyledItem>
            <StyledLine />
          </>
        ) : null}

        {!isEmpty(nftListData) ? (
          <>
            <StyledItem>
              <StyledItemTitle>NFTs</StyledItemTitle>
              <StyledMediaCardContainer>
                {nftListData.map(item => (
                  <Link href={`/p/${item.id}`} key={`media-card-${item.id}`}>
                    <a target='_blank'>
                      <NFTSimple {...item} />
                    </a>
                  </Link>
                ))}
              </StyledMediaCardContainer>
            </StyledItem>
            <StyledLine />
          </>
        ) : null}

        {!isEmpty(userInfo?.artworks) ? (
          <>
            <StyledItem>
              <StyledItemTitle>Artworks</StyledItemTitle>
              <StyledArtworks>
                <ArtworksCarousel data={userInfo?.artworks} />
              </StyledArtworks>
            </StyledItem>
            <StyledLine />
          </>
        ) : null}

        <StyledItem>
          <StyledItemTitle>About</StyledItemTitle>
          <StyledAbout>
            <div className='item'>
              <p className='text'>{userInfo?.about.description}</p>
            </div>
            <div className='item'>
              <div className='cover'>
                {userInfo?.about.banner ? (
                  <img
                    src={userInfo?.about.banner}
                    alt={userInfo?.about.bannerDescription}
                  />
                ) : null}
              </div>
              <p className='gallery-name'>
                {userInfo?.about.bannerDescription}
              </p>
              {userAboutIconList.map((i: any) =>
                i.name ? (
                  <StyledAboutItem>
                    <ReactSVG className='icon' src={i.icon} />
                    <span>{i.name}</span>
                  </StyledAboutItem>
                ) : null
              )}
            </div>
          </StyledAbout>
        </StyledItem>
      </>
    );
  };

  // const galleryContainer = () => {
  //   return (
  //     <>
  //       <StyledItem>
  //         <StyledItemTitle>My Gallery</StyledItemTitle>
  //         <StyledGallery>
  //           {galleryOwner?.ownedGalleries.map((gallery: Gallery) => (
  //             <Link key={gallery.id} href={`/gallery/${gallery.id}`}>
  //               <a target='_blank'>
  //                 <GalleryCard {...gallery}></GalleryCard>
  //               </a>
  //             </Link>
  //           ))}
  //         </StyledGallery>
  //       </StyledItem>
  //       <StyledLine />
  //     </>
  //   );
  // };
  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadUser>
          <Avatar icon={<UserOutlined />} src={userInfo.avatar} size={66} />
          <StyledHeadUserInfo>
            {userInfo.nickname || userInfo.username ? (
              <>
                <h1>
                  {shortedAccount(userInfo.nickname)}({userInfo.username})
                </h1>
                <p>{userInfo.bio || 'Not...'}</p>
              </>
            ) : null}
          </StyledHeadUserInfo>
        </StyledHeadUser>
        <StyledHeadRight>
          <StyledHeadIcon>
            {IconList.map((i: any, idx: number) =>
              i.name ? (
                <CopyToClipboard
                  key={idx}
                  text={i.name}
                  onCopy={() => message.info('复制成功！')}>
                  {i.name ? <ReactSVG className='icon' src={i.icon} /> : null}
                </CopyToClipboard>
              ) : null
            )}
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
              <Button onClick={() => router.push(`/${username}/edit`)}>
                Edit
              </Button>
            </StyledHeadEdit>
          ) : null}
        </StyledHeadRight>
      </StyledHead>
      <StyledLine />
      {/* {!isEmpty(galleryOwner?.ownedGalleries) && galleryContainer()} */}
      {userInfo?.role === 'COLLECTOR' ? (
        collectionContainer()
      ) : userInfo?.role === 'ARTIST' ? (
        ArtworksContainer()
      ) : userInfo?.role === 'SUPER_ADMIN' ? (
        collectionContainer()
      ) : (
        <StyledWrapperLoading>
          <Spin tip={'Loading...'} />
        </StyledWrapperLoading>
      )}
    </StyledWrapper>
  );
};

const StyledWrapperLoading = styled.div`
  text-align: center;
  margin: 100px 0 0;
`;

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1480px;
  padding: 0 20px 256px;
  box-sizing: border-box;

  margin: 0 auto;
  width: 100%;

  @media screen and (max-width: 576px) {
    padding: 0 10px 80px;
  }
`;
const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  background: #dbdbdb;
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
    @media screen and (max-width: 576px) {
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
    max-width: 600px;
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
  @media screen and (max-width: 576px) {
    margin-top: 20px;
    gap: 20px 0;
  }
`;

// artist start
const StyledItemTitle = styled.h3`
  font-size: 32px;
  font-family: bigCaslonMedium, BigCaslon-Medium, BigCaslon, 'Playfair Display',
    serif;
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
const StyledPresentation = styled.div`
  margin: 64px 0 0;
  text-align: center;
  width: 100%;
  overflow: hidden;
  @media screen and (max-width: 678px) {
    margin: 20px 0 0;
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

  @media screen and (max-width: 576px) {
    margin: 20px auto 0;
    max-width: 86%;
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
    font-family: bigCaslonMedium, BigCaslon-Medium, BigCaslon,
      'Playfair Display', serif;
    font-weight: 500;
    color: #333333;
    padding: 0;
    margin: 0;
    word-break: break-word;
    @media screen and (max-width: 576px) {
      margin-bottom: 10px;
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
    font-family: bigCaslonMedium, BigCaslon-Medium, BigCaslon,
      'Playfair Display', serif;
    font-weight: 500;
    color: #333333;
    line-height: 28px;
    padding: 0;
    margin: 24px 0 0 0;
  }
`;
const StyledAboutItem = styled.div`
  margin-top: 20px;
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
    font-weight: 400;
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
      font-family: bigCaslonMedium, BigCaslon-Medium, BigCaslon,
        'Playfair Display', serif;
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

const StyledGallery = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(4, minmax(0px, 1fr));
  gap: 48px 24px;
  margin: 48px auto 0;
  min-height: 320px;

  & > a {
    width: 100%;
  }

  @media screen and (max-width: 1366px) {
    grid-template-columns: repeat(3, minmax(0px, 1fr));
  }
  @media screen and (max-width: 1140px) {
    grid-template-columns: repeat(2, minmax(0px, 1fr));
  }
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media screen and (max-width: 576px) {
    margin-top: 20px;
    gap: 20px 0;
  }

  .loading-container {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
`;

const StyledForm = styled(Form)`
  margin-top: 40px;
  .ant-form-item {
    margin-bottom: 40px;
    border-bottom: 1px solid #d9d9d9;
    .ant-input,
    .ant-input-affix-wrapper {
      border: none;
    }
    .ant-input:focus,
    .ant-input-focused,
    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused {
      box-shadow: none;
    }
  }
  .not-border.ant-form-item {
    border: none;
  }
`;

const StyledHelper = styled.p`
  font-size: 14px;
  font-weight: 300;
  color: #777777;
  line-height: 20px;
  margin: 4px 0 10px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 60px;
  border: 2px solid #333333;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
  margin-bottom: 16px;
  &.black {
    background: #333333;
    color: #ffffff;
    &:hover {
      color: #ffffff;
    }
  }
  &:hover {
    color: #333333;
    border-color: #333333;
  }
  &.ant-btn:hover,
  &.ant-btn:focus {
    border-color: #333333;
  }
`;
// gallery end
export default UserInfoPage;
