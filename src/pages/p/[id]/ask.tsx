import React, { useState, CSSProperties } from 'react';
import {
  Button,
  ButtonDropdown,
  Grid,
  Input,
  Select,
  Text,
} from '@geist-ui/react';
import ArrowLeft from '@geist-ui/react-icons/arrowLeft';
import { useRouter } from 'next/router';
import { InputNumber } from 'antd';
import { ArtView } from '../../../components/Bid/ArtView';
import styled from 'styled-components';
import { currentSupportedTokens as tokens } from '../../../constant/contracts';
// import { useMediaData } from '../../../hooks/useMediaData';
import { useMedia } from '../../../hooks/useMedia';
import { constructAsk } from '../../../utils/zdkUtils';
import { useWallet } from 'use-wallet';
import { utils } from 'ethers';
import { useMediaToken } from '../../../hooks/useMediaToken';
import Link from 'next/link';

const BiddingBox = styled.div`
  padding: 4rem 0.5rem;
  width: 470px;
  margin: auto;
`;

const CreatorEquity = styled.div`
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  padding: 10px;
  width: 100%;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  border-radius: 4px;
  border: 2px solid #f2f2f2;
  background-color: #f2f2f2;
  margin-bottom: 30px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
`;

const ActionsBox = styled.div`
  display: flex;
  margin: 2rem 0;
`;

const FullWidth: CSSProperties = {
  width: '100%',
};

export default function AskPage() {
  const router = useRouter();
  const wallet = useWallet();
  const { id } = router.query;
  const { isMeTheOwner } = useMediaToken(Number(id));
  const mediaContract = useMedia();
  const handler = (val: string | string[]) => {
    setCurrency(val as string);
  };
  const [currency, setCurrency] = useState<string>('');
  const [amount, setAmount] = useState('0');

  async function setAsk() {
    if (!wallet.account) throw new Error('Wallet have to be connected');
    const tx = await mediaContract.setAsk(
      id as string,
      constructAsk(currency, amount)
    );
    const receipt = await tx.wait();
    alert(`问价成功，TxHash: ${receipt.transactionHash}`);
  }

  if (!id) {
    return (
      <div className='loading'>Fetching Param `ID` now... Please wait</div>
    );
  }
  if (!isMeTheOwner) {
    return (
      <div className='notice'>
        <Text h3>Sorry, but...</Text>
        <Text>
          We detected that you are not the owner. Which in this case that you
          cannot set a ask on this token.
        </Text>
        <ActionsBox>
          <Button icon={<ArrowLeft />} onClick={() => router.back()}>
            Go Back
          </Button>
          <Link href={`/p/${id}/bid`}>
            <Button type='secondary'>Set Bid instead</Button>
          </Link>
        </ActionsBox>
      </div>
    );
  }
  return (
    <div className='bid-on-media'>
      <Grid.Container gap={2} justify='center'>
        <Grid xs={0} md={12} style={{ background: '#f2f2f2' }}>
          <Button
            icon={<ArrowLeft />}
            onClick={() => router.back()}
            auto
            size='large'></Button>
          <ArtView mediaId={Number(id)} />
        </Grid>
        <Grid xs={24} md={12}>
          <BiddingBox>
            <Text h4>Your ask</Text>
            <Select
              placeholder='Bidding Currency'
              onChange={handler}
              width='100%'>
              {Object.keys(tokens!).map(symbol => (
                <Select.Option value={tokens![symbol]} key={symbol}>
                  {symbol}
                </Select.Option>
              ))}
            </Select>
            <InputNumber<string>
              placeholder='0.00'
              value={amount}
              onChange={setAmount}
              style={FullWidth}
              formatter={value => utils.formatUnits(value as string, 18)}
              parser={value => utils.parseUnits(value as string, 18).toString()}
              stringMode
              min='0'
            />
            <ActionsBox>
              <Button
                icon={<ArrowLeft />}
                onClick={() => router.back()}
                size='large'
                auto></Button>
              {wallet.status === 'connected' ? (
                <Button
                  type='secondary'
                  size='large'
                  style={FullWidth}
                  onClick={() => setAsk()}>
                  Make your Ask
                </Button>
              ) : (
                <Button
                  type='secondary'
                  size='large'
                  style={FullWidth}
                  onClick={() => wallet.connect('injected')}>
                  Connect Wallet
                </Button>
              )}
            </ActionsBox>
          </BiddingBox>
        </Grid>
      </Grid.Container>
    </div>
  );
}
