import { Button, Text } from '@geist-ui/react';
import React, { useCallback, useState } from 'react';
import { useWallet } from 'use-wallet';
import { GenerateCreationSignature } from '../../blockchain/nft';
import { useMedia } from '../../hooks/useMedia';
import { useSigner } from '../../hooks/useSigner';

export default function MintPageDevPage() {
  const wallet = useWallet();
  const { signer, isSignerReady } = useSigner();
  const mediaContract = useMedia();
  const [res, updateSig] = useState<any>();

  const signMsg = useCallback(async () => {
    if (!isSignerReady(signer)) return;
    const result = await GenerateCreationSignature(
      'https://ipfs.fleek.co/ipfs/QmReTHhzaPKTRyKre3FqXzzn8uyHGU9Kq4Ycs6fdr1jncq',
      'https://ipfs.fleek.co/ipfs/QmU5cKtsaQRAyozt7YtTBCd4QZdedUZG9okY9AwXMD9Cnr',
      '4a67e7d91100efbf6664ea6dffb4e8a128f2c5bc4321b3132e93bfc7178e4cd7',
      'd6d1c1cda7156799beea3d2ecb519a1b97d6b7ac73ed657c9add16038d160794',
      '0x7fd97686785Cb93098FA25d0D6c47Cb0513B9A01',
      50,
      signer
    );
    updateSig(result);
  }, [mediaContract, signer]);

  if (!isSignerReady(signer))
    return (
      <div className='no-signer'>
        <Text>No Signer</Text>
        <Button onClick={() => wallet.connect('injected')}>Connect</Button>
      </div>
    );

  return (
    <div className='signer-exist'>
      <Text>{JSON.stringify(res)}</Text>
      <Button onClick={() => signMsg()}>Sign</Button>
    </div>
  );
}
