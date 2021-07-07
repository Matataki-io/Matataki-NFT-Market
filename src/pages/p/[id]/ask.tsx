import React, { useState, CSSProperties, useEffect, useCallback } from 'react';
import { Grid } from '@geist-ui/react';
import { useRouter } from 'next/router';
import {
  InputNumber,
  Spin,
  Button,
  message,
  notification,
  Avatar,
  Row,
  Col,
  Space,
  Typography,
} from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import { ArtView } from '../../../components/Bid/ArtView';
import styled from 'styled-components';
import { currentSupportedTokens as tokens } from '../../../constant/contracts';
// import { useMediaData } from '../../../hooks/useMediaData';
import { useMedia } from '../../../hooks/useMedia';
import { constructAsk } from '../../../utils/zdkUtils';
import { useWallet } from 'use-wallet';
import { BigNumber, utils } from 'ethers';
import { useMediaToken } from '../../../hooks/useMediaToken';
import Link from 'next/link';
import { getDecimalOf, getSymbolOf } from '../../../utils/tokens';
import NFTPreview from '../../../components/NFTPreview/index';
import { getMediaById, getMediaMetadata } from '../../../backend/media';
import { ZERO_ADDRESS } from '../../../constant';
import { useBoolean } from 'ahooks';
import TokenListComponents from '../../../components/TokenListSelect';
import { StandardTokenProfile } from '../../../types/TokenList';
import { useERC20Single } from '../../../hooks/useERC20Single';
import useTokenInMatataki from '../../../hooks/useTokenInMatataki';

const { Title, Text } = Typography;

export default function AskPage() {
  const router = useRouter();
  const wallet = useWallet();
  const { id } = router.query;
  const { isMeTheOwner, profile, removeAsk, isAskExist } = useMediaToken(
    Number(id)
  );
  const mediaContract = useMedia();
  const [currency, setCurrency] = useState<string>('');
  const [currentToken, setCurrentToken] = useState<StandardTokenProfile>(
    {} as StandardTokenProfile
  );

  // modal 显示/隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [amount, setAmount] = useState('0');
  const [mediaData, setMediaData] = useState<{ [key: string]: any }>({
    media: {
      tokenURI: '',
    },
    metadata: {
      mimeType: '',
    },
  });

  const [isSigning, signingActions] = useBoolean(false);

  // ask token profile
  const { tokenProfile: tokenAskProfile } = useERC20Single(
    profile.currentAsk.currency
  );
  // token profile in matataki
  const { tokenMatataki } = useTokenInMatataki(profile.currentAsk.currency);

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
    icon,
  }: {
    description: string;
    duration?: number | null;
    key?: string;
    icon?: any;
  }) => {
    notification.open({
      message: 'Notification',
      description: description,
      duration: duration,
      key: key,
      icon: icon || <Spin />,
    });
  };

  async function setAsk() {
    if (!wallet.account) {
      message.info('Wallet have to be connected');
      return;
    }

    signingActions.setTrue();
    const theAsk = constructAsk(currency, amount);
    try {
      const tx = await mediaContract.setAsk(id as string, theAsk);

      const keyOne = `open${Date.now()}`;
      openNotification({
        description:
          'Ask... Wait for the contract confirmation, please do not refresh or leave the page.',
        duration: null,
        key: keyOne,
      });

      const receipt = await tx.wait();

      notification.close(keyOne);
      openNotification({
        description: `Successful ask.${
          receipt.transactionHash
            ? 'transactionHash:' + receipt.transactionHash
            : ''
        }`,
      });
    } catch (error) {
      mediaContract.callStatic.setAsk(id as string, theAsk).catch(callError => {
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
          price({ amount: profile.currentAsk.amount, token: tokenAskProfile })
        ) : (
          <Link
            href={`${process.env.NEXT_PUBLIC_MATATAKI}/token/${tokenMatataki.tokenId}`}>
            <a target='_blank' rel='noopener noreferrer'>
              {price({
                amount: profile.currentAsk.amount,
                token: tokenAskProfile,
              })}
            </a>
          </Link>
        )}
      </>
    );
  }, [tokenMatataki, price, profile.currentAsk.amount, tokenAskProfile]);

  if (!id) {
    return (
      <StyledPermissions>
        <Spin tip='Fetching Param `ID` now... Please wait'></Spin>
      </StyledPermissions>
    );
  }
  // 需要判断 profile.owner， 默认是 ‘’ 会直接进入这个条件
  if (profile.owner && !isMeTheOwner && wallet.status === 'connected') {
    return (
      <StyledPermissions>
        <Title level={3}>Sorry, but...</Title>
        <Text>
          We detected that you are not the owner. Which in this case that you
          cannot set a ask on this token.
        </Text>
        <ActionsBox>
          <StyledBackBtn
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}>
            Go Back
          </StyledBackBtn>
          <Link href={`/p/${id}/bid`}>
            <Button>Set Bid instead</Button>
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
          <Title level={3}>Your ask</Title>

          {isAskExist && (
            <GreyCard>
              <p className='title'>CURRENT ASK</p>
              <p className='value'>{priceDom()}</p>
              <Button onClick={() => removeAsk()}>Remove Ask</Button>
            </GreyCard>
          )}

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
                <Button onClick={() => setIsModalVisible(true)}>Select</Button>
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
                    currentToken.decimals || 18
                  )
                }
                parser={value =>
                  utils
                    .parseUnits(value as string, currentToken.decimals || 18)
                    .toString()
                }
                stringMode
                min='0'
              />
            </Col>
          </Row>

          <ActionsBox>
            <StyledBackBtn
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}></StyledBackBtn>
            {wallet.status === 'connected' ? (
              <Button
                disabled={
                  !currency ||
                  isEmpty(currentToken) ||
                  BigNumber.from(amount).lte(0)
                }
                style={FullWidth}
                loading={isSigning}
                onClick={() => setAsk()}>
                Make your Ask
              </Button>
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

const StyledPermissions = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 100px 0 0;
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
    margin: 10px 0;
    a {
      color: #000;
    }
  }
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

const ActionsBox = styled.div`
  display: flex;
  margin: 20px 0;
`;

const FullWidth: CSSProperties = {
  width: '100%',
};

const StyledBackBtn = styled(Button)`
  margin-right: 10px;
  min-width: 80px;
`;

const StyledWrapper = styled(Grid.Container)`
  flex: 1;
`;
