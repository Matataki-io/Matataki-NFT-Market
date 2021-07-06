import React, { useCallback } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { utils } from 'ethers';
import { Bid } from '../../types/ContractTypes';
import { BidLog } from '../../types/Bid';
import { useERC20Single } from '../../hooks/useERC20Single';
import useTokenInMatataki from '../../hooks/useTokenInMatataki';
import { isEmpty } from 'lodash';
import { isMobile } from 'react-device-detect';

interface Props {
  log: Bid | BidLog;
}

const BidsPrice = ({ log }: Props) => {
  // token profile
  const { tokenProfile } = useERC20Single(log.currency);
  // token profile in matataki
  const { tokenMatataki } = useTokenInMatataki(log.currency);

  // token current price
  const price = useCallback(({ amount, token }) => {
    return (
      <StyledToken>
        {utils.formatUnits(amount, token.decimals)} {token?.symbol}
        {isMobile ? null : <>({token?.name})</>}
      </StyledToken>
    );
  }, []);

  // price dom
  const priceDom = useCallback(() => {
    return (
      <>
        {isEmpty(tokenMatataki) ? (
          price({ amount: log.amount, token: tokenProfile })
        ) : (
          <Link
            href={`${process.env.NEXT_PUBLIC_MATATAKI}/token/${tokenMatataki.tokenId}`}>
            <a target='_blank' rel='noopener noreferrer'>
              {price({
                amount: log.amount,
                token: tokenProfile,
              })}
            </a>
          </Link>
        )}
      </>
    );
  }, [tokenMatataki, price, log.amount, tokenProfile]);

  return <>{priceDom()}</>;
};

const StyledToken = styled.span`
  color: #000;
`;

export default BidsPrice;
