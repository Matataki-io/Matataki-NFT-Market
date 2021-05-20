import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import { Avatar, Button, message, Image, Table } from 'antd';
import { User } from '../../types/User.types';
import {
  backendSWRFetcher,
  mediaGasfreeCreateForPublisher,
  PostMedia,
  mediaSearch,
} from '../../backend/media';
import { findGalleryJoinRequest } from '../../backend/gallery';
import {
  GalleryJoinRequest,
  GalleryJoinRequestStatus,
} from '../../types/GalleryJoinRequest';
import { Gallery } from '../../types/Gallery';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { Media } from '../../types/Media.entity';
import { useLogin } from '../../hooks/useLogin';
import { useWallet } from 'use-wallet';
import { useBoolean } from 'ahooks';
import { useMedia } from '../../hooks/useMedia';

import type {
  MediaToScreen,
  MintAndTransferParameters,
} from '../../types/User.types';
import { Tag as TagType } from '../../types/Tag';

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
    console.log('list', list);
    // TODO: 这里复制过来的 ...
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

  const { data: gallery } = useSWR<Gallery, any>(
    id ? `/gallery/${id}` : null,
    backendSWRFetcher
  );

  const { data: me, error: meError } = useSWR<
    { data: User; status: number },
    any
  >(`/user/me`, backendSWRFetcher);

  const triggerReloadGallery = useCallback(() => mutate(`/gallery/${id}`), [
    id,
  ]);

  const isOwner = useMemo(
    () =>
      gallery &&
      userDataByWallet &&
      gallery.owner.id === userDataByWallet.id &&
      gallery.owner.username === userDataByWallet.username,
    [gallery, userDataByWallet]
  );

  // 是否申请加入画廊
  // 是否加入画廊

  // nft list

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
        message.info(`NFT 发布已上传到区块链，等待节点反馈`);
        // const txResp = await currentProvider?.getTransaction(resp.hash);
        // const receipt = await currentProvider?.getTransactionReceipt(resp.hash);
        const receipt = await resp.wait(1);
        console.info('receipt', receipt);
        // send txhash to backend
        const res = await PostMedia({
          txHash: receipt.transactionHash,
          tags: tags.map(t => t.name),
          gallery: Number(id),
          id: Number(mtsId),
        });
        console.log('res', res);
        message.success(`发布成功, Tx Hash: ${receipt.transactionHash}`);
        fetchIsPublished();
        await fetchMediaSearch();
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
    // eslint-disable-next-line
    [id, isSendingTx, mediaContract],
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

        if (isPublishedMap[id]) return <Button disabled>已发布 ✅</Button>;
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

  if (publishNFTs.length === 0)
    return (
      <StyledBox>No artist currently request to join this gallery.</StyledBox>
    );

  return (
    <StyledBox>
      <Table
        dataSource={publishNFTs}
        columns={publishNFTColumns}
        pagination={{
          position: ['bottomCenter'],
        }}
      />
    </StyledBox>
  );
};

export default AGallery;

const StyledNot = styled.div`
  margin: 40px 0;
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

const StyledBox = styled.div`
  display: block;
  margin: 20px 0;
`;
