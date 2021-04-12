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
  const { id } = router.query;
  const handler = (val: string | string[]) => {
    setCurrency(val as string);
  };
  const [currency, setCurrency] = useState<string>('');
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
              <Text h3>10%</Text>
            </CreatorEquity>

            <Text h4>Your bid</Text>
            <Select
              placeholder='Bidding Currency'
              onChange={handler}
              width='100%'>
              <Select.Option value='WETH'>WETH</Select.Option>
              <Select.Option value='DAI'>DAI</Select.Option>
              <Select.Option value='USDT'>USDT</Select.Option>
            </Select>
            <Text>Balance: 0.00</Text>
            <InputNumber<string>
              placeholder='0.00'
              style={FullWidth}
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
              <Button type='secondary' size='large' style={FullWidth}>
                Make your bid
              </Button>
            </ActionsBox>
          </BiddingBox>
        </Grid>
      </Grid.Container>
    </div>
  );
}
