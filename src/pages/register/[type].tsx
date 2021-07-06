import React, { useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWallet } from 'use-wallet';
import { useLogin } from '../../hooks/useLogin';

import { Form, Input, Button, message } from 'antd';

// 用户名校验
const usernamePattern = /^(?=[a-z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
// 允许的类型
// const registerType = ['collector', 'artist', 'gallery'];
const registerType = ['collector'];

const Register: React.FC<void> = () => {
  const wallet = useWallet();
  const router = useRouter();
  const { type } = router.query;
  const { isRegistered, userDataByWallet, register } = useLogin();

  useEffect(() => {
    if (isRegistered) {
      message.info('已经注册过了');
      router.push('/');
    }
    if (!registerType.includes(String(type))) {
      message.info('其他路由');
      router.push('/');
    }
  }, [isRegistered, router, type]);

  // register finish
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    let { username } = values;
    try {
      const token = await register({ username });
      if (token) {
        message.success('注册成功');
        router.push('/');
      } else {
        throw new Error('not token');
      }
    } catch (e) {
      message.error(`e: ${e.toString()}`);
    }
  };

  // register finish failed
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
          {/* <p>
            Already have an account?{' '}
            <Link href='/login'>
              <a>Login</a>
            </Link>
          </p> */}
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

  @media screen and (max-width: 576px) {
    padding: 60px 10px 160px;
  }
`;
const StyledTitle = styled.h1`
  font-size: 48px;
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  color: #333333;
  line-height: 1.4;
  padding: 0;
  margin: 0;
  text-align: center;
  @media screen and (max-width: 576px) {
    font-size: 30px;
  }
`;
const StyledSubtitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
  padding: 0;
  margin: 16px 0 0 0;
  text-align: center;
  @media screen and (max-width: 576px) {
    font-size: 14px;
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
