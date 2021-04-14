import { Button, Table, Text } from '@geist-ui/react';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useWallet } from 'use-wallet';
import { backendSWRFetcher, getBidsOfToken } from '../../../backend/media';
import { useMedia } from '../../../hooks/useMedia';
import { BidLog } from '../../../types/Bid';
import { getSymbolOf } from '../../../utils/tokens';

export default function Bids() {
  const router = useRouter();
  const { id } = router.query;
  const wallet = useWallet();
  const { data, error } = useSWR<Array<BidLog>>(
    `/media/${id}/bids`,
    backendSWRFetcher
  );
  const media = useMedia();
  const acceptBid = useCallback(
    async (bid: BidLog) => {
      if (!id) return;
      const tx = await media.acceptBid(id as string, {
        ...bid,
        sellOnShare: { value: bid.sellOnShare },
      });
      const receipt = await tx.wait();
    },
    [id, media]
  );
  if (!id) {
    return <div className='loading'>Loading ID from Router</div>;
  }

  if (wallet.status !== 'connected') {
    return (
      <Button onClick={() => wallet.connect('injected')}>Connect Wallet</Button>
    );
  }

  if (data) {
    const renderedData = data?.map(log => {
      const date = new Date(log.at.timestamp * 1000).toLocaleString();
      const price = `${utils.formatUnits(log.amount, 18)} ${getSymbolOf(
        log.currency
      )}`;
      const acceptBidBtn = () => {
        return (
          <Button type='error' auto size='mini' onClick={() => acceptBid(log)}>
            接受
          </Button>
        );
      };
      return { ...log, date, price, acceptBidBtn };
    });
    return (
      <div className='bids'>
        {JSON.stringify(data)}
        <Text h1>买家出价记录</Text>
        {wallet.account}
        <Table data={renderedData}>
          <Table.Column prop='bidder' label='买家' />
          <Table.Column prop='price' label='价格' />
          <Table.Column prop='status' label='状态' />
          <Table.Column prop='date' label='日期' />
          <Table.Column prop='acceptBidBtn' label='操作' />
        </Table>
      </div>
    );
  }
  return <div className='loading'>Loading Bids</div>;
}
