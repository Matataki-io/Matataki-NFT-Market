import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Form, Input, Button, Checkbox } from 'antd';

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
      <h1>Account Login</h1>
      <p>Create and sell your unique digital artworks.</p>

      <Form
        {...layout}
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <Form.Item
          label='Email address'
          name='email'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>
        <div>
          <Link href='/register/findpassword'>
            <a>Forgot your password?</a>
          </Link>
        </div>
        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            CONNECT WALLET
          </Button>
          <br />
          <Button type='primary' htmlType='submit'>
            SIGN IN
          </Button>
          <p>
            Don’t have an account?
            <Link href='/register'>
              <a>Sign Up</a>
            </Link>
          </p>
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
