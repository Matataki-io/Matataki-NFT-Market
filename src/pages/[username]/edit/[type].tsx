import React from 'react';
import styled from 'styled-components';
import { Avatar, Form, Input, Button } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Register: React.FC<void> = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <StyledWrapper>
      <h1>Collector - Edit Profile</h1>
      <h1>Artist - Edit Profile</h1>
      <h1>Gallery - Edit Profile</h1>
      <Avatar></Avatar>

      <Form
        {...layout}
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <div>Info</div>
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='bio'
          name='bio'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input placeholder='Single sentence to describe yourself' />
        </Form.Item>
        <Form.Item
          label='bio'
          name='bio'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.TextArea
            rows={6}
            placeholder='Describe yourself compeletly…'
          />
        </Form.Item>
        <div>Personal Photo</div>
        <div>
          <img src='' alt='' />
        </div>

        <div>Contact</div>
        <Form.Item
          label='Email address'
          name='email'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input placeholder='Email address' />
        </Form.Item>
        <Form.Item
          label='Twitter username'
          name='email'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input placeholder='Twitter username' />
        </Form.Item>
        <Form.Item
          label='Facebook username'
          name='email'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input placeholder='Facebook username' />
        </Form.Item>
        <Form.Item
          label='Telegram username'
          name='telegram'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input placeholder='Telegram username' />
        </Form.Item>
        <Form.Item
          label='Medium username'
          name='medium'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input placeholder='Medium username' />
        </Form.Item>
        <div>Contracted Artists</div>
        <Form.Item
          label='Medium username'
          name='medium'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input value='LaVine' />
        </Form.Item>
        <Form.Item
          label='Medium username'
          name='medium'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input value='Artist’s name' />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            SAVE
          </Button>
        </Form.Item>
      </Form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 520px;
  padding: 0 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

export default Register;
