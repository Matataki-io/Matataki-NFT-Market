import React, { useState, CSSProperties, useEffect } from 'react';
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
import { InputNumber, Spin } from 'antd';
import { isEmpty } from 'lodash';
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
import { getDecimalOf, getSymbolOf } from '../../../utils/tokens';
import NFTPreview from '../../../components/NFTPreview/index';
import { getMediaById, getMediaMetadata } from '../../../backend/media';
import { ZERO_ADDRESS } from '../../../constant';

export default function AskPage() {
  const router = useRouter();
  const wallet = useWallet();
  const { id } = router.query;
  const { isMeTheOwner, profile, removeAsk, isAskExist } = useMediaToken(
    Number(id)
  );
  const mediaContract = useMedia();
  const handler = (val: string | string[]) => {
    setCurrency(val as string);
  };
  const [currency, setCurrency] = useState<string>('');
  const [amount, setAmount] = useState('0');
  const [mediaData, setMediaData] = useState<{ [key: string]: any }>({
    media: {
      tokenURI: '',
    },
    metadata: {
      mimeType: '',
    },
  });

  async function setAsk() {
    if (!wallet.account) throw new Error('Wallet have to be connected');
    const tx = await mediaContract.setAsk(
      id as string,
      constructAsk(currency, amount)
    );
    const receipt = await tx.wait();
    alert(`问价成功，TxHash: ${receipt.transactionHash}`);
  }

  // get media
  const getMediaByIdFn = async (id: string) => {
    try {
      const mediaRes = await getMediaById(id);
      let metadataRes;
      if (!isEmpty(mediaRes)) {
        metadataRes = await getMediaMetadata(mediaRes.metadataURI);
      }
      console.log('mediaRes', mediaRes);
      setMediaData({
        media: mediaRes,
        metadata: metadataRes,
      });
    } catch (e) {
      console.log('e', e);
    }
  };

  useEffect(() => {
    id && getMediaByIdFn(String(id));
  }, [id]);

  if (!id) {
    return (
      <StyledPermissions>
        <Spin tip='Fetching Param `ID` now... Please wait'></Spin>
      </StyledPermissions>
    );
  }
  if (!isMeTheOwner && wallet.status === 'connected') {
    return (
      <StyledPermissions>
        <Text h3>Sorry, but...</Text>
        <Text>
          We detected that you are not the owner. Which in this case that you
          cannot set a ask on this token.
        </Text>
        <ActionsBox>
          <StyledBackBtn icon={<ArrowLeft />} onClick={() => router.back()}>
            Go Back
          </StyledBackBtn>
          <Link href={`/p/${id}/bid`}>
            <Button type='secondary'>Set Bid instead</Button>
          </Link>
        </ActionsBox>
      </StyledPermissions>
    );
  }
  return (
    <StyledWrapper justify='center'>
      <Grid
        xs={24}
        md={12}
        style={{ background: '#f2f2f2', padding: 50 }}
        justify='center'
        alignItems='center'>
        <NFTPreview
          src={mediaData?.media.tokenURI}
          type={
            mediaData?.metadata.mimeType
              ? mediaData.metadata.mimeType.split('/')[0]
              : ''
          }></NFTPreview>
      </Grid>
      <Grid xs={24} md={12}>
        <BiddingBox>
          <Text h3>Your ask</Text>

          {isAskExist && (
            <GreyCard>
              <p className='title'>CURRENT ASK</p>
              <p className='value'>
                {utils.formatUnits(
                  profile.currentAsk.amount,
                  getDecimalOf(profile.currentAsk.currency)
                )}
                {' ' + getSymbolOf(profile.currentAsk.currency)}
              </p>
              <Button onClick={() => removeAsk()}>Remove Ask</Button>
            </GreyCard>
          )}

          <StyledBidsInput>
            <Select
              placeholder='Bidding Currency'
              onChange={handler}
              width='100%'
              className='select-token'>
              {Object.keys(tokens!).map(symbol => (
                <Select.Option value={tokens![symbol]} key={symbol}>
                  {symbol}
                </Select.Option>
              ))}
            </Select>
            <InputNumber<string>
              placeholder='0.00'
              className='input-token'
              value={amount}
              onChange={setAmount}
              style={FullWidth}
              formatter={value =>
                utils.formatUnits(value as string, getDecimalOf(currency))
              }
              parser={value =>
                utils
                  .parseUnits(value as string, getDecimalOf(currency))
                  .toString()
              }
              stringMode
              min='0'
            />
          </StyledBidsInput>

          <ActionsBox>
            <StyledBackBtn
              icon={<ArrowLeft />}
              onClick={() => router.back()}
              size='large'
              auto></StyledBackBtn>
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
    </StyledWrapper>
  );
}

const StyledPermissions = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 100px 0 0;
`;

const GreyCard = styled.div`
  box-sizing: border-box;
  margin: 0;
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

const BiddingBox = styled.div`
  max-width: 470px;
  margin: auto;
`;

const ActionsBox = styled.div`
  display: flex;
  margin: 20px 0;
`;

const FullWidth: CSSProperties = {
  width: '100%',
};

const StyledBackBtn = styled(Button)`
  margin-right: 10px;
`;

const StyledWrapper = styled(Grid.Container)`
  flex: 1;
`;

const StyledBidsInput = styled.div`
  display: flex;
  .select-token {
    margin-right: 5px;
  }
  .input-token {
    margin-left: 5px;
  }
`;
