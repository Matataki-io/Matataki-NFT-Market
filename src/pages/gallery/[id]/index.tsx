import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Avatar, Button, Empty, List, message, Modal, Spin, Image } from 'antd';
import { User } from '../../../types/User.types';
import { backendSWRFetcher } from '../../../backend/media';
import { BACKEND_CLIENT, UserRole } from '../../../constant';
import {
  createGalleryJoinRequest,
  findGalleryJoinRequest,
  updateGalleryJoinRequest,
} from '../../../backend/gallery';
import {
  GalleryJoinRequest,
  GalleryJoinRequestStatus,
} from '../../../types/GalleryJoinRequest';
import { Gallery } from '../../../types/Gallery';
import { isEmpty } from 'lodash';
import ArtworksCarousel from '../../../components/ArtworksCarousel';
import Link from 'next/link';
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';
import { Media } from '../../../types/Media.entity';
import { GeneralResponse } from '../../../types/Backend.types';
import * as _ from 'lodash';

const AGallery: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: gallery, error: galleryError } = useSWR<Gallery, any>(
    id ? `/gallery/${id}` : null,
    backendSWRFetcher
  );

  const { data: me, error: meError } = useSWR<
    { data: User; status: number },
    any
  >(`/user/me`, backendSWRFetcher);

  const isOwner = useMemo(
    () => gallery && me && gallery.owner.id === me.data.id,
    [gallery, me]
  );

  const [requests, setRequests] = useState<GalleryJoinRequest[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await findGalleryJoinRequest({
        gallery,
        status: GalleryJoinRequestStatus.PENDING,
      });
      setRequests(res);
    };
    // noinspection JSIgnoredPromiseFromCall
    if (isOwner) {
      fetch();
    }
  }, [gallery, me, isOwner]);

  const [media, setMedia] = useState<Media[]>();

  useEffect(() => {
    (async () => {
      const { data } = await BACKEND_CLIENT.post<GeneralResponse<Media[]>>(
        '/media/search',
        {
          gallery: gallery?.id,
        }
      );
      setMedia(data as any);
    })();
  }, [gallery]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = async () => {
    const res = await createGalleryJoinRequest(Number.parseInt(id as string));
    console.log(res);
    message.success('Request succeeded ');
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const indexArtist = useMemo(() => {
    let du = _.groupBy(gallery?.artists, artist =>
      artist.username.charAt(0).toUpperCase()
    );
    return _.sortBy(_.entries(du), x => x[0]);
  }, [gallery]);

  return (
    <StyledWrapper>
      <Spin size='large' spinning={!gallery}>
        {gallery && (
          <>
            <StyledHead>
              <StyledHeadUser>
                <Avatar
                  icon={<UserOutlined />}
                  src={gallery.owner.avatar}
                  size={66}
                />
                <StyledHeadUserInfo>
                  <h1>{gallery.name}</h1>
                  <p>{gallery.intro}</p>
                </StyledHeadUserInfo>
              </StyledHeadUser>
              {me && _.some(me.data.ownedGalleries, { id: gallery.id }) && (
                <Button type={'link'} href={`/gallery/${gallery.id}/edit`}>
                  Edit Gallery
                </Button>
              )}
            </StyledHead>
            <StyledLine />
            <StyledItem>
              <StyledItemTitle>Presentation</StyledItemTitle>
              {/*<StyledVideo>*/}
              {/*  <video*/}
              {/*    src={*/}
              {/*      'https://ipfs.fleek.co/ipfs/QmUDqKPSgRaGNjjDnJ89wWecpFzMGaiPcHZ76FsuepAD5Y'*/}
              {/*    }*/}
              {/*    loop*/}
              {/*    playsInline*/}
              {/*    // autoPlay*/}
              {/*    // poster={'https://placeimg.com/1440/810/nature?t=1617247698083'}*/}
              {/*    className='media-video'*/}
              {/*  />*/}
              {/*</StyledVideo>*/}
              <StyledVideo>
                {gallery?.presentations && !isEmpty(gallery?.presentations) ? (
                  <Image src={gallery.presentations[0]} alt={'presentations'} />
                ) : (
                  <Empty />
                )}
              </StyledVideo>
            </StyledItem>
            <StyledLine />
            <StyledItem>
              <StyledItemTitle>Artworks</StyledItemTitle>
              {media && !isEmpty(media) ? (
                <StyledArtworks>
                  <ArtworksCarousel media={media} />
                </StyledArtworks>
              ) : (
                <Empty />
              )}
            </StyledItem>

            <StyledLine />
            <StyledItem>
              <StyledItemTitle>About</StyledItemTitle>
              <StyledAbout>
                <div className='item'>{gallery.intro}</div>
                <div className='item'>
                  <div className='cover'>
                    <img src={gallery.cover} alt='cover' />
                  </div>
                  <p className='gallery-name'>{gallery.name}</p>
                </div>
              </StyledAbout>
            </StyledItem>

            <StyledLine />
            <StyledItem>
              <StyledItemTitle>Contracted Artists</StyledItemTitle>
              {
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 3,
                  }}
                  dataSource={indexArtist}
                  renderItem={ind => (
                    <List.Item>
                      <List
                        itemLayout={'vertical'}
                        header={ind[0]}
                        dataSource={ind[1]}
                        renderItem={artist => (
                          <List.Item>{artist.username}</List.Item>
                        )}
                      />
                    </List.Item>
                  )}
                />
              }
            </StyledItem>

            {me?.data.role === UserRole.Artist &&
              !me?.data.belongsTo.find(g => g.id === gallery.id) && (
                <>
                  <StyledLine />
                  <Button onClick={showModal}>Join Gallery</Button>
                  <Modal
                    title='confirm'
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}>
                    Are you sure you want to join?
                  </Modal>
                </>
              )}
            {!isEmpty(requests) && (
              <div>
                <h3>Join Requests:</h3>
                <List
                  size='small'
                  dataSource={requests}
                  renderItem={item => (
                    <List.Item>
                      {item.artist.username}
                      <Button
                        onClick={() => updateGalleryJoinRequest(item.id, true)}>
                        Accept
                      </Button>{' '}
                      <Button
                        onClick={() =>
                          updateGalleryJoinRequest(item.id, false)
                        }>
                        Reject
                      </Button>
                    </List.Item>
                  )}
                />{' '}
              </div>
            )}
          </>
        )}
      </Spin>
    </StyledWrapper>
  );
};

export default AGallery;

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
