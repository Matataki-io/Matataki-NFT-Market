import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { localFetcher } from '../../backend/client';
import GalleryCard from '../../components/GalleryCard';
import {
  Button,
  Divider,
  List,
  message,
  Modal,
  Pagination,
  Spin,
  Typography,
} from 'antd';
import { User } from '../../types/User.types';
import { backendSWRFetcher } from '../../backend/media';
import { UserRole } from '../../constant';
import { createGalleryJoinRequest } from '../../backend/gallery';

const AGallery: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(`/gallery/${id}`, localFetcher);

  const { data: meData, error: meError } = useSWR(
    `/user/me`,
    backendSWRFetcher
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!data || !meData) return <Spin size='large' />;

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

  return (
    <div>
      <GalleryCard {...data} />
      <Divider orientation='left' />
      <h3>Artists:</h3>
      <List
        dataSource={data.artists}
        renderItem={(item: User) => <List.Item>{item.username}</List.Item>}
      />
      {meData.data.role === UserRole.Artist && (
        <>
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
      {meData.data.role === UserRole.Gallery && (
        <div>
          request list
          {/*<List*/}
          {/*  size='small'*/}
          {/*  dataSource={data}*/}
          {/*  renderItem={item => <List.Item>{item}</List.Item>}*/}
          {/*/>{' '}*/}
        </div>
      )}
    </div>
  );
};

export default AGallery;
