import React from 'react';
import { utils } from 'ethers';
import { Bid } from '../../types/ContractTypes';
import { BidLog } from '../../types/Bid';
import { useERC20 } from '../../hooks/useERC20';

interface Props {
  log: Bid | BidLog;
}

const BidsPrice = ({ log }: Props) => {
  // token profile
  const { tokenProfile } = useERC20(log.currency);

  return (
    <div>
      {`${utils.formatUnits(log.amount, tokenProfile.decimals)} ${
        tokenProfile.symbol
      }`}
    </div>
  );
};

export default BidsPrice;
