import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Avatar, Button, message, Spin, Space, Image } from 'antd';
import { backendSWRFetcher, mediaSearch } from '../../../backend/media';
import { UserRole } from '../../../constant';
import NFTSimple from '../../../components/NFTSimple';
import {
  createGalleryJoinRequest,
  findGalleryJoinRequest,
} from '../../../backend/gallery';
import {
  GalleryJoinRequest,
  GalleryJoinRequestStatus,
} from '../../../types/GalleryJoinRequest';
import { Gallery } from '../../../types/Gallery';
import { isEmpty } from 'lodash';
import ArtworksCarousel from '../../../components/ArtworksCarouselUser';
import Link from 'next/link';
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';
import { Media } from '../../../types/Media.entity';
import { useLogin } from '../../../hooks/useLogin';
import { wordItem } from '../../../utils/index';
import { ReactSVG } from 'react-svg';
import IconTelegram from '../../../assets/icons/telegram.svg';
import IconEmail from '../../../assets/icons/email1.svg';
import IconMedium from '../../../assets/icons/medium.svg';
import IconTwitter from '../../../assets/icons/twitter.svg';
import IconDiscord from '../../../assets/icons/discord.svg';
import IconFacebook from '../../../assets/icons/facebook.svg';
import { WordItemState } from '../../../types/utiils.d';
import { User } from '../../../types/User.types';
import Word from '../../../components/Word';

const AGallery: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { userDataByWallet } = useLogin();
  const [media, setMedia] = useState<Media[]>([]);
  const [requests, setRequests] = useState<GalleryJoinRequest[]>([]);

  const { data: gallery, error: galleryError } = useSWR<Gallery, any>(
    id ? `/gallery/${id}` : null,
    backendSWRFetcher
  );

  const isOwner = useMemo(
    () =>
      gallery &&
      userDataByWallet &&
      gallery.owner.id === userDataByWallet.id &&
      gallery.owner.username === userDataByWallet.username,
    [gallery, userDataByWallet]
  );

  // about icon list
  const galleryAboutIconList = useMemo(() => {
    return [
      {
        name: gallery?.about?.telegram,
        icon: IconTelegram,
      },
      {
        name: gallery?.about?.twitter,
        icon: IconTwitter,
      },
      {
        name: gallery?.about?.medium,
        icon: IconMedium,
      },
      {
        name: gallery?.about?.facebook,
        icon: IconFacebook,
      },
      {
        name: gallery?.about?.discord,
        icon: IconDiscord,
      },
      {
        name: gallery?.about?.email,
        icon: IconEmail,
      },
    ];
  }, [gallery]);

  // 是否申请加入画廊
  let isJoinApplied = useMemo(() => {
    if (userDataByWallet) {
      let join = requests.find((i: any) => {
        return (
          i.artist.username === userDataByWallet?.username &&
          i.artist.id === userDataByWallet?.id
        );
      });
      console.log('join', join);
      return !!join;
    } else {
      return false;
    }
  }, [userDataByWallet, requests]);
  // 是否加入画廊
  let isJoin = useMemo(() => {
    if (userDataByWallet) {
      let join = gallery?.artists.find((i: any) => {
        return (
          i.username === userDataByWallet?.username &&
          i.id === userDataByWallet?.id
        );
      });
      console.log('join', join);
      return !!join;
    } else {
      return false;
    }
  }, [userDataByWallet, gallery]);

  // nft list
  const nftsList: any = useMemo(() => {
    if (isEmpty(media)) {
      return [];
    }
    return media?.map((i: Media) => {
      return {
        id: i.id,
        type: 'image',
        title: i.title,
        description: i.description,
        fields: {
          low: { stringValue: i.tokenURI },
          stream: { stringValue: i.tokenURI },
          medium: { stringValue: i.tokenURI },
          high: { stringValue: i.tokenURI },
          thumbnail: { stringValue: i.tokenURI },
        },
        content: {
          low: i.tokenURI,
          stream: i.tokenURI,
          medium: i.tokenURI,
          high: i.tokenURI,
          thumbnail: i.tokenURI,
        },
        owner: i.owner,
      };
    });
  }, [media]);

  // fetch join gallery liist
  const fetchJoinFn = useCallback(async () => {
    try {
      if (isEmpty(gallery)) {
        return;
      }
      const res = await findGalleryJoinRequest({
        gallery: gallery,
        status: GalleryJoinRequestStatus.PENDING,
      });
      console.log(res);
      if (res.status === 200) {
        setRequests(res.data);
      } else {
        throw new Error('fail');
      }
    } catch (e) {
      message.error(e.toString());
    }
  }, [gallery]);

  // fetch gallery media nft
  const fetchMediaSearch = useCallback(async () => {
    if (isEmpty(gallery)) {
      return;
    }
    try {
      const res = await mediaSearch({
        gallery: Number(gallery?.id),
        relations: ['owner'],
      });
      if (res.status === 200) {
        setMedia(res.data as any);
      } else {
        throw new Error('fail');
      }
    } catch (e) {
      console.log(e.toString());
    }
  }, [gallery]);

  useEffect(() => {
    if (!isEmpty(gallery)) {
      fetchMediaSearch();
    }
  }, [gallery, fetchMediaSearch]);

  // 加入画廊
  const joinGalleryFn = async () => {
    try {
      const res = await createGalleryJoinRequest(Number.parseInt(id as string));
      if (res.status === 201) {
        console.log(res);
        message.success('已发送加入申请');
        fetchJoinFn();
      } else {
        throw new Error('fail');
      }
    } catch (e) {
      console.log('e', e);
      message.error(e.toString());
    }
  };

  // 处理艺术家分组
  const artistWord: WordItemState = useMemo(() => {
    if (isEmpty(gallery)) {
      return {} as WordItemState;
    }
    return wordItem(gallery!.artists);
  }, [gallery]);

  useEffect(() => {
    if (!isEmpty(gallery)) {
      fetchJoinFn();
    }
  }, [gallery, fetchJoinFn]);

  return (
    <StyledWrapper>
      {isEmpty(gallery) ? (
        <StyledWrapperLoading>
          <Spin tip='Loading...'></Spin>
        </StyledWrapperLoading>
      ) : (
        <>
          <StyledHead>
            <StyledHeadUser>
              <Avatar icon={<UserOutlined />} src={gallery?.cover} size={66} />
              <StyledHeadUserInfo>
                <h1>{gallery?.name}</h1>
                <p>{gallery?.intro}</p>
              </StyledHeadUserInfo>
            </StyledHeadUser>
            <StyledHeadRight>
              <Space>
                {userDataByWallet?.role === UserRole.Artist ? (
                  isJoin ? (
                    <Button disabled>Joined</Button>
                  ) : isJoinApplied ? (
                    <Button disabled>Already applied</Button>
                  ) : (
                    <Button type='primary' onClick={joinGalleryFn}>
                      Join Gallery
                    </Button>
                  )
                ) : null}
                {isOwner ? (
                  <Link href={`/gallery/${id}/edit`}>
                    <a>
                      <Button type='primary'>Edit</Button>
                    </a>
                  </Link>
                ) : null}
                {isOwner ? (
                  <Link href={`/gallery/${id}/manage`}>
                    <a>
                      <Button type='primary'>Manage</Button>
                    </a>
                  </Link>
                ) : null}
              </Space>
            </StyledHeadRight>
          </StyledHead>
          <StyledLine />

          {!isEmpty(gallery?.presentations) ? (
            <>
              <StyledItem>
                <StyledItemTitle>Presentation</StyledItemTitle>
                <StyledPresentation>
                  <Image
                    src={
                      gallery?.presentations ? gallery?.presentations[0] : ''
                    }></Image>
                </StyledPresentation>
              </StyledItem>
              <StyledLine />
            </>
          ) : null}

          {!isEmpty(nftsList) ? (
            <>
              <StyledItem>
                <StyledItemTitle>NFTs</StyledItemTitle>
                <StyledMediaCardContainer>
                  {nftsList.map((item: any, idx: number) => (
                    <Link href={`/p/${item.id}`} key={`media-card-${idx}`}>
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

          {!isEmpty(gallery?.artworks) ? (
            <>
              <StyledItem>
                <StyledItemTitle>Artworks</StyledItemTitle>
                <StyledArtworks>
                  <ArtworksCarousel data={gallery?.artworks || []} />
                </StyledArtworks>
              </StyledItem>
              <StyledLine />
            </>
          ) : null}

          <StyledItem>
            <StyledItemTitle>About</StyledItemTitle>
            <StyledAbout>
              <div className='item'>
                <p className='text'>{gallery?.about.description}</p>
              </div>
              <div className='item'>
                <div className='cover'>
                  {gallery?.about.banner ? (
                    <img
                      src={gallery?.about.banner || ''}
                      alt={gallery?.about.bannerDescription || ''}
                    />
                  ) : null}
                </div>
                <p className='gallery-name'>
                  {gallery?.about.bannerDescription}
                </p>
                {galleryAboutIconList.map((i: any, idx: number) =>
                  i.name ? (
                    <StyledAboutItem key={idx}>
                      <ReactSVG className='icon' src={i.icon} />
                      <span>{i.name}</span>
                    </StyledAboutItem>
                  ) : null
                )}
              </div>
            </StyledAbout>
          </StyledItem>

          {!isEmpty(artistWord) ? (
            <>
              <StyledLine />
              <StyledItem>
                <StyledItemTitle>Contracted Artists</StyledItemTitle>
                <Word list={artistWord}></Word>
              </StyledItem>
              {/* <StyledLine /> */}
            </>
          ) : null}
        </>
      )}
    </StyledWrapper>
  );
};

export default AGallery;

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

  @media screen and (max-width: 567px) {
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
    text-align: center;
    margin: 10px 0 0 0;
  }
`;
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
// const StyledVideo = styled.div`
//   margin: 64px 0 0;
//   height: 810px;

//   .media-video {
//     width: 100%;
//     height: 100%;
//   }

//   @media screen and (max-width: 678px) {
//     margin: 20px 0 0;
//     height: 240px;
//   }
// `;
const StyledArtworks = styled.div`
  margin-top: 64px;

  .ant-carousel .slick-prev,
  .ant-carousel .slick-next,
  .ant-carousel .slick-prev:hover,
  .ant-carousel .slick-next:hover {
    font-size: inherit;
    color: currentColor;
  }

  @media screen and (max-width: 567px) {
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
    font-family: 'Playfair Display', serif;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    padding: 0;
    margin: 0;
    word-break: break-word;

    @media screen and (max-width: 567px) {
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
    font-family: 'Playfair Display', serif;
    font-weight: 500;
    color: #333333;
    line-height: 28px;
    padding: 0;
    margin: 24px 0 0 0;
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
  @media screen and (max-width: 567px) {
    margin: 20px auto 0;
    gap: 10px 0;
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

const StyledPresentation = styled.div`
  margin: 64px 0 0;
  text-align: center;
  width: 100%;
  overflow: hidden;
  @media screen and (max-width: 678px) {
    margin: 20px 0 0;
  }
`;
