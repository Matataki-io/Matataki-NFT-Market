import { Button, Table, Text } from '@geist-ui/react';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useWallet } from 'use-wallet';
import { backendSWRFetcher, getBidsOfToken } from '../../../backend/media';
import { useMedia } from '../../../hooks/useMedia';
import { Ask } from '../../../types/Ask';
import { BidLog } from '../../../types/Bid';
import { MediaLog } from '../../../types/MediaLog';
import { getDecimalOf, getSymbolOf } from '../../../utils/tokens';
import { isBackendAsk } from '../../../utils/TypeGuards';

export default function Logs() {
  const router = useRouter();
  const { id } = router.query;
  const wallet = useWallet();
  const { data, error } = useSWR<Array<Ask | MediaLog>>(
    `/media/${id}/logs`,
    backendSWRFetcher
  );
  //   const media = useMedia();

  if (!id) {
    return <div className='loading'>Loading ID from Router</div>;
  }

  if (data) {
    const renderedData = data?.map(log => {
      const date = new Date(log.at.timestamp * 1000).toLocaleString();
      if (isBackendAsk(log)) {
        const symbol = getSymbolOf(log.currency);
        const decimal = getDecimalOf(log.currency);
        let description = '';
        if (log.type === 'AskCreated')
          description = `主人 定价为 ${utils.formatUnits(
            log.amount,
            decimal
          )} ${symbol}`;
        if (log.type === 'AskRemoved')
          description = `主人删除了 ${utils.formatUnits(
            log.amount,
            decimal
          )} ${symbol} 的定价`;
        return { ...log, date, description };
      } else {
        const actionName = log.type === 'Approval' ? '授权' : '转让';
        const description = `${log.from} ${actionName}该 Token 给 ${log.to}`;
        return { ...log, date, description };
      }
      //   const price = `${utils.formatUnits(log.amount, 18)} ${getSymbolOf(
      //     log.currency
      //   )}`;
      //   const acceptBidBtn = () => {
      //     return wallet.status === 'connected' ? (
      //       <Button type='error' auto size='mini' onClick={() => acceptBid(log)}>
      //         接受
      //       </Button>
      //     ) : (
      //       <Button onClick={() => wallet.connect('injected')}>
      //         Connect Wallet
      //       </Button>
      //     );
      //   };
    });
    return (
      <div className='logs'>
        {JSON.stringify(data)}
        <Text h1>Media Logs</Text>
        <Table data={renderedData}>
          <Table.Column prop='type' label='状态' />
          <Table.Column prop='description' label='行为描述' />
          <Table.Column prop='date' label='日期' />
          {/* <Table.Column prop='acceptBidBtn' label='操作' /> */}
        </Table>
      </div>
    );
  }
  return <div className='loading'>Loading Bids</div>;
}
