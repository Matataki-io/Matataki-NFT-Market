import React, { useMemo } from 'react';
import { BigNumber, BigNumberish, utils } from 'ethers';
import styled from 'styled-components';
import { currentWETH } from '../../constant/contracts';
import { useEthBalance } from '../../hooks/useEthBalance';
import { useWETH } from '../../hooks/useWETH';
import { Button, Typography } from 'antd';

const { Paragraph } = Typography;

type WethHelpTipParams = {
  currency: string;
  bidPrice: BigNumberish;
  wethBalance: BigNumber;
};

export function WETHHelpTip({
  currency,
  bidPrice,
  wethBalance: balance,
}: WethHelpTipParams) {
  const { deposit: depositToWETH, withdraw: withdrawBacktoETH } = useWETH();
  const { isEnoughEth, balance: ethBalance } = useEthBalance();
  const diff = useMemo(() => BigNumber.from(bidPrice).sub(balance), [
    bidPrice,
    balance,
  ]);

  const showWETHHelp = useMemo(() => {
    return (
      !currency ||
      currentWETH !== utils.getAddress(currency) ||
      balance.gte(bidPrice)
    );
  }, [balance, bidPrice, currency]);

  // if (
  //   !currency ||
  //   currentWETH !== utils.getAddress(currency) ||
  //   balance.gte(bidPrice)
  // ) {
  //   return <></>;
  // }
  return (
    <>
      {showWETHHelp ? null : (
        <GreyCard>
          <Paragraph>
            WETH (Wrapped ETH) selected, You may need to upgrade your ETH to
            WETH in order to set bid
          </Paragraph>
          <Paragraph>
            ETH Balance: {utils.formatEther(ethBalance)} ETH
          </Paragraph>
          <StyledItem>
            <Button
              onClick={() => depositToWETH(bidPrice)}
              disabled={!isEnoughEth(bidPrice)}>
              Upgrade {utils.formatEther(bidPrice)} ETH
            </Button>
          </StyledItem>
          <StyledItem>
            <Button
              onClick={() => depositToWETH(diff)}
              disabled={!isEnoughEth(diff)}>
              Upgrade {utils.formatEther(diff)} ETH to add up the price
            </Button>
          </StyledItem>
          <StyledItem>
            {balance.gt(0) && (
              <Button onClick={() => withdrawBacktoETH(balance)}>
                Downgrade All WETH back to ETH
              </Button>
            )}
          </StyledItem>
        </GreyCard>
      )}
    </>
  );
}

const GreyCard = styled.div`
  box-sizing: border-box;
  margin: 10px 0 0 0;
  min-width: 0;
  padding: 20px 20px;
  width: 100%;
  flex-direction: column;
  border-radius: 4px;
  border: 2px solid #f2f2f2;
  background-color: #f2f2f2;
  margin-bottom: 10px;
  display: flex;
  .title {
    color: rgb(136, 136, 136);
    padding: 0;
    margin: 0;
    font-size: 14px;
  }
  .value {
    font-weight: bold;
    font-size: 16px;
    padding: 0;
    margin: 10px 0 0 0;
  }
`;

const StyledItem = styled.div`
  margin: 4px 0;

  & > button {
    width: 100%;
  }
`;
