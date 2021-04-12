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
import { useERC20 } from '../../../hooks/useERC20';
import { constructBid } from '../../../utils/zdkUtils';
import { useWallet } from 'use-wallet';
import { utils } from 'ethers';
import { useBalance } from '../../../hooks/useBalance';
import { useMediaToken } from '../../../hooks/useMediaToken';

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

export default function Bid() {
  const router = useRouter();
  const wallet = useWallet();
  const { id } = router.query;
  const mediaContract = useMedia();
  const handler = (val: string | string[]) => {
    setCurrency(val as string);
  };
  const { profile, isMeTheOwner } = useMediaToken(Number(id));
  const [currency, setCurrency] = useState<string>('');
  const [amount, setAmount] = useState('0');
  const [sellOnShare, setSellOnShare] = useState(0);
  const tokenContrct = useERC20(currency);
  const { balance } = useBalance(tokenContrct);

  async function setBid() {
    if (!wallet.account) throw new Error('Wallet have to be connected');
    const tx = await mediaContract.setBid(
      id as string,
      constructBid(
        currency,
        amount,
        wallet.account,
        wallet.account,
        sellOnShare
      )
    );
    const receipt = await tx.wait();
    alert(`出价成功，TxHash: ${receipt.transactionHash}`);
  }

  if (!id) {
    return (
      <div className='loading'>Fetching Param `ID` now... Please wait</div>
    );
  }
  if (isMeTheOwner) {
    return (
      <div className='notice'>
        <Text h3>Sorry, but...</Text>
        <Text>
          We detected that you are the owner. Which in this case that you cannot
          set a bid on your token.
        </Text>
        <ActionsBox>
          <Button icon={<ArrowLeft />} onClick={() => router.back()}>
            Go Back
          </Button>
          <Button type='secondary'>Set Ask instead</Button>
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
            <CreatorEquity>
              <Text style={{ color: '#888888' }}>CREATOR EQUITY</Text>
              <Text h3>
                {utils.formatUnits(profile.bidsShares.creator.value, 18)}%
              </Text>
            </CreatorEquity>

            <Text h4>Your bid</Text>
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
            {currency && <Text>Balance: {utils.formatUnits(balance, 18)}</Text>}
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
            <Text h4>Resale Fee</Text>
            <Text>
              If you re-sell this piece, the person you&apos;re buying it from
              now will earn this percentage as a reward for selling it to you.
            </Text>
            <InputNumber
              defaultValue={0}
              style={FullWidth}
              onChange={setSellOnShare}
              min={0}
              precision={0}
              max={99}
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
                  onClick={() => setBid()}>
                  Make your bid
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
