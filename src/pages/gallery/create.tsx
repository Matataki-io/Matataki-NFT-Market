import React, { useState } from 'react';
import { Button, Form, Input, Upload, Image, message } from 'antd';
import { UploadProps } from 'antd/lib/upload/interface';
import { storageUploadFile } from '../../backend/storage';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { createGallery } from '../../backend/gallery';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { backendSWRFetcher } from '../../backend/media';
import { User } from '../../types/User.types';
import styled from 'styled-components';

const GalleryCreate: React.FC = () => {
  const [cover, setCover] = useState('');

  const normFile = (e: any) => {
    if (e.file.status === 'done') {
      const { response } = e.file;
      if (response.code === 200) {
        return response.data.url;
      }
    }
  };

  // noinspection DuplicatedCode
  const props: UploadProps = {
    accept: 'image/jpeg, image/png',
    name: 'file',
    action: storageUploadFile,
    method: 'PUT',
    maxCount: 1,
    listType: 'picture',
    onChange(e) {
      if (e.file.status === 'done') {
        const url = e.file.response.data.url;
        setCover(url);
      }
    },
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
  const router = useRouter();
  const { data: me, error } = useSWR<{ data: User; status: number }, any>(
    '/user/me',
    backendSWRFetcher
  );

  async function onFinish(value: any) {
    console.log(value);
    if (!me) message.info('waiting fetch user info');
    else {
      await createGallery({ ...value, artists: [], owner: me.data });
      message.success('create gallery success');
      await router.push('/gallery');
    }
  }

  function onFinishFailed(values: any) {
    console.log('fail valuel', values);
  }

  return (
    <StyledWrapper>
      <StyledTitle>Create Gallery</StyledTitle>
      <StyledSubtitle>
        You must be the Super Admin to create a gallery
      </StyledSubtitle>
      <StyledForm
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout='vertical'>
        <Form.Item
          label='Name'
          name='name'
          rules={[{ required: true, message: 'Please input gallery name!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='Intro'
          name='intro'
          rules={[{ required: true, message: 'Please input gallery intro!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='Cover'
          name='cover'
          rules={[{ required: true, message: 'Please upload gallery cover!' }]}
          getValueFromEvent={normFile}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
            <Image src={cover} />
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            Create
          </Button>
        </Form.Item>
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
const StyledSubtitle = styled.p`
  text-align: center;
  font-size: 14px;
  padding: 0;
  margin: 10px 0;
  font-weight: 400;
`;

const StyledForm = styled(Form)`
  margin-top: 40px;
`;

export default GalleryCreate;
