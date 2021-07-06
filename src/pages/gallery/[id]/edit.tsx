import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Avatar, Form, Input, Button, message, Upload, Image } from 'antd';
import { UploadProps } from 'antd/lib/upload/interface';
import { useRouter } from 'next/router';
import { useWallet } from 'use-wallet';
import {
  UserOutlined,
  PlusOutlined,
  LoadingOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { isEmpty } from 'lodash';

import { useLogin } from '../../../hooks/useLogin';
import { storageUploadFile } from '../../../backend/storage';
import { diffData } from '../../../utils';
import { Gallery } from '../../../types/Gallery';
import { getGalleryId, updateGallery } from '../../../backend/gallery';

const GalleryEdit: React.FC<void> = () => {
  const [formProfile] = Form.useForm();

  const wallet = useWallet();
  const router = useRouter();
  const { id } = router.query;
  const [gallery, setGallery] = useState<any>();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const { userDataByWallet } = useLogin();
  const [loading, setLoading] = useState<boolean>(false);
  const [presentationsSrc, setPresentationsSrc] = useState<string>();
  const [artworksFileList, setArtworksFileList] = useState<string[]>([]);

  useEffect(() => {
    if (!isEmpty(gallery) && !isEmpty(userDataByWallet)) {
      if (
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
      const res: any = await getGalleryId(Number(id));
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

  // 设置默认值
  useEffect(() => {
    if (!isEmpty(gallery)) {
      formProfile.setFieldsValue({
        name: gallery?.name,
        intro: gallery?.intro,

        aboutDescription: gallery?.about.description,
        aboutBanner: gallery?.about.banner,
        aboutBannerDescription: gallery?.about.bannerDescription,
        aboutTelegram: gallery?.about.telegram,
        aboutTwitter: gallery?.about.twitter,
        aboutMedium: gallery?.about.medium,
        aboutFacebook: gallery?.about.facebook,
        aboutDiscord: gallery?.about.discord,
        aboutEmail: gallery?.about.email,
      });
      setAvatarUrl(gallery?.cover || '');

      setPresentationsSrc(
        (gallery?.presentations && gallery?.presentations[0]) || ''
      );

      setArtworksFileList(gallery?.artworks || []);
    }
  }, [gallery, formProfile]);

  // edit fininsh
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    let {
      name,
      intro,
      // ---- about ----
      aboutDescription,
      aboutBanner,
      aboutBannerDescription,
      aboutEmail,
      aboutTelegram,
      aboutTwitter,
      aboutMedium,
      aboutFacebook,
      aboutDiscord,
      // ---- about ----
    } = values;

    let profile: Gallery = diffData(
      {
        name,
        intro,
        cover: avatarUrl!,
      } as Gallery,
      {
        name: gallery?.name,
        intro: gallery?.intro,
        cover: gallery?.cover,
      } as Gallery
    );

    console.log('profile', profile);

    profile.about = {
      description: aboutDescription,
      banner: aboutBanner,
      bannerDescription: aboutBannerDescription,
      telegram: aboutTelegram,
      twitter: aboutTwitter,
      medium: aboutMedium,
      facebook: aboutFacebook,
      discord: aboutDiscord,
      email: aboutEmail,
    };

    if (presentationsSrc) {
      profile.presentations = [presentationsSrc];
    } else {
      profile.presentations = [];
    }

    if (!isEmpty(artworksFileList) && artworksFileList.length) {
      profile.artworks = artworksFileList;
    } else {
      profile.artworks = [];
    }

    if (isEmpty(profile)) {
      message.info('没有修改');
      return;
    }
    try {
      const res: any = await updateGallery(Number(id), profile);
      console.log('res', res);
      if (res.code === 200) {
        message.success('更新成功');
        // router.push(`/${username}`);
      } else {
        throw new Error('更新失败');
      }
    } catch (e) {
      message.error(e.toString());
    }
  };
  // edit finish failed
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // 头像上传
  const onChangeAvatar = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
      setLoading(true);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      let url = info.file.response.data.url;
      setAvatarUrl(url);
      setLoading(false);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      setLoading(false);
    }
  };
  // about banner upload
  const onChangeAboutBanner = (info: any) => {
    console.log('info', info);
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
      setLoading(true);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      // const { url } = info.file.response.data;
      // const values = formProfile.getFieldsValue();
      // values.aboutBanner = url;

      // formProfile.setFieldsValue(values);

      const { response } = info.file;
      if (response.code === 200) {
        //
      } else {
        message.warning('upload fail');
      }

      setLoading(false);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      setLoading(false);
    }
  };
  // presentations upload
  const onChangePresentations = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
      setLoading(true);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      let url = info.file.response.data.url;
      setPresentationsSrc(url);
      setLoading(false);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      setLoading(false);
    }
  };
  // artworks upload
  const onChangeArtworks = (info: any) => {
    console.log('info', info);
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
      setLoading(true);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      let url = info.file.response.data.url;
      let _artworksFileList = artworksFileList.slice(0);
      _artworksFileList.push(url);
      setArtworksFileList(_artworksFileList);
      setLoading(false);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      setLoading(false);
    }
  };
  // remove artworks
  const onRemoveArtworks = (idx: number) => {
    let _artworksFileList = artworksFileList.slice(0);
    _artworksFileList.splice(idx, 1);
    setArtworksFileList(_artworksFileList);
  };

  const props: UploadProps = {
    accept: 'image/jpeg, image/png',
    name: 'file',
    action: storageUploadFile,
    method: 'PUT',
    maxCount: 1,
    beforeUpload(file: File) {
      message.info('Uploading...');

      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLtMB = file.size / 1024 / 1024 < 8;
      if (!isLtMB) {
        message.error('Image must smaller than 8MB!');
      }
      return isJpgOrPng && isLtMB;
    },
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // 获取 about banner
  const formImage = useCallback(() => {
    const values = formProfile.getFieldsValue();
    if (values.aboutBanner) {
      return values.aboutBanner;
    }
    return false;
  }, [formProfile]);

  // 返回 about banner
  const normFileAboutBanner = (e: any) => {
    if (e.file.status === 'done') {
      const { response } = e.file;
      if (response.code === 200) {
        return response.data.url;
      }
    }
  };

  return (
    <StyledWrapper>
      <StyledTitle>Gallery - Edit Profile</StyledTitle>
      <StyledAvatarItem>
        <Upload onChange={onChangeAvatar} {...props} className='upload'>
          <Avatar size={125} icon={<UserOutlined />} src={avatarUrl} />
        </Upload>
      </StyledAvatarItem>

      <StyledForm
        form={formProfile}
        name='formProfile'
        layout='vertical'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <StyledFormTitle>Info</StyledFormTitle>

        <Form.Item
          label=''
          name='name'
          rules={[
            {
              required: true,
              message: 'Please input your name',
            },
          ]}>
          <Input placeholder='Your name' autoComplete='off' />
        </Form.Item>
        <Form.Item
          label=''
          name='intro'
          rules={[
            {
              required: true,
              message: 'Please input your intro',
            },
          ]}>
          <Input placeholder='Your intro' autoComplete='off' />
        </Form.Item>
        <StyledPhotoWrapper>
          <StyledFormTitle>Presentations</StyledFormTitle>
          <StyledFormPresentationsUpload
            {...props}
            onChange={onChangePresentations}
            listType={'picture-card'}>
            {presentationsSrc ? (
              <img className='cover' src={presentationsSrc} alt={'cover'} />
            ) : (
              uploadButton
            )}
          </StyledFormPresentationsUpload>
        </StyledPhotoWrapper>
        <StyledPhotoWrapper>
          <StyledFormTitle>Artworks</StyledFormTitle>
          <StyledArtworks>
            {artworksFileList.map((i: string, idx: number) => (
              <StyledArtworksItem key={idx}>
                <Image width={120} src={i} />
                <CloseOutlined
                  className='icon'
                  onClick={() => onRemoveArtworks(idx)}
                />
              </StyledArtworksItem>
            ))}
          </StyledArtworks>

          <StyledFormArtworksUpload
            {...props}
            listType='picture-card'
            maxCount={10}
            onChange={onChangeArtworks}>
            {artworksFileList.length >= 10 ? null : uploadButton}
          </StyledFormArtworksUpload>
        </StyledPhotoWrapper>
        <StyledFormTitle>About</StyledFormTitle>
        <Form.Item
          label=''
          name='aboutDescription'
          rules={[{ required: false, message: 'Please input description!' }]}>
          <Input.TextArea
            placeholder='Enter description'
            rows={6}
            maxLength={5000}
            showCount
          />
        </Form.Item>
        <Form.Item
          label=''
          name='aboutBanner'
          rules={[{ required: false, message: 'Please input banner!' }]}
          style={{ borderBottom: 'none' }}
          getValueFromEvent={normFileAboutBanner}>
          <StyledFormAboutBannerUpload
            {...props}
            onChange={onChangeAboutBanner}
            listType={'picture-card'}>
            {formImage() ? (
              <img className='banner' src={formImage()} />
            ) : (
              uploadButton
            )}
          </StyledFormAboutBannerUpload>
        </Form.Item>
        <Form.Item
          label=''
          name='aboutBannerDescription'
          rules={[
            {
              required: false,
              message: 'Please input banner description!',
            },
          ]}>
          <Input placeholder='Enter banner description' />
        </Form.Item>
        <Form.Item
          label=''
          name='aboutEmail'
          rules={[
            {
              required: false,
              type: 'email',
              message: 'Please input email!',
            },
          ]}>
          <Input placeholder='Enter email' />
        </Form.Item>
        <Form.Item
          label=''
          name='aboutTelegram'
          rules={[{ required: false, message: 'Please input telegram!' }]}>
          <Input placeholder='Enter telegram' />
        </Form.Item>
        <Form.Item
          label=''
          name='aboutTwitter'
          rules={[{ required: false, message: 'Please input twitter!' }]}>
          <Input placeholder='Enter twitter' />
        </Form.Item>
        <Form.Item
          label=''
          name='aboutMedium'
          rules={[{ required: false, message: 'Please input medium!' }]}>
          <Input placeholder='Enter medium' />
        </Form.Item>
        <Form.Item
          label=''
          name='aboutFacebook'
          rules={[{ required: false, message: 'Please input facebook!' }]}>
          <Input placeholder='Enter facebook' />
        </Form.Item>
        <Form.Item
          label=''
          name='aboutDiscord'
          rules={[{ required: false, message: 'Please input discord!' }]}>
          <Input placeholder='Enter discord' />
        </Form.Item>
        <StyledItemWrapper>
          <StyledButton className='black' htmlType='submit'>
            SAVE
          </StyledButton>
        </StyledItemWrapper>
      </StyledForm>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 520px;
  padding: 48px 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 576px) {
    padding: 48px 10px 80px;
  }
`;

const StyledTitle = styled.h1`
  font-size: 40px;
  font-family: 'Playfair Display', serif;
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
const StyledFormTitle = styled.h3`
  font-size: 20px;
  font-weight: 500;
  color: #333333;
  line-height: 28px;
  padding: 0;
  margin: 0 0 40px 0;
`;

const StyledAvatarItem = styled.div`
  text-align: center;
  margin: 48px 0 0;
  .upload {
    cursor: pointer;
    display: inline-block;
    .ant-upload-list {
      display: none;
    }
  }
`;

const StyledForm = styled(Form)`
  margin-top: 56px;
  .ant-form-item {
    margin-bottom: 40px;
    border-bottom: 1px solid #d9d9d9;
    .ant-input,
    .ant-input-affix-wrapper {
      border: none;
    }
    .ant-input:focus,
    .ant-input-focused,
    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused {
      box-shadow: none;
    }
  }
  .not-border.ant-form-item {
    border: none;
  }
`;
const StyledItemWrapper = styled.div`
  margin-top: 48px;
`;
const StyledPhotoWrapper = styled.div`
  margin-bottom: 60px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 60px;
  border: 2px solid #333333;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
  margin-bottom: 16px;
  &.black {
    background: #333333;
    color: #ffffff;
    &:hover {
      color: #ffffff;
    }
  }
  &:hover {
    color: #333333;
    border-color: #333333;
  }
  &.ant-btn:hover,
  &.ant-btn:focus {
    border-color: #333333;
  }
`;
const StyledArtworks = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  @media screen and (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const StyledArtworksItem = styled.div`
  position: relative;
  width: 120px;
  .icon {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 20px;
    color: #222;
  }
`;
const StyledFormPresentationsUpload = styled(Upload)`
  .ant-upload {
    width: 100%;
    height: 270px;
    overflow: hidden;
  }
  .ant-upload-list-picture-card-container {
    display: none;
  }
  .cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const StyledFormArtworksUpload = styled(Upload)`
  .ant-upload {
    overflow: hidden;
  }
  .ant-upload-list-picture-card-container {
    display: none;
  }
  .cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StyledFormAboutBannerUpload = styled(Upload)`
  .ant-upload {
    width: 100%;
    height: 200px;
    overflow: hidden;
  }
  .ant-upload-list-picture-card-container {
    display: none;
  }
  .banner {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
export default GalleryEdit;
