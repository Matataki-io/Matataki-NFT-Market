import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  Avatar,
  Form,
  Input,
  Button,
  message,
  Upload,
  Checkbox,
  Row,
  Col,
  Image,
} from 'antd';
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

import { updateUser } from '../../../backend/user';
import { useLogin } from '../../../hooks/useLogin';
import { storageUploadFile } from '../../../backend/storage';
import { diffData } from '../../../utils';
import { getTags } from '../../../backend/tag';
import { Tag } from '../../../types/Tag';
import { UserRole } from '../../../constant';

// 用户名校验
const usernamePattern = /^(?=[a-z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

interface UserProps {
  nickname?: string;
  bio?: string;
  username?: string;
  avatar?: string;
  about?: any;
  presentations?: string[];
  artworks?: string[];
}

const Register: React.FC<void> = () => {
  const [formProfile] = Form.useForm();

  const wallet = useWallet();
  const router = useRouter();
  const { username } = router.query;
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const { isRegistered, userDataByWallet, register } = useLogin();
  const [tagsList, setTagsList] = useState<Array<Tag>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [presentationsSrc, setPresentationsSrc] = useState<string>();
  const [artworksFileList, setArtworksFileList] = useState<string[]>([]);

  useEffect(() => {
    if (!isEmpty(userDataByWallet) && !isEmpty(username)) {
      if (!isRegistered) {
        message.info('Please complete registration first');
        router.push('/');
      } else if (userDataByWallet?.username !== username) {
        message.info("Can't modify other people's information");
        router.push('/');
      }
      console.log('userDataByWallet', userDataByWallet);
    }
  }, [userDataByWallet, isRegistered, username, router]);

  // 设置默认值
  useEffect(() => {
    if (isRegistered) {
      formProfile.setFieldsValue({
        username: userDataByWallet?.username,
        nickname: userDataByWallet?.nickname,
        bio: userDataByWallet?.bio,
        email: userDataByWallet?.email,
        facebook: userDataByWallet?.facebook,
        medium: userDataByWallet?.medium,
        telegram: userDataByWallet?.telegram,
        twitter: userDataByWallet?.twitter,
        tags: userDataByWallet?.tags.map(i => i.name),

        aboutDescription: userDataByWallet?.about.description,
        aboutBanner: userDataByWallet?.about.banner,
        aboutBannerDescription: userDataByWallet?.about.bannerDescription,
        aboutTelegram: userDataByWallet?.about.telegram,
        aboutTwitter: userDataByWallet?.about.twitter,
        aboutMedium: userDataByWallet?.about.medium,
        aboutFacebook: userDataByWallet?.about.facebook,
        aboutDiscord: userDataByWallet?.about.discord,
        aboutEmail: userDataByWallet?.about.email,
      });
      setAvatarUrl(userDataByWallet?.avatar || '');

      setPresentationsSrc(
        (userDataByWallet?.presentations &&
          userDataByWallet?.presentations[0]) ||
          ''
      );

      setArtworksFileList(userDataByWallet?.artworks || []);
    }
  }, [isRegistered, userDataByWallet, formProfile]);

  // fetch tags
  useEffect(() => {
    const fetch = async () => {
      try {
        const res: any = await getTags();
        // console.log('res', res);
        if (res.status === 200) {
          setTagsList(res.data);
        }
      } catch (e) {
        console.log('error', e.toString());
      }
    };
    fetch();
  }, []);

  // edit fininsh
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    let {
      bio,
      username,
      nickname,
      email,
      facebook,
      medium,
      telegram,
      twitter,
      tags,
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

    let profile: UserProps = diffData(
      {
        username,
        nickname,
        bio,
        avatar: avatarUrl!,
        email,
        facebook,
        medium,
        telegram,
        twitter,
        tags,
      } as UserProps,
      {
        username: userDataByWallet?.username,
        nickname: userDataByWallet?.nickname,
        bio: userDataByWallet?.bio,
        avatar: userDataByWallet?.avatar,
        email: userDataByWallet?.email,
        facebook: userDataByWallet?.facebook,
        medium: userDataByWallet?.medium,
        telegram: userDataByWallet?.telegram,
        twitter: userDataByWallet?.twitter,
        tags: userDataByWallet?.tags.map(i => i.name),
      } as UserProps
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

    if (artworksFileList && artworksFileList.length) {
      profile.artworks = artworksFileList;
    } else {
      profile.artworks = [];
    }

    if (isEmpty(profile)) {
      message.info('没有修改');
      return;
    }
    try {
      const res = await updateUser(Number(userDataByWallet?.id), profile);
      console.log('res', res);
      if (res.data.code === 200) {
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
      <StyledTitle>
        {userDataByWallet?.role === 'COLLECTOR' ||
        userDataByWallet?.role === 'SUPER_ADMIN'
          ? 'Collector - Edit Profile'
          : userDataByWallet?.role === 'ARTIST'
          ? 'Artist - Edit Profile'
          : ''}
      </StyledTitle>
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
          name='username'
          rules={[
            {
              required: true,
              pattern: usernamePattern,
              message: `Only numbers, characters a-z(lower case) '-' and the length is 5-20 are acceptable.`,
            },
          ]}>
          <Input placeholder='Your username' autoComplete='off' />
        </Form.Item>
        <Form.Item
          label=''
          name='nickname'
          rules={[
            {
              required: false,
              message: 'Please input your nickname',
            },
          ]}>
          <Input placeholder='Your nickname' autoComplete='off' />
        </Form.Item>
        <Form.Item
          label=''
          name='bio'
          rules={[{ required: true, message: 'Please input your bio!' }]}>
          <Input placeholder='Describe yourself by single sentence' />
        </Form.Item>
        {userDataByWallet?.role === 'ARTIST' ? (
          <>
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
          </>
        ) : null}
        <StyledFormTitle>Contact</StyledFormTitle>
        <Form.Item
          label=''
          name='email'
          rules={[
            {
              required: false,
              type: 'email',
              message: 'Please input your email address',
            },
          ]}>
          <Input placeholder='Email address' />
        </Form.Item>
        <Form.Item
          label=''
          name='twitter'
          rules={[
            { required: false, message: 'Please input your twitter username' },
          ]}>
          <Input placeholder='Twitter username' />
        </Form.Item>
        <Form.Item
          label=''
          name='facebook'
          rules={[
            { required: false, message: 'Please input your facebook username' },
          ]}>
          <Input placeholder='Facebook username' />
        </Form.Item>
        <Form.Item
          label=''
          name='telegram'
          rules={[
            { required: false, message: 'Please input your telegram username' },
          ]}>
          <Input placeholder='Telegram username' />
        </Form.Item>
        <Form.Item
          label=''
          name='medium'
          rules={[
            { required: false, message: 'Please input your medium username' },
          ]}>
          <Input placeholder='Medium username' />
        </Form.Item>
        <StyledFormTitle>Tags</StyledFormTitle>
        <Form.Item name='tags' className='not-border'>
          <Checkbox.Group>
            <Row>
              {tagsList.map((i, idx) => (
                <Col span={12} key={idx}>
                  <Checkbox value={i.name}>{i.name}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
        {userDataByWallet?.role === UserRole.Artist ? (
          <>
            <StyledFormTitle>About</StyledFormTitle>
            <Form.Item
              label=''
              name='aboutDescription'
              rules={[
                { required: false, message: 'Please input description!' },
              ]}>
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
          </>
        ) : null}
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
export default Register;
