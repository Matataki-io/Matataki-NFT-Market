import { Button, Table, Text } from '@geist-ui/react';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import { Spin } from 'antd';

import { backendSWRFetcher } from '../../../backend/media';
import { useMedia } from '../../../hooks/useMedia';
import { BidLog } from '../../../types/Bid';
import { getSymbolOf } from '../../../utils/tokens';
import { useMediaToken } from '../../../hooks/useMediaToken';
import { Bid } from '../../../types/ContractTypes';
import { getBidFor } from '../../../utils/MarketHelper';
import { Decimal } from '../../../utils/Decimal';
import Link from 'next/link';

function notNull(b: Bid | null): b is Bid {
  return Boolean(b);
}

export default function Bids() {
  const router = useRouter();
  const { id } = router.query;
  const wallet = useWallet();
  const { data, error } = useSWR<Array<BidLog>>(
    `/media/${id}/bids`,
    backendSWRFetcher
  );
  const [activeBids, setActiveBids] = useState<Record<string, Bid | null>>({});

  const getBidsDetail = useCallback(
    async (bidderList: string[]) => {
      const res = await getBidFor(id as string, bidderList);
      setActiveBids(res);
    },
    [id, setActiveBids]
  );

  useEffect(() => {
    if (!data || data.length === 0) return;
    const bidToBidders = data.map(b => b.bidder);
    const bidderList = bidToBidders.filter(
      (addr, idx) => bidToBidders.indexOf(addr) === idx
    );

    getBidsDetail(bidderList);
  }, [id, data]);

  const media = useMedia();
  const { isMeTheOwner } = useMediaToken(id as string);
  const acceptBid = useCallback(
    async (bid: Bid) => {
      if (!id) return;
      const tx = await media.acceptBid(id as string, {
        ...bid,
        sellOnShare: bid.sellOnShare,
      });
      const receipt = await tx.wait();
      alert(`Please check on EtherScan, txHash: ${receipt.transactionHash}`);
    },
    [id, media]
  );

  const removeBid = useCallback(async () => {
    if (!id) return;
    const tx = await media.removeBid(id as string);
    const receipt = await tx.wait();
    alert(`Please check on EtherScan, txHash: ${receipt.transactionHash}`);
  }, [id, media]);

  const activeBidsList = useMemo(() => {
    const list = Object.values(activeBids).filter(i => notNull(i)) as Bid[];
    return list.map(log => {
      const price = `${utils.formatUnits(log.amount, 18)} ${getSymbolOf(
        log.currency
      )}`;
      const acceptBidBtn = () => {
        if (wallet.status !== 'connected')
          return (
            <Button onClick={() => wallet.connect('injected')}>
              Connect Wallet
            </Button>
          );
        return isMeTheOwner ? (
          <Button type='error' auto size='mini' onClick={() => acceptBid(log)}>
            Accept Bid and Transfer
          </Button>
        ) : log.bidder === wallet.account ? (
          <Button type='secondary' auto size='mini' onClick={() => removeBid()}>
            Remove Bid
          </Button>
        ) : (
          <></>
        );
      };
      const sellOnShare = `${utils.formatUnits(log.sellOnShare.value, 18)}%`;
      return { ...log, price, acceptBidBtn, sellOnShare };
    });
  }, [activeBids, wallet]);
  if (!id) {
    return <div className='loading'>Loading ID from Router</div>;
  }

  if (data) {
    const renderedData = data?.map(log => {
      dayjs.extend(relativeTime);
      const date = dayjs(log.at.timestamp * 1000).fromNow();
      const price = `${utils.formatUnits(log.amount, 18)} ${getSymbolOf(
        log.currency
      )}`;
      return { ...log, date, price };
    });

    return (
      <StyledWrapper>
        <Text h1>现在的出价记录</Text>
        <p>Current Account: {wallet.account}</p>
        <Table data={activeBidsList}>
          <Table.Column prop='bidder' label='Bidder' />
          <Table.Column prop='price' label='Price' />
          <Table.Column prop='sellOnShare' label='Sell On Share' />
          <Table.Column prop='acceptBidBtn' label='Action' />
        </Table>
        <Link href={`/p/${id}/bid`}>
          <Button type='secondary'>Set Bid on this artwork</Button>
        </Link>
        <Text h1>历史出价日志</Text>
        <Table data={renderedData}>
          <Table.Column prop='bidder' label='买家' />
          <Table.Column prop='price' label='价格' />
          <Table.Column prop='status' label='状态' />
          <Table.Column prop='date' label='日期' />
        </Table>
      </StyledWrapper>
    );
  }
  return (
    <StyledWrapperLoading>
      <Spin tip='Loading Bids...'></Spin>
    </StyledWrapperLoading>
  );
}

const StyledWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 0 100px;
`;

const StyledWrapperLoading = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 0 100px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
