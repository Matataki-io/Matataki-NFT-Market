import React from 'react';
import { Text } from '@geist-ui/react';
import { useRouter } from 'next/router';

export default function Bid() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className='bid-on-media'>
      <Text h1>Bid Page</Text>
      <Text>You are bidding on Token #{id}</Text>
    </div>
  );
}
