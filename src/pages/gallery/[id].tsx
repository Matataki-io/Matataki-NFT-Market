import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import GalleryCard from '../../components/GalleryCard';
import { Button, Divider, List, message, Modal, Spin } from 'antd';
import { User } from '../../types/User.types';
import { backendSWRFetcher } from '../../backend/media';
import { UserRole } from '../../constant';
import {
  createGalleryJoinRequest,
  findGalleryJoinRequest,
  updateGalleryJoinRequest,
} from '../../backend/gallery';
import {
  GalleryJoinRequest,
  GalleryJoinRequestStatus,
} from '../../types/GalleryJoinRequest';
import { Gallery } from '../../types/Gallery';

const AGallery: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: galleryData, error: galleryError } = useSWR(
    `/gallery/${id}`,
    backendSWRFetcher
  );

  const { data: meData, error: meError } = useSWR(
    `/user/me`,
    backendSWRFetcher
  );

  const [requests, setRequests] = useState<GalleryJoinRequest[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const gallery: Gallery = galleryData as Gallery;
      const res = await findGalleryJoinRequest({
        gallery,
        status: GalleryJoinRequestStatus.PENDING,
      });
      setRequests(res);
    };
    // noinspection JSIgnoredPromiseFromCall
    fetch();
  }, [galleryData]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!galleryData || !meData) return <Spin size='large' />;

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
      <GalleryCard {...galleryData} />
      <Divider orientation='left' />
      <h3>Artists:</h3>
      <List
        dataSource={galleryData.artists}
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
          <h3>Join Requests:</h3>
          <List
            size='small'
            dataSource={requests}
            renderItem={item => (
              <List.Item>
                {item.artist}
                <Button onClick={() => updateGalleryJoinRequest(item.id, true)}>
                  Accept
                </Button>{' '}
                <Button
                  onClick={() => updateGalleryJoinRequest(item.id, false)}>
                  Reject
                </Button>
              </List.Item>
            )}
          />{' '}
        </div>
      )}
    </div>
  );
};

export default AGallery;
