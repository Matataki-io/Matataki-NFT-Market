import { Table, Text } from '@geist-ui/react';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import { Spin, Button, Typography, message, notification } from 'antd';

import { backendSWRFetcher } from '../../../backend/media';
import { useMedia } from '../../../hooks/useMedia';
import { BidLog } from '../../../types/Bid';
import { useMediaToken } from '../../../hooks/useMediaToken';
import { Bid } from '../../../types/ContractTypes';
import { getBidFor } from '../../../utils/MarketHelper';
import Link from 'next/link';
import { shortedWalletAccount } from '../../../utils/index';
import BidsPrice from '../../../components/Bids/Price';

const { Paragraph } = Typography;

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

  const triggerReloadBids = useCallback(() => mutate(`/media/${id}/bids`), [
    id,
  ]);

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
  }, [id, data, getBidsDetail]);

  const openNotification = ({
    description,
    duration = 4.5,
    key = '',
  }: {
    description: string;
    duration?: number | null;
    key?: string;
  }) => {
    notification.open({
      message: 'Notification',
      description: description,
      duration: duration,
      key: key,
    });
  };

  const media = useMedia();
  const { isMeTheOwner } = useMediaToken(id as string);
  const acceptBid = useCallback(
    async (bid: Bid) => {
      if (!id) {
        message.warning('not id');
        return;
      }

      try {
        const tx = await media.acceptBid(id as string, {
          ...bid,
          sellOnShare: bid.sellOnShare,
        });

        const keyOne = `open${Date.now()}`;
        openNotification({
          description:
            'Accepting bid... Wait for the contract confirmation, please do not refresh or leave the page.',
          duration: null,
          key: keyOne,
        });

        const receipt = await tx.wait();

        await triggerReloadBids();

        notification.close(keyOne);
        openNotification({
          description: `Please check on EtherScan. ${
            receipt.transactionHash
              ? 'transactionHash:' + receipt.transactionHash
              : ''
          }`,
        });
      } catch (e) {
        console.log(e.toString());
      }
    },
    [id, media, triggerReloadBids]
  );

  const removeBid = useCallback(async () => {
    if (!id) {
      message.warning('not id');
      return;
    }
    try {
      const tx = await media.removeBid(id as string);

      const keyOne = `open${Date.now()}`;
      openNotification({
        description:
          'Deleting bid... Wait for the contract confirmation, please do not refresh or leave the page.',
        duration: null,
        key: keyOne,
      });

      const receipt = await tx.wait();

      await triggerReloadBids();

      notification.close(keyOne);
      openNotification({
        description: `Please check on EtherScan.${
          receipt.transactionHash
            ? 'transactionHash:' + receipt.transactionHash
            : ''
        }`,
      });
    } catch (e) {
      console.log(e.toString());
    }
  }, [id, media, triggerReloadBids]);

  const activeBidsList = useMemo(() => {
    const list = Object.values(activeBids).filter(i => notNull(i)) as Bid[];
    return list.map(log => {
      const bidder = () => {
        return (
          <StyledTableColumn>
            <a
              href={`${process.env.NEXT_PUBLIC_SCAN_PREFIX}/address/${log.bidder}`}
              target='_blank'
              rel='noopener noreferrer'>
              {shortedWalletAccount(log.bidder) || ''}
            </a>
          </StyledTableColumn>
        );
      };

      const price = () => {
        return (
          <StyledTableColumn>
            <BidsPrice log={log}></BidsPrice>
          </StyledTableColumn>
        );
      };
      const acceptBidBtn = () => {
        if (wallet.status !== 'connected')
          return (
            <StyledTableColumn>
              <Button size='small' onClick={() => wallet.connect('injected')}>
                Connect Wallet
              </Button>
            </StyledTableColumn>
          );
        return (
          <StyledTableColumn>
            {isMeTheOwner ? (
              <Button
                type='primary'
                size='small'
                onClick={() => acceptBid(log)}>
                Accept Bid and Transfer
              </Button>
            ) : log.bidder === wallet.account ? (
              <Button size='small' danger onClick={() => removeBid()}>
                Remove Bid
              </Button>
            ) : (
              <></>
            )}
          </StyledTableColumn>
        );
      };
      const sellOnShare = (
        <StyledTableColumn>
          {`${utils.formatUnits(log.sellOnShare.value, 18)}%`}
        </StyledTableColumn>
      );
      return { ...log, bidder, price, acceptBidBtn, sellOnShare };
    });
  }, [activeBids, isMeTheOwner, acceptBid, removeBid, wallet]);
  if (!id) {
    return (
      <StyledWrapper>
        <StyledWrapperLoading>
          <Spin tip='Loading ID from Route...'></Spin>
        </StyledWrapperLoading>
      </StyledWrapper>
    );
  }

  if (data) {
    const renderedData = data?.map(log => {
      const bidder = () => {
        return (
          <StyledTableColumn>
            <a
              href={`${process.env.NEXT_PUBLIC_SCAN_PREFIX}/address/${log.bidder}`}
              target='_blank'
              rel='noopener noreferrer'>
              {shortedWalletAccount(log.bidder) || ''}
            </a>
          </StyledTableColumn>
        );
      };

      dayjs.extend(relativeTime);
      const date = () => {
        return (
          <StyledTableColumn>
            {dayjs(log.at.timestamp * 1000).fromNow()}
          </StyledTableColumn>
        );
      };
      const price = () => {
        return (
          <StyledTableColumn>
            <BidsPrice log={log}></BidsPrice>
          </StyledTableColumn>
        );
      };
      const status = () => {
        return <StyledTableColumn>{log.status}</StyledTableColumn>;
      };
      return { ...log, bidder, date, status, price };
    });

    return (
      <StyledWrapper>
        <StyledItem>
          <Text h2>现在的出价记录</Text>
          <Paragraph>
            Current Account:{' '}
            <a
              href={`${process.env.NEXT_PUBLIC_SCAN_PREFIX}/address/${wallet.account}`}
              target='_blank'
              rel='noopener noreferrer'>
              {shortedWalletAccount(wallet.account || '')}
            </a>
          </Paragraph>
          <Table data={activeBidsList}>
            <Table.Column prop='bidder' label='Bidder' />
            <Table.Column prop='price' label='Price' />
            <Table.Column prop='sellOnShare' label='Sell On Share' />
            <Table.Column prop='acceptBidBtn' label='Action' />
          </Table>
          <StyledBox>
            <Link href={`/p/${id}/bid`}>
              <Button>Set Bid on this artwork</Button>
            </Link>
          </StyledBox>
        </StyledItem>

        <StyledItem className='mr'>
          <Text h2>历史出价日志</Text>
          <Table data={renderedData}>
            <Table.Column prop='bidder' label='买家' />
            <Table.Column prop='price' label='价格' />
            <Table.Column prop='status' label='状态' />
            <Table.Column prop='date' label='日期' />
          </Table>
        </StyledItem>
      </StyledWrapper>
    );
  }
  return (
    <StyledWrapper>
      <StyledWrapperLoading>
        <Spin tip='Loading Bids...'></Spin>
      </StyledWrapperLoading>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  flex: 1;
  width: 900px;
  margin: 0 auto;
  padding: 40px 10px 100px;
  @media screen and (max-width: 900px) {
    width: 100%;
  }
  @media screen and (max-width: 576px) {
    padding: 20px 10px 80px;
  }
`;

const StyledWrapperLoading = styled.div`
  padding: 40px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBox = styled.div`
  margin: 10px 0;
`;

const StyledItem = styled.div`
  margin: 40px 0;
  @media screen and (max-width: 576px) {
    margin: 0;
    &.mr {
      margin-top: 40px;
    }
  }
`;

const StyledTableColumn = styled.div`
  @media screen and (max-width: 576px) {
    width: 50px;
    word-break: break-word;
    button {
      white-space: break-spaces;
      height: auto;
    }
  }
`;
