import { Button, Card, Divider, Input, Page, Text } from '@geist-ui/react';
import React, { useCallback, useState } from 'react';
import { useWallet } from 'use-wallet';
import { GenerateCreationSignature } from '../../blockchain/nft';
import { useMedia } from '../../hooks/useMedia';
import { useSigner } from '../../hooks/useSigner';
import { MintAndTransferParameters } from '../../types/MintAndTransfer';

export default function MintPageDevPage() {
  const wallet = useWallet();
  const { signer, isSignerReady } = useSigner();
  const mediaContract = useMedia();
  const [res, updateSig] = useState<MintAndTransferParameters | null>(null);

  // https://ipfs.fleek.co/ipfs/QmReTHhzaPKTRyKre3FqXzzn8uyHGU9Kq4Ycs6fdr1jncq
  const [tokenURI, updateTokenURI] = useState('');
  // https://ipfs.fleek.co/ipfs/QmU5cKtsaQRAyozt7YtTBCd4QZdedUZG9okY9AwXMD9Cnr
  const [fileHash, updateTokenHash] = useState('');

  // 4a67e7d91100efbf6664ea6dffb4e8a128f2c5bc4321b3132e93bfc7178e4cd7
  const [metadataURI, updateMetadataURI] = useState('');
  // d6d1c1cda7156799beea3d2ecb519a1b97d6b7ac73ed657c9add16038d160794
  const [metadataHash, updateMetadataHash] = useState('');
  // 0x7fd97686785Cb93098FA25d0D6c47Cb0513B9A01
  const [newOwner, updateNewOwner] = useState('');

  const [creatorShare, updateCreatorShare] = useState(0);

  const signMsg = useCallback(async () => {
    if (!isSignerReady(signer)) return;
    const result = await GenerateCreationSignature(
      tokenURI,
      metadataURI,
      fileHash,
      metadataHash,
      newOwner,
      creatorShare,
      signer
    );
    updateSig(result);
  }, [
    mediaContract,
    signer,
    tokenURI,
    fileHash,
    metadataURI,
    metadataHash,
    newOwner,
    creatorShare,
  ]);

  const sendPermit = useCallback(async () => {
    if (!res) return;
    const resp = await mediaContract.mintAndTransferWithSig(
      wallet.account as string,
      res?.data,
      res?.bidShares,
      res?.to,
      res?.sig
    );
    const receipt = await resp.wait();
    console.info('re', receipt);
    alert('txHash' + receipt.transactionHash);
  }, [res, wallet]);

  if (!isSignerReady(signer))
    return (
      <div className='no-signer'>
        <Text>No Signer</Text>
        <Button onClick={() => wallet.connect('injected')}>Connect</Button>
      </div>
    );

  return (
    <Page>
      <Text h1>New a NFT with Creation Permit</Text>
      <Text h4>
        Sign it and that guy can have your token, as you are the creator.
      </Text>
      <Card>
        <Input
          placeholder='Token URI'
          width='50%'
          onChange={e => updateTokenURI(e.target.value)}
        />
        <Input
          placeholder='Metadata URI'
          width='50%'
          onChange={e => updateMetadataURI(e.target.value)}
        />
        <Divider />
        <Input
          placeholder='Token File SHA256 Hash'
          width='50%'
          onChange={e => updateTokenHash(e.target.value)}
        />
        <Input
          placeholder='Token File SHA256 Hash'
          width='50%'
          onChange={e => updateMetadataHash(e.target.value)}
        />
        <Divider />
        <Input
          placeholder='Creator Shares. e.g: 50% is 50'
          width='50%'
          onChange={e => updateCreatorShare(Number(e.target.value))}
        />
        <Input
          placeholder='Send to who'
          width='50%'
          onChange={e => updateNewOwner(e.target.value)}
        />
      </Card>
      <Text>{JSON.stringify(res)}</Text>
      <Button onClick={() => signMsg()}>Sign</Button>
      {res && <Button onClick={() => sendPermit()}>sendPermit</Button>}
    </Page>
  );
}
