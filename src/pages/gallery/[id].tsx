import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Button, Divider, Image, List, message, Modal, Spin } from 'antd';
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
import { isEmpty } from 'lodash';

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
    if (gallery?.owner.id === me?.data.id) {
      fetch();
    }
  }, [gallery, me]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!gallery || !me) return <Spin size='large' />;

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
      <div>
        <Image src={gallery.cover} alt={'gallery cover'} />
        <h3>{gallery.name}</h3>
        <p>{gallery.intro}</p>
      </div>
      <Divider orientation='left' />
      <h3>Artists:</h3>
      <List
        dataSource={gallery.artists}
        renderItem={(item: User) => <List.Item>{item.username}</List.Item>}
      />
      {me.data.role === UserRole.Artist && (
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
      {!isEmpty(requests) && (
        <div>
          <h3>Join Requests:</h3>
          <List
            size='small'
            dataSource={requests}
            renderItem={item => (
              <List.Item>
                {item.artist.username}
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
