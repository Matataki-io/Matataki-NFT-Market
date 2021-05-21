import React, { useState } from 'react';
import { useWallet } from 'use-wallet';
import { useSigner } from '../../hooks/useSigner';
import { Button, Typography } from 'antd';

const { Paragraph } = Typography;

export default function TestSignerHook() {
  const wallet = useWallet();
  const { signer, isSignerReady } = useSigner();

  const [res, setRes] = useState('');

  async function signMsg() {
    if (!isSignerReady(signer)) {
      alert('No Signer detected');
      return;
    }
    const res = await signer.signMessage('are u OK');
    setRes(res);
  }

  if (!isSignerReady(signer))
    return (
      <div className='no-signer'>
        <Paragraph>No Signer</Paragraph>
        <Button onClick={() => wallet.connect('injected')}>Connect</Button>
      </div>
    );

  return (
    <div className='signer-exist'>
      <Paragraph>{res}</Paragraph>
      <Button onClick={() => signMsg()}>Sign</Button>
    </div>
  );
}
