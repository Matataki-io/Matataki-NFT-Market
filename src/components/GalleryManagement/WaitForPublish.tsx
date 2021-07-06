import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Avatar, Button, message, Image, Table, notification } from 'antd';
import { User } from '../../types/User.types';
import {
  backendSWRFetcher,
  mediaGasfreeCreateForPublisher,
  PostMedia,
} from '../../backend/media';
import { Gallery } from '../../types/Gallery';
import styled from 'styled-components';
import { useLogin } from '../../hooks/useLogin';
import { useWallet } from 'use-wallet';
import { useBoolean } from 'ahooks';
import { useMedia } from '../../hooks/useMedia';

import type {
  MediaToScreen,
  MintAndTransferParameters,
} from '../../types/User.types';
import { Tag as TagType } from '../../types/Tag';

import PublishFixTool from '../PublishFixTool';

const WaitForPublish: React.FC = () => {
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
  // 艺术家上传到画廊的NFTs
  const [publishNFTs, setPublishNFTs] = useState<any[]>([]);

  // fetch is published
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

  const { data: gallery } = useSWR<Gallery, any>(
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

  // publish nft
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
      sendTxFinished,
      fetchIsPublished,
      toggleSendTx,
      fetchPublishNFTs,
    ]
  );

  const publishNFTColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      fixed: 'left',
    },
    {
      title: 'Cover',
      dataIndex: 'tokenURI',
      key: 'tokenURI',
      // eslint-disable-next-line react/display-name
      render: (c: string) => (
        <Image width={80} height={80} style={{ objectFit: 'cover' }} src={c} />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      key: 'id',
      // eslint-disable-next-line react/display-name
      render: (creator: User) => (
        <div className='user-card'>
          <Avatar src={creator.avatar} /> {creator.nickname}({creator.username})
        </div>
      ),
    },
    {
      title: 'Status and operation',
      dataIndex: 'id',
      key: 'id',
      // eslint-disable-next-line react/display-name
      render: (id: number, mts: MediaToScreen) => {
        // 数据库已经处理好了
        if (mts.isPublished) {
          return <Button disabled>已发布</Button>;
        }

        // 链上已经处理好了
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
        scroll={{ x: 1100 }}
      />
      <PublishFixTool
        data={publishNFTs}
        galleryId={Number(id)}></PublishFixTool>
    </StyledBox>
  );
};

export default WaitForPublish;

const StyledBox = styled.div`
  display: block;
  margin: 20px 0;
`;
