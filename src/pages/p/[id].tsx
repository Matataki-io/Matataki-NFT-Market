import React from 'react';
import { Button, Grid, Image, Link, Text } from '@geist-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useMediaNFT } from '../../hooks/useMediaNFT';
import { axiosFetcher } from '../../utils/swr.util';
import { getTokenOnScan } from '../../utils/token';

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;

  // const { data, error } = useSWR(`https://meta-nft-test.mttk.net/media/${id}`, axiosFetcher)
  const { backendData: data, metadata, isError } = useMediaNFT(Number(id));
  if (isError)
    return (
      <div>
        <Text h1>Sorry</Text>
        <Text>But the Token is not exist yet, please check with the URL</Text>
      </div>
    );
  if (!data || !metadata) return <div>loading...</div>;
  return (
    <div className='post-page'>
      <Grid.Container gap={2} justify='center'>
        <Grid xs={12}>
          <Image src={data.tokenURI} />
        </Grid>
        <Grid xs={6}>
          <div className='nft-info'>
            <Text h1 style={{ fontWeight: 400 }}>
              #{id} {metadata.name}
            </Text>
            <Text>Description: {metadata.description}</Text>
            <Text>File type: {metadata.mimeType}</Text>
            <Link color href={getTokenOnScan(id as string)} target='_blank'>
              Verify on BSCScan ↗️
            </Link>
            <Link color href={data.tokenURI} target='_blank'>
              Verify on IPFS ↗️
            </Link>
          </div>
        </Grid>
      </Grid.Container>
    </div>
  );
}
