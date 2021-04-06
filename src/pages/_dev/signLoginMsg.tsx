import { Button, Input, Text, Textarea } from '@geist-ui/react';
import React, { useState } from 'react';
import { useWallet } from 'use-wallet';
import { useLogin } from '../../hooks/useLogin';

export default function SignLoginMsg() {
  const wallet = useWallet();
  const {
    permit,
    accessToken,
    loginWithSignature,
    isRegistered,
    register,
  } = useLogin();

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');

  async function signAndLogin() {
    await loginWithSignature();
  }

  async function registerAndLogin() {
    await register({ nickname, bio, username });
  }
  if (wallet.status !== 'connected') {
    return (
      <div className='please-connect'>
        <Button onClick={() => wallet.connect('injected')}>
          Connect Wallet by MetaMask
        </Button>
      </div>
    );
  }
  return (
    <div className='sign-login'>
      <Text h1>Sign Login Msg</Text>
      <Text>钱包是否已经注册过： {isRegistered ? '☑️' : '✖️'}</Text>
      {accessToken ? (
        <Text> 登陆成功 accessToken: {accessToken}</Text>
      ) : (
        JSON.stringify(permit)
      )}
      {isRegistered ? (
        <Button onClick={() => signAndLogin()}>签名并登陆</Button>
      ) : (
        <div className='reg-form'>
          <Input
            size='large'
            placeholder='用户名，全小写 + 数字'
            onChange={e => setUsername(e.target.value)}
          />
          <Input
            size='large'
            placeholder='昵称'
            onChange={e => setNickname(e.target.value)}
          />
          <Textarea
            placeholder='个人介绍'
            onChange={e => setBio(e.target.value)}
          />
          <Button onClick={() => registerAndLogin()}>签名并注册</Button>
        </div>
      )}
    </div>
  );
}
