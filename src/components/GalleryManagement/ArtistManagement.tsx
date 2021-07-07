import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import { Avatar, Button, message, Space, Popconfirm } from 'antd';
import { User } from '../../types/User.types';
import { backendSWRFetcher } from '../../backend/media';
import { updateGallery } from '../../backend/gallery';
import { Gallery } from '../../types/Gallery';
import { cloneDeep } from 'lodash';
import Link from 'next/link';
import styled from 'styled-components';
import { shortedAccount } from '../../utils/index';

const ArtistManagement: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: gallery } = useSWR<Gallery, any>(
    id ? `/gallery/${id}` : null,
    backendSWRFetcher
  );

  const triggerReloadGallery = useCallback(() => mutate(`/gallery/${id}`), [
    id,
  ]);

  // remove artist
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

  if (!gallery) return <StyledBox>Loading...</StyledBox>;

  if (gallery.artists.length === 0)
    return <StyledBox>No artist currently in this gallery.</StyledBox>;

  return (
    <StyledBox>
      {gallery?.artists.map((item: any, idx: number) => (
        <StyledJoinItem key={item.id}>
          <Avatar src={item.avatar}></Avatar>{' '}
          <Link href={`/${item.username}`}>
            <a target='_blank'>
              {shortedAccount(item.nickname)}({item.username})
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
  );
};

export default ArtistManagement;

const StyledBox = styled.div`
  display: block;
  margin: 20px 0;
`;
const StyledJoinItem = styled.div`
  display: block;
  margin: 10px 0;
`;
