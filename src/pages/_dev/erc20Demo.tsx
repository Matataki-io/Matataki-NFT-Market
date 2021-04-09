import { Button, Text } from '@geist-ui/react';
import { BigNumber, utils } from 'ethers';
import React, { useState } from 'react';
import { useWallet } from 'use-wallet';
import { currentContracts } from '../../constant/contracts';
import { useAllowance } from '../../hooks/useAllowance';
import { useERC20 } from '../../hooks/useERC20';
import { useSigner } from '../../hooks/useSigner';

export default function ERC20Demo() {
  const token = useERC20('0x337610d27c682e347c9cd60bd4b3b107c9d34ddd');
  const wallet = useWallet();
  const { signer, isSignerReady } = useSigner();
  const { allowance, isEnough, approve, lastUpdated } = useAllowance(
    token,
    currentContracts?.MARKET as string
  );
  if (!isSignerReady(signer))
    return (
      <div className='no-signer'>
        <Text>Connect First</Text>
        <Button onClick={() => wallet.connect('injected')}>Connect</Button>
      </div>
    );

  return (
    <div className='erc20-demo'>
      <Text>USDT Allowance for Market: {utils.formatEther(allowance)}</Text>
      <Text>Last Updated: {lastUpdated.toLocaleTimeString()}</Text>
      <Button onClick={() => approve()}>Unlock Allowance For Market</Button>
      <Button onClick={() => approve(BigNumber.from(0))}>
        Lock Allowance For Market
      </Button>
    </div>
  );
}
