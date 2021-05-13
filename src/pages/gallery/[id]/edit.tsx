// noinspection DuplicatedCode

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Image, Input, message, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload/interface';
import { storageUploadFile } from '../../../backend/storage';
import { Page, Text } from '@geist-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { User } from '../../../types/User.types';
import { backendSWRFetcher } from '../../../backend/media';
import { createGallery, updateGallery } from '../../../backend/gallery';
import { UploadOutlined } from '@ant-design/icons';
import { Gallery } from '../../../types/Gallery';
import * as _ from 'lodash';

const Edit: React.FC<void> = () => {
  const router = useRouter();
  const { id } = useMemo(() => router.query, [router]);
  // noinspection DuplicatedCode
  const props: UploadProps = {
    accept: 'image/jpeg, image/png',
    name: 'file',
    action: storageUploadFile,
    method: 'PUT',
    maxCount: 1,
    listType: 'picture',
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
      if (id) {
        await updateGallery(id as any, value);
        message.success('Edit gallery success');
        await router.push(`/gallery/${id}`);
      }
    }
  }

  function onFinishFailed() {}

  const [form] = Form.useForm();
  const [gallery, setGallery] = useState<Gallery>();
  useEffect(() => {
    (async () => {
      if (id) {
        const g = await backendSWRFetcher(`/gallery/${id}`);
        setGallery(g);
        setCover(g.cover);
        form.setFieldsValue(g);
      }
    })();
  }, [id]);

  let [presentationsSrc, setPresentationsSrc] = useState([]);
  const [cover, setCover] = useState('');

  const normFile = (e: any) => {
    if (e.file.status === 'done') {
      setCover(e.file.response.data.url);
      return e.file.response.data.url;
    }
  };
  const normFiles = (e: any) => {
    if (_.every(e.fileList, f => f.status === 'done')) {
      setPresentationsSrc(e.fileList.map((f: any) => f.response.data.url));
      return e.fileList.map((f: any) => f.response.data.url);
    }
  };

  function onChangeCover(e: any) {
    if (e.file.status === 'done') {
      setCover(e.file.response.data.url);
    }
  }

  function onChangePresentations(e: any) {
    if (e.file.status === 'done') {
      if (_.every(e.fileList, f => f.status === 'done')) {
        setPresentationsSrc(e.fileList.map((f: any) => f.response.data.url));
      }
    }
  }

  return (
    <Page>
      <Text h1>Create Gallery</Text>
      <Text>You must be the Super Admin to create a gallery</Text>
      <Form
        form={form}
        initialValues={gallery}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
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
          label='Presentations'
          name='presentations'
          rules={[
            { required: true, message: 'Please upload gallery presentations!' },
          ]}
          getValueFromEvent={normFiles}>
          <Upload {...props} onChange={onChangePresentations}>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
            {!_.isEmpty(presentationsSrc) && (
              <Image
                src={presentationsSrc[0]}
                alt={'presentations'}
                width={300}
              />
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          label='Cover'
          name='cover'
          rules={[{ required: true, message: 'Please upload gallery cover!' }]}
          getValueFromEvent={normFile}>
          <Upload {...props} onChange={onChangeCover}>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
            <Image src={cover} width={300} />
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Page>
  );
};

export default Edit;
