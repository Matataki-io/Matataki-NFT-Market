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

const GalleryCreate: React.FC = () => {
  const [cover, setCover] = useState('');
  const normFile = (e: any) => {
    if (e.file.status === 'done') {
      const url = e.file.response.data.url;
      setCover(url);
      return url;
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
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
  };
  const router = useRouter();
  const { data: me, error } = useSWR<{ data: User; status: number }, any>(
    '/user/me',
    backendSWRFetcher
  );

  async function onFinish(value: {
    name: string;
    intro: string;
    cover: string;
  }) {
    console.log(value);
    if (!me) message.info('waiting fetch user info');
    else {
      await createGallery({ ...value, artists: [], owner: me.data });
      message.success('create gallery success');
      await router.push('/gallery');
    }
  }

  function onFinishFailed() {}

  return (
    <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
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
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GalleryCreate;
