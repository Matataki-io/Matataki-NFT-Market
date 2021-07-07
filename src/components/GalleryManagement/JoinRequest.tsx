import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import { Avatar, Button, message, Space, Popconfirm } from 'antd';
import { User } from '../../types/User.types';
import { backendSWRFetcher } from '../../backend/media';
import {
  findGalleryJoinRequest,
  updateGalleryJoinRequest,
} from '../../backend/gallery';
import {
  GalleryJoinRequest,
  GalleryJoinRequestStatus,
} from '../../types/GalleryJoinRequest';
import { Gallery } from '../../types/Gallery';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import styled from 'styled-components';
import { shortedAccount } from '../../utils/index';

const JoinRequest: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [requests, setRequests] = useState<GalleryJoinRequest[]>([]);
  // 艺术家上传到画廊的NFTs

  const { data: gallery } = useSWR<Gallery, any>(
    id ? `/gallery/${id}` : null,
    backendSWRFetcher
  );

  const triggerReloadGallery = useCallback(() => mutate(`/gallery/${id}`), [
    id,
  ]);

  // fetch join list
  const fetchJoinFn = useCallback(async () => {
    try {
      if (!gallery) {
        return;
      }
      const res = await findGalleryJoinRequest({
        gallery: { id: gallery.id },
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

  // 加入画廊
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

  useEffect(() => {
    if (!isEmpty(gallery)) {
      fetchJoinFn();
    }
  }, [gallery, fetchJoinFn]);

  if (!requests) return <StyledBox>Loading...</StyledBox>;

  if (requests.length === 0)
    return (
      <StyledBox>No artist currently request to join this gallery.</StyledBox>
    );

  return (
    <StyledBox>
      {requests.map(item => (
        <StyledJoinItem key={item.id}>
          <Avatar src={item.artist.avatar}></Avatar>{' '}
          <Link href={`/${item.artist.username}`}>
            <a target='_blank'>
              {shortedAccount(item.artist.nickname)}({item.artist.username})
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
  );
};

export default JoinRequest;

const StyledBox = styled.div`
  display: block;
  margin: 20px 0;
`;
const StyledJoinItem = styled.div`
  display: block;
  margin: 10px 0;
`;
