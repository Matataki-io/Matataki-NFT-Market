import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWallet } from 'use-wallet';
import { useLogin } from '../../hooks/useLogin';

import { Form, Input, Button, Checkbox, message } from 'antd';

// 用户名校验
const usernamePattern = /^(?=[a-z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
// 允许的类型
const registerType = ['collector', 'artist', 'gallery'];

const Register: React.FC<void> = () => {
  const wallet = useWallet();
  const router = useRouter();
  const { type } = router.query;
  const { isRegistered, userDataByWallet, register } = useLogin();

  useEffect(() => {
    if (isRegistered) {
      message.info('已经注册过了');
      // router.push('/');
    }
    if (!registerType.includes(String(type))) {
      message.info('其他路由');
      // router.push('/');
    }
  }, [isRegistered, type]);

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    let { username } = values;
    try {
      await register({ username });
    } catch (e) {
      message.error(`e: ${e.toString()}`);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <StyledWrapper>
      <StyledTitle>
        {type === 'collector'
          ? 'Collector - Sign Up'
          : type === 'artist'
          ? 'Artist - Sign Up'
          : type === 'gallery'
          ? 'Gallery - Sign Up'
          : ''}
      </StyledTitle>
      <StyledSubtitle>
        Create and sell your unique digital artworks.
      </StyledSubtitle>

      <StyledForm
        name='form'
        initialValues={{ remember: true }}
        layout={'vertical'}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
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
          name='email'
          rules={[
            {
              required: false,
              type: 'email',
              message: 'Please input your email address!',
            },
          ]}>
          <Input disabled placeholder='Email address' />
        </Form.Item>

        <Form.Item
          label=''
          name='password'
          rules={[{ required: false, message: 'Please input your password!' }]}>
          <Input.Password
            disabled
            placeholder='Password'
            autoComplete='new-password'
          />
        </Form.Item>

        {type === 'artist' || type === 'gallery' ? (
          <Form.Item
            label=''
            name='code'
            rules={[
              { required: false, message: 'Please input your invite code!' },
            ]}>
            <Input disabled placeholder='Invite code' autoComplete='off' />
          </Form.Item>
        ) : null}

        <StyledButtonWrapper>
          {wallet.status === 'connected' ? (
            <StyledButton htmlType='submit' className='black'>
              REGISTER
            </StyledButton>
          ) : (
            <StyledButton onClick={() => wallet.connect('injected')}>
              CONNECT WALLET
            </StyledButton>
          )}
          <p>
            Already have an account?{' '}
            <Link href='/login'>
              <a>Login</a>
            </Link>
          </p>
          {type === 'collector' ? (
            <p>
              Interested in becoming an artist? Begin by applying{' '}
              <Link href='/'>
                <a>here</a>
              </Link>
            </p>
          ) : null}
        </StyledButtonWrapper>
      </StyledForm>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 520px;
  padding: 128px 20px 256px;
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
const StyledSubtitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
  padding: 0;
  margin: 16px 0 0 0;
  text-align: center;
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
`;
const StyledButtonWrapper = styled.div`
  margin-top: 64px;
  p {
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    line-height: 17px;
    text-align: center;
    a {
      font-size: 12px;
      font-weight: 400;
      color: #193cb1;
      line-height: 17px;
    }
  }
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
export default Register;
