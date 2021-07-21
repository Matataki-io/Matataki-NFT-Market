import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { message, Tabs } from 'antd';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { useLogin } from '../../../hooks/useLogin';
import { getGalleryId } from '../../../backend/gallery';
import { Gallery } from '../../../types/Gallery';
import JoinRequest from '../../../components/GalleryManagement/JoinRequest';
import ArtistManagement from '../../../components/GalleryManagement/ArtistManagement';
import WaitForPublish from '../../../components/GalleryManagement/WaitForPublish';

const ManageGallery: React.FC<void> = () => {
  const router = useRouter();
  const { id } = router.query;
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const { userDataByWallet } = useLogin();
  useEffect(() => {
    if (!isEmpty(gallery) && !isEmpty(userDataByWallet)) {
      if (
        gallery &&
        userDataByWallet?.username !== gallery.owner.username &&
        Number(userDataByWallet?.id) !== Number(gallery.owner.id)
      ) {
        message.info(
          'Modifying other people’s gallery information is not allowed'
        );
        router.push('/');
      }
    }

    console.log('userDataByWallet', userDataByWallet);
  }, [userDataByWallet, router, gallery]);

  // fetch gallery by id
  const fetchGallery = useCallback(async () => {
    try {
      if (!id) {
        return;
      }
      const res = await getGalleryId(Number(id));
      if (res.status === 200) {
        console.log('res', res.data);
        setGallery(res.data);
      } else {
        throw new Error('fail');
      }
    } catch (e) {
      console.log(e.toString());
    }
  }, [id]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  if (!gallery)
    return (
      <StyledWrapper>
        <StyledTitle>Loading Gallery</StyledTitle>
      </StyledWrapper>
    );

  return (
    <StyledWrapper>
      <StyledTitle>Gallery Management</StyledTitle>
      <StyledSubtitle>{gallery.name}</StyledSubtitle>
      <Tabs defaultActiveKey='artistManagement' centered>
        <Tabs.TabPane tab='Join Request' key='joinReqeust'>
          <JoinRequest />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Artist Management' key='artistManagement'>
          <ArtistManagement />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Waiting for Publish' key='waitForPublish'>
          <WaitForPublish />
        </Tabs.TabPane>
      </Tabs>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1200px;
  padding: 48px 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const StyledTitle = styled.h1`
  font-size: 40px;
  font-family: bigCaslonMedium, BigCaslon-Medium, BigCaslon, 'Playfair Display',
    serif;
  font-weight: 500;
  color: #333333;
  line-height: 1.2;
  padding: 0;
  margin: 0;
  text-align: center;
  @media screen and (max-width: 768px) {
    font-size: 30px;
  }
`;

const StyledSubtitle = styled.h2`
  font-size: 24px;
  font-family: bigCaslonMedium, BigCaslon-Medium, BigCaslon, 'Playfair Display',
    serif;
  font-weight: 400;
  color: #333333;
  line-height: 1.2;
  padding: 0;
  margin: 20px 0;
  text-align: center;
  @media screen and (max-width: 768px) {
    font-size: 30px;
  }
`;

export default ManageGallery;
