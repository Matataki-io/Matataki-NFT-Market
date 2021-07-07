import React, { useState, CSSProperties, useEffect, useCallback } from 'react';
import { Grid, Select } from '@geist-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  InputNumber,
  Spin,
  Button,
  Typography,
  message,
  notification,
  Row,
  Col,
  Avatar,
  Space,
} from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { currentSupportedTokens as tokens } from '../../../constant/contracts';
// import { useMediaData } from '../../../hooks/useMediaData';
import { useMedia } from '../../../hooks/useMedia';
import { useERC20Single } from '../../../hooks/useERC20Single';
import { constructBid } from '../../../utils/zdkUtils';
import { useWallet } from 'use-wallet';
import { BigNumber, utils } from 'ethers';
// import { useBalance } from '../../../hooks/useBalance';
import { useMediaToken } from '../../../hooks/useMediaToken';
import { useAllowance } from '../../../hooks/useAllowance';
import { useMarket } from '../../../hooks/useMarket';
import { useMyBid } from '../../../hooks/useMyBid';
import useTokenInMatataki from '../../../hooks/useTokenInMatataki';
import { getDecimalOf, getSymbolOf } from '../../../utils/tokens';
import NFTPreview from '../../../components/NFTPreview/index';
import { getMediaById, getMediaMetadata } from '../../../backend/media';
import { ZERO_ADDRESS } from '../../../constant';
import { useBoolean } from 'ahooks';
import { WETHHelpTip } from '../../../components/Bid/WethHelpTip';
import TokenListComponents from '../../../components/TokenListSelect';
import { StandardTokenProfile } from '../../../types/TokenList';

const { Paragraph, Title, Text } = Typography;

export default function BidPage() {
  const router = useRouter();
  const wallet = useWallet();
  const { id } = router.query;
  const mediaContract = useMedia();
  const marketContract = useMarket();

  const { profile, isMeTheOwner, isAskExist } = useMediaToken(Number(id));
  const [currentToken, setCurrentToken] = useState<StandardTokenProfile>(
    {} as StandardTokenProfile
  );
  const [currency, setCurrency] = useState<string>('');
  const [amount, setAmount] = useState('0');
  const [sellOnShare, setSellOnShare] = useState(0);
  const { myBid, removeBid } = useMyBid(id as string);
  const {
    token: tokenContrct,
    isProfileLoading,
    tokenProfile,
    formattedBalance,
  } = useERC20Single(currency);
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

  // modal 显示/隐藏
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // bid token profile
  const { tokenProfile: tokenBidProfile } = useERC20Single(
    profile.currentAsk.currency
  );

  // my bid token profile
  const { tokenProfile: tokenMyBidProfile } = useERC20Single(
    myBid ? myBid?.currency : ''
  );

  // token profile in matataki （current ask）
  const { tokenMatataki } = useTokenInMatataki(profile.currentAsk.currency);

  // token profile in matataki （bid)
  const { tokenMatataki: tokenMatatakiBid } = useTokenInMatataki(
    myBid ? myBid?.currency : ''
  );

  // token current price
  const price = useCallback(({ amount, token }) => {
    return (
      <>
        {utils.formatUnits(amount, token.decimals)} {token?.symbol}(
        {token?.name})
      </>
    );
  }, []);

  // price dom
  const priceDom = useCallback(() => {
    return (
      <>
        {isEmpty(tokenMatataki) ? (
          price({ amount: profile.currentAsk.amount, token: tokenBidProfile })
        ) : (
          <Link
            href={`${process.env.NEXT_PUBLIC_MATATAKI}/token/${tokenMatataki.tokenId}`}>
            <a target='_blank' rel='noopener noreferrer'>
              {price({
                amount: profile.currentAsk.amount,
                token: tokenBidProfile,
              })}
            </a>
          </Link>
        )}
      </>
    );
  }, [tokenMatataki, price, profile.currentAsk.amount, tokenBidProfile]);

  // price dom (bid)
  const priceDomBid = useCallback(() => {
    if (!myBid) {
      return;
    }

    return (
      <>
        {isEmpty(tokenMatatakiBid) ? (
          price({ amount: myBid.amount, token: tokenMyBidProfile })
        ) : (
          <Link
            href={`${process.env.NEXT_PUBLIC_MATATAKI}/token/${tokenMatatakiBid.tokenId}`}>
            <a target='_blank' rel='noopener noreferrer'>
              {price({
                amount: myBid.amount,
                token: tokenMyBidProfile,
              })}
            </a>
          </Link>
        )}
      </>
    );
  }, [tokenMatatakiBid, price, myBid, tokenMyBidProfile]);

  // 处理 选择 Token 事件
  const handlerSelectCurrentToken = (token: StandardTokenProfile) => {
    console.log('token', token);
    setCurrency(token.address);
    setCurrentToken(token);
  };

  const openNotification = ({
    description,
    duration = 4.5,
    key = '',
  }: {
    description: string;
    duration?: number | null;
    key?: string;
  }) => {
    notification.open({
      message: 'Notification',
      description: description,
      duration: duration,
      key: key,
    });
  };

  const [isSigning, signingActions] = useBoolean(false);
  async function setBid() {
    if (!wallet.account) {
      message.warning('Wallet have to be connected');
      return;
    }
    const bidData = constructBid(
      currency,
      amount,
      wallet.account,
      wallet.account,
      sellOnShare
    );
    console.info('bidData', bidData);
    try {
      signingActions.setTrue();
      const tx = await mediaContract.setBid(id as string, bidData);

      const keyOne = `open${Date.now()}`;
      openNotification({
        description:
          'Setting bids... Wait for the contract confirmation, please do not refresh or leave the page.',
        duration: null,
        key: keyOne,
      });

      const receipt = await tx.wait();

      notification.close(keyOne);
      openNotification({
        description: `Successful bid.${
          receipt.transactionHash
            ? 'transactionHash:' + receipt.transactionHash
            : ''
        }`,
      });
    } catch (error) {
      mediaContract.callStatic
        .setBid(id as string, bidData)
        .catch(callError => {
          console.error('callError', callError);
          console.error('reason', callError.reason);
          message.info('Error happened: ' + callError.reason);
        });
    } finally {
      signingActions.setFalse();
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
  // 这里可以不需要判断 profile.owner
  if (isMeTheOwner) {
    return (
      <StyledPermissions>
        <Title level={3}>Sorry, but...</Title>
        <Paragraph>
          We detected that you are the owner. Which in this case that you cannot
          set a bid on your token.
        </Paragraph>
        <ActionsBox>
          <StyledBackBtn
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}>
            Go Back
          </StyledBackBtn>
          <Link href={`/p/${id}/ask`}>
            <Button>Set Ask instead</Button>
          </Link>
        </ActionsBox>
      </StyledPermissions>
    );
  }
  return (
    <StyledWrapper justify='center'>
      <StyledNFT>
        <Grid xs={24} md={12} justify='center' alignItems='center'>
          <NFTPreview
            src={mediaData?.media.tokenURI}
            type={
              mediaData?.metadata.mimeType
                ? mediaData.metadata.mimeType.split('/')[0]
                : ''
            }></NFTPreview>
        </Grid>
      </StyledNFT>

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
              <p className='value'>{priceDom()}</p>
            </GreyCard>
          )}

          {myBid && myBid.currency !== ZERO_ADDRESS && (
            <GreyCard>
              <p className='title'>MY CURRENT BID</p>
              <p className='value'>{priceDomBid()}</p>
              <Paragraph>
                You will get the refund of the previous bid, if you put on a new
                bid now.
              </Paragraph>
              <Button onClick={() => removeBid()}>Remove Current Bid</Button>
            </GreyCard>
          )}

          <StyledBidsItem>
            <Title level={3}>Your bid</Title>
            <Row>
              <Col span={12}>
                <Space>
                  {!isEmpty(currentToken) ? (
                    <>
                      <Avatar
                        size={30}
                        icon={<UserOutlined />}
                        src={currentToken.logoURI}
                      />
                      <Text strong>{currentToken.symbol}</Text>
                    </>
                  ) : (
                    ''
                  )}
                  <Button onClick={() => setIsModalVisible(true)}>
                    Select
                  </Button>
                </Space>
              </Col>

              <Col span={12}>
                <InputNumber<string>
                  placeholder='0.00'
                  className='input-token'
                  value={amount}
                  onChange={setAmount}
                  style={FullWidth}
                  formatter={value =>
                    utils.formatUnits(
                      value as string,
                      tokenProfile.decimals || 18
                    )
                  }
                  parser={value =>
                    utils
                      .parseUnits(value as string, tokenProfile.decimals || 18)
                      .toString()
                  }
                  stringMode
                  min='0'
                />
              </Col>
            </Row>
            {currency && <p className='balance'>Balance: {formattedBalance}</p>}
            {/* 
              { 
                currency && currentWETH === utils.getAddress(currency) && balance.lt(amount) &&
                <GreyCard>
                  <Text>WETH (Wrapped ETH) selected, You may need to upgrade your ETH to WETH in order to set bid</Text>
                  <Text>Balance: {utils.formatEther(ethBalance)} ETH (Good to upgrade to WETH)</Text>
                  <Button type="secondary" onClick={() => depositToWETH(amount)}>Upgrade for {utils.formatEther(amount)} WETH</Button>
                  <Button type="secondary" onClick={() => depositToWETH(BigNumber.from(amount).sub(balance))}>Upgrade for {utils.formatEther(BigNumber.from(amount).sub(balance))} WETH to add up the price</Button>
                  { balance.gt(0) && <Button type='error' onClick={() => withdrawBacktoETH(balance)}>Downgrade All WETH back to ETH</Button> }
                </GreyCard>
              } */}
            <WETHHelpTip
              currency={currency}
              bidPrice={amount}
              wethBalance={tokenProfile.balance}
            />
          </StyledBidsItem>

          <StyledBidsItem>
            <Title level={3}>Resale Fee</Title>
            <Paragraph>
              If you re-sell this piece, the person you&apos;re buying it from
              now will earn this percentage as a reward for selling it to you.
            </Paragraph>
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
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}></StyledBackBtn>
            {wallet.status === 'connected' ? (
              isEnough(amount) ? (
                <Button
                  style={FullWidth}
                  disabled={currency === '' || BigNumber.from(amount).lte(0)}
                  loading={isSigning}
                  onClick={() => setBid()}>
                  Make your bid
                </Button>
              ) : (
                <Button
                  loading={isUnlocking}
                  style={FullWidth}
                  onClick={() => approve()}>
                  Unlock
                </Button>
              )
            ) : (
              <Button
                style={FullWidth}
                onClick={() => wallet.connect('injected')}>
                Connect Wallet
              </Button>
            )}
          </ActionsBox>
        </BiddingBox>
      </Grid>
      <TokenListComponents
        setCurrentToken={handlerSelectCurrentToken}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}></TokenListComponents>
    </StyledWrapper>
  );
}
const StyledWrapper = styled(Grid.Container)`
  flex: 1;
`;

const StyledNFT = styled.div`
  background: rgb(242, 242, 242);
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 576px) {
    padding: 20px;
  }
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
  width: 100%;
  max-width: 500px;
  padding: 40px 20px;
  margin: auto;
  box-sizing: border;
  @media screen and (max-width: 576px) {
    padding: 20px 10px;
  }
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
    a {
      color: #000;
    }
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
  min-width: 80px;
`;
