import React, { useEffect, useState } from 'react';
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
} from 'antd';
import { UploadProps } from 'antd/lib/upload/interface';
import { useRouter } from 'next/router';
import { useWallet } from 'use-wallet';
import { UserOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

import { updateUser } from '../../../backend/user';
import { useLogin } from '../../../hooks/useLogin';
import { storageUploadFile } from '../../../backend/storage';
import { diffData } from '../../../utils';
import { getTags } from '../../../backend/tag';
import { Tag } from '../../../types/Tag';

// 用户名校验
const usernamePattern = /^(?=[a-z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
// 允许的类型
const registerType = ['collector', 'artist', 'gallery'];

interface UserProps {
  nickname?: string;
  bio?: string;
  username?: string;
  avatar?: string;
}

const Register: React.FC<void> = () => {
  const [formProfile] = Form.useForm();
  const wallet = useWallet();
  const router = useRouter();
  const { username } = router.query;
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const { isRegistered, userDataByWallet, register } = useLogin();
  const [tagsList, setTagsList] = useState<Array<Tag>>([]);

  useEffect(() => {
    if (!isRegistered) {
      // router.push('/');
    } else if (userDataByWallet?.username !== username) {
      // router.push('/');
    }
    console.log('userDataByWallet', userDataByWallet);
  }, [userDataByWallet, isRegistered, username]);

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
      });
      setAvatarUrl(userDataByWallet?.avatar || '');
    }
  }, [isRegistered, userDataByWallet, formProfile]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res: any = await getTags();
        console.log('res', res);
        if (res.status === 200) {
          setTagsList(res.data);
        }
      } catch (e) {
        console.log('error', e.toString());
      }
    };
    fetch();
  }, []);

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
    if (isEmpty(profile)) {
      message.info('没有修改');
      return;
    }
    const res = await updateUser(Number(userDataByWallet?.id), profile);
    console.log('res', res);
    if (res.data.code === 200) {
      message.success('更新成功');
      // router.push(`/${username}`);
    } else {
      message.error('更新失败');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const props: UploadProps = {
    accept: 'image/jpeg, image/png',
    name: 'file',
    action: storageUploadFile,
    method: 'PUT',
    maxCount: 1,
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        let url = info.file.response.data.url;
        setAvatarUrl(url);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file: File) {
      message.info('Uploading...');

      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
  };
  return (
    <StyledWrapper>
      <StyledTitle>
        {userDataByWallet?.role === 'COLLECTOR' ||
        userDataByWallet?.role === 'SUPER_ADMIN'
          ? 'Collector - Edit Profile'
          : userDataByWallet?.role === 'ARTIST'
          ? 'Artist - Edit Profile'
          : userDataByWallet?.role === 'GALLERY'
          ? 'Gallery - Edit Profile'
          : ''}
      </StyledTitle>
      <StyledAvatarItem>
        <Upload {...props} className='upload'>
          <Avatar size={125} icon={<UserOutlined />} src={avatarUrl}></Avatar>
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
        {userDataByWallet?.role === 'ARTIST' ||
        userDataByWallet?.role === 'GALLERY' ? (
          <>
            <Form.Item
              label=''
              name=''
              rules={[{ required: false, message: 'Please input your ..!' }]}>
              <Input.TextArea
                disabled
                rows={6}
                placeholder='Describe yourself compeletly…'
              />
            </Form.Item>
            <StyledPhotoWrapper>
              <StyledFormTitle>Personal Photo</StyledFormTitle>
              <StyledFormPhoto>
                <img
                  src='https://ipfs.fleek.co/ipfs/QmZZXE2ZnKWYmCN5vkHJuUKa5HBSrpcKy28XgKES12pHpu'
                  alt='Personal Photo'
                />
              </StyledFormPhoto>
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
        {userDataByWallet?.role === 'GALLERY' ? (
          <>
            <StyledFormTitle>Contracted Artists</StyledFormTitle>
            <Form.Item
              label=''
              name='medium'
              rules={[{ required: false, message: 'Please input username!' }]}>
              <Input disabled placeholder='Enter username' />
            </Form.Item>
            <Form.Item
              label=''
              name='medium'
              rules={[{ required: false, message: 'Please input username!' }]}>
              <Input disabled placeholder='Enter username' />
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
  font-size: 48px;
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  color: #333333;
  line-height: 58px;
  padding: 0;
  margin: 0;
  text-align: center;
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

const StyledFormPhoto = styled.div`
  height: 270px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
export default Register;
