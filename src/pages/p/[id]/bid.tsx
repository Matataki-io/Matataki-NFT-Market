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
import { ArtView } from '../../../components/Bid/ArtView';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { currentSupportedTokens as tokens } from '../../../constant/contracts';
// import { useMediaData } from '../../../hooks/useMediaData';
import { useMedia } from '../../../hooks/useMedia';
import { useERC20 } from '../../../hooks/useERC20';
import { constructBid } from '../../../utils/zdkUtils';
import { useWallet } from 'use-wallet';
import { BigNumber, utils } from 'ethers';
import { useBalance } from '../../../hooks/useBalance';
import { useMediaToken } from '../../../hooks/useMediaToken';
import { useAllowance } from '../../../hooks/useAllowance';
import { useMarket } from '../../../hooks/useMarket';
import Link from 'next/link';
import { getDecimalOf, getSymbolOf } from '../../../utils/tokens';
import NFTPreview from '../../../components/NFTPreview/index';
import { getMediaById, getMediaMetadata } from '../../../backend/media';
import { Bid } from '../../../types/ContractTypes';
import { ZERO_ADDRESS } from '../../../constant';
import { useMyBid } from '../../../hooks/useMyBid';

export default function BidPage() {
  const router = useRouter();
  const wallet = useWallet();
  const { id } = router.query;
  const mediaContract = useMedia();
  const marketContract = useMarket();
  const handler = (val: string | string[]) => {
    setCurrency(val as string);
  };
  const { profile, isMeTheOwner, isAskExist } = useMediaToken(Number(id));
  const [currency, setCurrency] = useState<string>('');
  const [amount, setAmount] = useState('0');
  const [sellOnShare, setSellOnShare] = useState(0);
  const { myBid, removeBid } = useMyBid(id as string);
  const tokenContrct = useERC20(currency);
  const { balance } = useBalance(tokenContrct);
  // `transferFrom` happened at Market, so just approve Market
  const { isEnough, approve, isUnlocking } = useAllowance(
    tokenContrct,
    marketContract.address
  );
  const [mediaData, setMediaData] = useState<{ [key: string]: any }>({
    media: {
      tokenURI: '',
    },
    metadata: {
      mimeType: '',
    },
  });

  async function setBid() {
    if (!wallet.account) throw new Error('Wallet have to be connected');
    const bidData = constructBid(
      currency,
      amount,
      wallet.account,
      wallet.account,
      sellOnShare
    );
    console.info('bidData', bidData);
    try {
      const tx = await mediaContract.setBid(id as string, bidData);
      const receipt = await tx.wait();
      alert(`出价成功，TxHash: ${receipt.transactionHash}`);
    } catch (error) {
      mediaContract.callStatic
        .setBid(id as string, bidData)
        .catch(callError => {
          console.error('callError', callError);
          console.error('reason', callError.reason);
        });
    }
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
  if (isMeTheOwner) {
    return (
      <StyledPermissions>
        <Text h3>Sorry, but...</Text>
        <Text>
          We detected that you are the owner. Which in this case that you cannot
          set a bid on your token.
        </Text>
        <ActionsBox>
          <StyledBackBtn icon={<ArrowLeft />} onClick={() => router.back()}>
            Go Back
          </StyledBackBtn>
          <Link href={`/p/${id}/ask`}>
            <Button type='secondary'>Set Ask instead</Button>
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
          <GreyCard>
            <p className='title'>CREATOR EQUITY</p>
            <p className='value'>
              {utils.formatUnits(profile.bidsShares.creator.value, 18)}%
            </p>
          </GreyCard>

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
            </GreyCard>
          )}

          {myBid && myBid.currency !== ZERO_ADDRESS && (
            <GreyCard>
              <p className='title'>MY CURRENT BID</p>
              <p className='value'>
                {utils.formatUnits(myBid.amount, getDecimalOf(myBid.currency))}
                {' ' + getSymbolOf(myBid.currency)}
              </p>
              <p>
                You will get the refund of the previous bid, if you put on a new
                bid now.
              </p>
              <Button onClick={() => removeBid()}>Remove Current Bid</Button>
            </GreyCard>
          )}

          <StyledBidsItem>
            <Text h3>Your bid</Text>
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
            {currency && (
              <p className='balance'>
                Balance: {utils.formatUnits(balance, getDecimalOf(currency))}
              </p>
            )}
          </StyledBidsItem>

          <StyledBidsItem>
            <Text h3>Resale Fee</Text>
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
          </StyledBidsItem>

          <ActionsBox>
            <StyledBackBtn
              icon={<ArrowLeft />}
              onClick={() => router.back()}
              size='large'
              auto></StyledBackBtn>
            {wallet.status === 'connected' ? (
              isEnough(amount) ? (
                <Button
                  type='secondary'
                  size='large'
                  style={FullWidth}
                  disabled={currency === '' || BigNumber.from(amount).lte(0)}
                  onClick={() => setBid()}>
                  Make your bid
                </Button>
              ) : (
                <Button
                  type='secondary'
                  size='large'
                  loading={isUnlocking}
                  style={FullWidth}
                  onClick={() => approve()}>
                  Unlock
                </Button>
              )
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
const StyledWrapper = styled(Grid.Container)`
  flex: 1;
`;

const StyledPermissions = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 100px 0 0;
`;

const BiddingBox = styled.div`
  max-width: 470px;
  margin: auto;
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

const ActionsBox = styled.div`
  display: flex;
  margin: 20px 0;
`;

const FullWidth: CSSProperties = {
  width: '100%',
};

const StyledBidsItem = styled.div`
  margin: 20px 0;
  .balance {
    font-size: 14px;
    margin: 6px 0 0 0;
    padding: 0;
    color: #333;
  }
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

const StyledBackBtn = styled(Button)`
  margin-right: 10px;
`;
