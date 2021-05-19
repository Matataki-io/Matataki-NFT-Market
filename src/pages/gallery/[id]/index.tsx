import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import {
  Avatar,
  Button,
  List,
  message,
  Modal,
  Spin,
  Space,
  Image,
  Table,
  Popconfirm,
  notification,
  Input,
  Select,
} from 'antd';
import { User } from '../../../types/User.types';
import {
  backendSWRFetcher,
  mediaGasfreeCreateForPublisher,
  PostMedia,
  mediaSearch,
} from '../../../backend/media';
import { BACKEND_CLIENT, UserRole } from '../../../constant';
import NFTSimple from '../../../components/NFTSimple';
import {
  createGalleryJoinRequest,
  findGalleryJoinRequest,
  updateGalleryJoinRequest,
  updateGallery,
} from '../../../backend/gallery';
import {
  GalleryJoinRequest,
  GalleryJoinRequestStatus,
} from '../../../types/GalleryJoinRequest';
import { Gallery } from '../../../types/Gallery';
import { isEmpty, cloneDeep } from 'lodash';
import ArtworksCarousel from '../../../components/ArtworksCarouselUser';
import Link from 'next/link';
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';
import { Media } from '../../../types/Media.entity';
import { GeneralResponse } from '../../../types/Backend.types';
import { useLogin } from '../../../hooks/useLogin';
import { wordItem } from '../../../utils/index';
import { ReactSVG } from 'react-svg';
import { useWallet } from 'use-wallet';
import { useBoolean } from 'ahooks';
import { useMedia } from '../../../hooks/useMedia';

import IconTelegram from '../../../assets/icons/telegram.svg';
import IconEmail from '../../../assets/icons/email1.svg';
import IconMedium from '../../../assets/icons/medium.svg';
import IconTwitter from '../../../assets/icons/twitter.svg';
import IconDiscord from '../../../assets/icons/discord.svg';
import IconFacebook from '../../../assets/icons/facebook.svg';

import type {
  MediaToScreen,
  MintAndTransferParameters,
} from '../../../types/User.types';
import { Tag as TagType } from '../../../types/Tag';
import PublishFixTool from '../../../components/PublishFixTool';

const { Option } = Select;

const AGallery: React.FC = () => {
  const wallet = useWallet();
  const mediaContract = useMedia();

  const router = useRouter();
  const { id } = router.query;
  const { userDataByWallet } = useLogin();
  const [isPublishedMap, updatePublishedMap] = useState<
    Record<number, boolean>
  >({});
  const isWalletReady = useMemo(() => wallet.status === 'connected', [
    wallet.status,
  ]);
  const [
    isSendingTx,
    { setTrue: toggleSendTx, setFalse: sendTxFinished },
  ] = useBoolean(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [requests, setRequests] = useState<GalleryJoinRequest[]>([]);
  // 艺术家上传到画廊的NFTs
  const [publishNFTs, setPublishNFTs] = useState<any[]>([]);

  const fetchIsPublished = useCallback(async () => {
    const list: MediaToScreen[] = publishNFTs;
    const contentHashes = list.map(
      (i: MediaToScreen) => i.permitData.data.contentHash
    );
    const status = await mediaContract['isContentUploaded(bytes32[])'](
      contentHashes
    );
    const aMap: any = {};
    list.forEach((mts, idx) => {
      aMap[mts.id] = status[idx];
    });
    updatePublishedMap(aMap);
  }, [publishNFTs, mediaContract]);

  useEffect(() => {
    if (publishNFTs && publishNFTs.length > 0) fetchIsPublished();
    const refreshInterval = setInterval(fetchIsPublished, 1000 * 30);
    return () => clearInterval(refreshInterval);
  }, [publishNFTs, fetchIsPublished]);

  const { data: gallery, error: galleryError } = useSWR<Gallery, any>(
    id ? `/gallery/${id}` : null,
    backendSWRFetcher
  );

  const triggerReloadGallery = useCallback(() => mutate(`/gallery/${id}`), [
    id,
  ]);

  const isOwner = useMemo(
    () =>
      gallery &&
      gallery.owner.id === userDataByWallet?.id &&
      gallery.owner.username === userDataByWallet?.username,
    [gallery, userDataByWallet]
  );

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

  const handleJoin = async (id: number, status: boolean) => {
    try {
      const res = await updateGalleryJoinRequest(id, status);
      if (res.status === 200) {
        message.success('操作成功');
        fetchJoinFn();
        if (status) {
          // true 才获取最新数据
          triggerReloadGallery();
        }
      } else {
        throw new Error('fail');
      }
    } catch (e) {
      message.error(e.toString());
    }
  };

  const handleRemoveArtist = async (idx: number) => {
    try {
      let list: User[] = cloneDeep(gallery?.artists) || [];
      list?.splice(idx, 1);
      const res: any = await updateGallery(Number(id), {
        artists: list,
      } as any);
      if (res.code === 200) {
        message.success('操作成功');
        triggerReloadGallery();
      } else {
        throw new Error('fail');
      }
    } catch (e) {
      message.error(e.toString());
    }
  };

  const artistWord = useMemo(() => {
    return wordItem(gallery?.artists);
  }, [gallery]);

  // fetch publish nfts
  const fetchPublishNFTs = useCallback(async () => {
    try {
      const res = await mediaGasfreeCreateForPublisher({
        gid: Number(id),
      });
      console.log(res);
      if (res.status === 200 && res.data.code === 200) {
        setPublishNFTs(res.data.data);
      } else {
        throw new Error('fail');
      }
    } catch (e) {
      console.log(e.toString());
    }
  }, [id]);

  const openNotification = ({
    description,
    duration = 4.5,
    key = '',
  }: {
    description: string;
    duration?: number | null;
    key?: string;
  }) => {
    notification.open({
      message: 'Notification Title',
      description: description,
      duration: duration,
      key: key,
    });
  };

  const sendPermit = useCallback(
    async (
      permitToMint: MintAndTransferParameters,
      tags: TagType[],
      mtsId: number
    ) => {
      // 防止误触
      if (isSendingTx) return;
      try {
        // isSendingTx will be true
        toggleSendTx();
        const resp = await mediaContract.mintAndTransferWithSig(
          permitToMint.creator,
          permitToMint.data,
          permitToMint.bidShares,
          permitToMint.to,
          permitToMint.sig
        );
        // console.info('resp', resp)
        // await new Promise((res) => setTimeout(res, 1000 * 15))
        const keyOne = `open${Date.now()}`;
        openNotification({
          description:
            'NFT 发布已上传到区块链，等待节点反馈。不要离开页面或者刷新！',
          duration: null,
          key: keyOne,
        });
        // const txResp = await currentProvider?.getTransaction(resp.hash);
        // const receipt = await currentProvider?.getTransactionReceipt(resp.hash);
        const receipt = await resp.wait(1);

        notification.close(keyOne);
        console.info('receipt', receipt);
        openNotification({
          description: `正在同步数据。不要离开页面或者刷新！${
            receipt.transactionHash ? 'hash:' + receipt.transactionHash : ''
          }`,
        });
        // send txhash to backend
        const res = await PostMedia({
          txHash: receipt.transactionHash,
          tags: tags.map(t => t.name),
          gallery: Number(id),
          id: Number(mtsId),
        });
        if (res.status == 201) {
          console.log('res', res);
          message.success(`发布成功, Tx Hash: ${receipt.transactionHash}`);
          fetchIsPublished();
          await fetchMediaSearch();
          await fetchPublishNFTs();
        } else {
          throw new Error('publish fail');
        }
      } catch (walletErr) {
        console.error('sendPermit::error: ', walletErr);
        mediaContract.callStatic
          .mintAndTransferWithSig(
            permitToMint.creator,
            permitToMint.data,
            permitToMint.bidShares,
            permitToMint.to,
            permitToMint.sig
          )
          .catch(callError => {
            message.error(`合约拒绝发布，理由：${callError.reason}`);
          });
      } finally {
        // isSendingTx will be false, no matter what
        sendTxFinished();
      }
    },
    [
      id,
      isSendingTx,
      mediaContract,
      fetchMediaSearch,
      sendTxFinished,
      fetchIsPublished,
      toggleSendTx,
      fetchPublishNFTs,
    ]
  );

  const publishNFTColumns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '封面',
      dataIndex: 'tokenURI',
      key: 'tokenURI',
      // eslint-disable-next-line react/display-name
      render: (c: string) => (
        <Image width={80} height={80} style={{ objectFit: 'cover' }} src={c} />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '艺术家',
      dataIndex: 'creator',
      key: 'creator',
      // eslint-disable-next-line react/display-name
      render: (creator: User) => (
        <div className='user-card'>
          <Avatar src={creator.avatar} /> {creator.nickname}({creator.username})
        </div>
      ),
    },
    {
      title: '状态和操作',
      dataIndex: 'id',
      key: 'id',
      // eslint-disable-next-line react/display-name
      render: (id: number, mts: MediaToScreen) => {
        if (mts.isPublished) {
          return <Button disabled>已发布</Button>;
        }

        if (isPublishedMap[id]) {
          return <Button disabled>已发布 ✅</Button>;
        }
        if (!isWalletReady)
          return (
            <Button onClick={() => wallet.connect('injected')}>连接钱包</Button>
          );
        if (isWalletReady && mts.publisher.address !== wallet.account)
          return `请切换到钱包 ${mts.publisher.address}`;
        return (
          <Button
            onClick={() => sendPermit(mts.permitData, mts.tags, mts.id)}
            disabled={isSendingTx}>
            发布
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (!isEmpty(gallery)) {
      fetchJoinFn();
    }
  }, [gallery, fetchJoinFn]);

  useEffect(() => {
    if (isOwner) {
      fetchPublishNFTs();
    }
  }, [isOwner, fetchPublishNFTs]);

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
            </StyledHeadRight>
          </StyledHead>
          <StyledLine />

          {gallery?.presentations ? (
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
                {galleryAboutIconList.map((i: any) =>
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

          {!isEmpty(artistWord) ? (
            <>
              <StyledLine />
              <StyledItem>
                <StyledItemTitle>Contracted Artists</StyledItemTitle>
                <StyledWord>
                  {Object.keys(artistWord).map((key, idx) => (
                    <ul key={idx} className='item'>
                      <li>
                        <h3>{key.toLocaleUpperCase()}</h3>
                      </li>
                      {artistWord[key].map(
                        (
                          i: { username: string; nickname: string },
                          idx: number
                        ) => (
                          <li key={idx}>
                            <Link href={`/${i.username}`}>
                              <a>
                                {i.username}({i.nickname})
                              </a>
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  ))}
                </StyledWord>
              </StyledItem>
              <StyledLine />
            </>
          ) : null}

          {isOwner ? (
            <>
              <StyledItem>
                <StyledItemTitle>Manage application requests</StyledItemTitle>
                {!isEmpty(requests) ? (
                  <StyledBox>
                    {requests.map(item => (
                      <StyledJoinItem key={item.id}>
                        <Avatar src={item.artist.avatar}></Avatar>{' '}
                        <Link href={`/${item.artist.username}`}>
                          <a target='_blank'>
                            {item.artist.nickname}({item.artist.username})
                          </a>
                        </Link>
                        <Space style={{ margin: '0 0 0 20px' }}>
                          <Button
                            type='primary'
                            onClick={() => {
                              handleJoin(item.id, true);
                            }}>
                            Accept
                          </Button>
                          <Popconfirm
                            title='Are you sure to reject?'
                            onConfirm={() => handleJoin(item.id, false)}
                            okText='Yes'
                            cancelText='No'>
                            <Button type='primary' danger>
                              Reject
                            </Button>
                          </Popconfirm>
                        </Space>
                      </StyledJoinItem>
                    ))}
                  </StyledBox>
                ) : (
                  <StyledNot>Not...</StyledNot>
                )}
              </StyledItem>
              <StyledLine />

              <StyledItem>
                <StyledItemTitle>Manage artists</StyledItemTitle>
                {!isEmpty(gallery?.artists) ? (
                  <StyledBox>
                    {gallery?.artists.map((item, idx: number) => (
                      <StyledJoinItem key={item.id}>
                        <Avatar src={item.avatar}></Avatar>{' '}
                        <Link href={`/${item.username}`}>
                          <a target='_blank'>
                            {item.nickname}({item.username})
                          </a>
                        </Link>
                        <Space style={{ margin: '0 0 0 20px' }}>
                          <Popconfirm
                            title='Are you sure to remove?'
                            onConfirm={() => handleRemoveArtist(idx)}
                            okText='Yes'
                            cancelText='No'>
                            <Button type='primary' danger>
                              Remove
                            </Button>
                          </Popconfirm>
                        </Space>
                      </StyledJoinItem>
                    ))}
                  </StyledBox>
                ) : (
                  <StyledNot>Not...</StyledNot>
                )}
              </StyledItem>

              <StyledLine />
              <StyledItem>
                <StyledItemTitle>Manage NFTs</StyledItemTitle>
                {!isEmpty(publishNFTs) ? (
                  <StyledBox>
                    <Table
                      dataSource={publishNFTs}
                      columns={publishNFTColumns}
                      pagination={{
                        position: ['bottomCenter'],
                      }}
                    />
                    <PublishFixTool
                      data={publishNFTs}
                      galleryId={Number(id)}></PublishFixTool>
                  </StyledBox>
                ) : (
                  <StyledNot>Not...</StyledNot>
                )}
              </StyledItem>
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

const StyledNot = styled.div`
  margin: 40px 0;
`;

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
const StyledHeadRight = styled.div`
  @media screen and (max-width: 678px) {
    width: 100%;
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
    word-break: break-word;

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
const StyledBox = styled.div`
  display: block;
  margin: 20px 0;
`;
const StyledJoinItem = styled.div`
  display: block;
  margin: 10px 0;
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
