import React from 'react';
import { utils } from 'ethers';
import { Bid } from '../../types/ContractTypes';
import { BidLog } from '../../types/Bid';
import { useERC20Single } from '../../hooks/useERC20Single';

interface Props {
  log: Bid | BidLog;
}

const BidsPrice = ({ log }: Props) => {
  // token profile
  const { tokenProfile } = useERC20Single(log.currency);

  return (
    <div>
      {`${utils.formatUnits(log.amount, tokenProfile.decimals)} ${
        tokenProfile.symbol
      }`}
    </div>
  );
};

export default BidsPrice;
