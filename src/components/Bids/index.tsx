import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { utils } from 'ethers';

import ButtonCustom from '../../components/Button';
import { BidLog } from '../../types/Bid.d';
import { shortedWalletAccount } from '../../utils/index';
import { getSymbolOf } from '../../utils/tokens';

const BidsCard: React.FC<BidLog> = ({
  bidder,
  amount,
  currency,
  media,
  at,
}) => {
  const date = (timestamp: number) => {
    dayjs.extend(relativeTime);
    const date = dayjs(timestamp * 1000).fromNow();
    return date;
  };
  const price = (amount: string, currency: string) => {
    return `${utils.formatUnits(amount, 18)} ${getSymbolOf(currency)}`;
  };

  return (
    <StyledWrapper>
      <div className='nft'>
        <img src={media?.tokenURI} alt={media?.title} />
      </div>
      <StyledInfo>
        <div className='title'>
          {media?.title} #{media?.id}
          {/* <b>·</b>{' '} */}
          {/* <a
            className='user'
            target='_balnk'
            rel='noopener noreferrer'
            href={`${process.env.NEXT_PUBLIC_SCAN_PREFIX}/address/${bidder}`}>
            {shortedWalletAccount(bidder)}
          </a> */}
        </div>
        <div className='price'>{price(amount, currency)}</div>
        <time className='time'>{date(at?.timestamp)}</time>
      </StyledInfo>
      <div className='btn'>
        <Link href={`/p/${media?.id}`}>
          <a target='_blank'>
            <ButtonCustom color='gray'>View Media</ButtonCustom>
          </a>
        </Link>
        <ButtonCustom color='gray' onClick={() => alert('正在开发中...')}>
          Review bid
        </ButtonCustom>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  padding: 20px;
  border: 2px solid #dfdfdf;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: stretch;
  .nft {
    width: 100px;
    height: 100px;
    overflow: hidden;
    border: 1px solid #dfdfdf;
    flex: 0 0 100px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .btn {
    margin-left: auto;
    display: flex;
    flex-direction: column;
  }
`;
const StyledInfo = styled.div`
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex-wrap: wrap;
  .title {
    font-size: 16px;
    color: #000;
    .user {
      color: #b8b8b8;
      word-break: break-word;
    }
  }
  .price {
    font-size: 18px;
    color: #000;
    font-weight: 500;
  }
  .time {
    font-size: 18px;
    color: #000;
    font-weight: 300;
  }
`;

export default BidsCard;
