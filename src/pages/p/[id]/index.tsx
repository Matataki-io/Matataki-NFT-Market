import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import NextHead from 'next/head';

import { Link, Text } from '@geist-ui/react';
import { message, Tag, Spin } from 'antd';
import { getTokenOnScan } from '../../../utils/token';
import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import styled from 'styled-components';
import useSWR from 'swr';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  getMediaById,
  getHotMediaList,
  getMediaMetadata,
  backendSWRFetcher,
} from '../../../backend/media';
import { useMediaToken } from '../../../hooks/useMediaToken';
import { utils } from 'ethers';
import { getDecimalOf, getSymbolOf } from '../../../utils/tokens';
import NFTPreview from '../../../components/NFTPreview/index';

import Page from '../../../components/Page';
import MediaMarketInfo from '../../../components/MediaMarketInfo';
import MediaOwnershipInfo from '../../../components/MediaOwnershipInfo';
import ProofOfAuthenticity from '../../../components/ProofOfAuthenticity';
import { IconRespondArrow } from '../../../components/Icons';
import { useMediaData } from '../../../hooks/useMediaData';
import NFTTimeline from '../../../components/NFTTimeline/index';
import { Ask } from '../../../types/Ask';
import { Tag as TagTypes } from '../../../types/Tag';
import { BidLogWithUser, MediaLogWithUser } from '../../../types/TokenLog.dto';
import { useERC20Single } from '../../../hooks/useERC20Single';
import { getInfoByAddress } from '../../../backend/matatakiApi';
import { ZERO_ADDRESS } from '../../../constant/index';
import { MatatakiGetInfoByAddress } from '../../../types/MatatakiType.d';
import { isEmpty } from 'lodash';

type Props = {
  post?: {
    id: number;
    backendData: any;
    metadata: {
      description: string;
      name: string;
      mimeType: string;
    };
  };
  isError?: boolean;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

const PostPage: NextPage<Props> = ({ post, isError }) => {
  const { query, isFallback } = useRouter();

  const { id } = query;
  const { backendData, metadata } = useMediaData(post);

  const { profile, isMeTheOwner, isAskExist } = useMediaToken(Number(post?.id));

  const scanLink = getTokenOnScan(Number(id));
  const ipfsLink = post?.backendData.tokenURI;

  // token profile
  const { tokenProfile } = useERC20Single(profile.currentAsk.currency);

  const { data: timeline, error } = useSWR<
    Array<Ask | MediaLogWithUser | BidLogWithUser>
  >(`/media/${id}/logs`, backendSWRFetcher);
  // token info in matataki
  const [tokenMatataki, setTokenMatataki] = useState<MatatakiGetInfoByAddress>(
    {} as MatatakiGetInfoByAddress
  );

  const copyText = useMemo(() => {
    if (process.browser) {
      return `${metadata?.name}：${window ? window.location.href : ''}`;
    } else {
      return metadata?.name;
    }
  }, [metadata]);

  // token 信息 in matataki
  const tokenProfileInfoMatataki = async (address: string) => {
    if (!address) return;
    if (address === ZERO_ADDRESS) return;
    try {
      const res = await getInfoByAddress({ address: address, chain: 'bsc' });
      if (res.code === 0 && res.data.length) {
        setTokenMatataki(res.data[0]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // token current price
  const price = () => {
    return (
      <>
        {utils.formatUnits(profile.currentAsk.amount, tokenProfile.decimals)}{' '}
        {tokenProfile?.symbol}
      </>
    );
  };

  useEffect(() => {
    tokenProfileInfoMatataki(profile.currentAsk.currency);
  }, [profile]);

  if (isFallback) {
    return (
      <Page>
        <StyledWrapperLoading>
          <Spin tip='Loading the latest data...'></Spin>
        </StyledWrapperLoading>
      </Page>
    );
  }
  if (!post && !isError)
    return (
      <Page>
        <StyledWrapperLoading>
          <Spin tip='Loading...'></Spin>
        </StyledWrapperLoading>
      </Page>
    );
  if (!post)
    return (
      <Page>
        <StyledWrapperLoading>
          <Text h1>Sorry</Text>
          <Text>But the Token is not exist yet, please check with the URL</Text>
        </StyledWrapperLoading>
      </Page>
    );
  //   if (!data || !metadata) return <div>loading...</div>;

  const metaTitle = metadata?.name || 'Matataki NFT';
  const metaDescription = metadata.description || 'Matataki NFT 交易市场';
  const metaImage =
    backendData.tokenURI ||
    'https://ssimg.frontenduse.top/article/2021/06/30/4cd78197b0ebf60abc5e54c04fee6770.png';

  return (
    <Page>
      <NextHead>
        <title>{metaTitle}</title>
        <meta name='description' content={metaDescription} />
        <meta name='twitter:site' property='twitter:site' content={metaTitle} />
        <meta
          name='twitter:title'
          property='twitter:title'
          content={metaTitle}
        />
        <meta
          name='twitter:image'
          property='twitter:image'
          content={metaImage}
        />
        <meta
          name='twitter:description'
          property='twitter:description'
          content={metaDescription}
        />
        <meta name='og:site_name' property='og:site_name' content={metaTitle} />
        <meta name='og:title' property='og:title' content={metaTitle} />
        <meta name='og:image' property='og:image' content={metaImage} />
        <meta
          name='og:description'
          property='og:description'
          content={metaDescription}
        />
      </NextHead>
      <StyledWrapper>
        <StyledContentWrapper>
          <StyledContentLeft>
            <StyledMarketContainer>
              <NFTPreview
                src={backendData.tokenURI}
                type={metadata.mimeType ? metadata.mimeType.split('/')[0] : ''}
              />
            </StyledMarketContainer>
          </StyledContentLeft>
          <StyledContentRight>
            <StyledMediaTitle>{metadata?.name}</StyledMediaTitle>
            <StyledShareAndPrice>
              <ContainerShare className='mr'>
                <SmallLabel>Creator Share</SmallLabel>
                <LargeValue>
                  {utils.formatUnits(profile.bidsShares.creator.value, 18)}%
                </LargeValue>
              </ContainerShare>
              {isAskExist && (
                <ContainerShare>
                  <SmallLabel>Current Price</SmallLabel>
                  <LargeValue>
                    {isEmpty(tokenMatataki) ? (
                      price()
                    ) : (
                      <Link
                        href={`${process.env.NEXT_PUBLIC_MATATAKI}/token/${tokenMatataki.tokenId}`}
                        target='_blank'
                        rel='noopener noreferrer'>
                        {price()}
                      </Link>
                    )}
                  </LargeValue>
                </ContainerShare>
              )}
            </StyledShareAndPrice>
            <Container>
              {/* <TradeButton colorType='default'>Buy now</TradeButton> */}
              <Link href={`/p/${post.id}/bids`}>
                <TradeButton colorType='default'>See bids</TradeButton>
              </Link>
              {!isMeTheOwner ? (
                <Link href={`/p/${post.id}/bid`}>
                  <TradeButton colorType='secondary'>Place a bid</TradeButton>
                </Link>
              ) : (
                <Link href={`/p/${post.id}/ask`}>
                  <TradeButton colorType='secondary'>
                    {isAskExist ? 'Edit Price' : 'Add Price'}
                  </TradeButton>
                </Link>
              )}
              <CopyToClipboard
                text={`${copyText}`}
                onCopy={() => message.info('复制成功，立即分享！')}>
                <SocialButton>
                  <IconRespondArrow />
                </SocialButton>
              </CopyToClipboard>
            </Container>
            <StyledAuthor>
              {metadata?.name} by {backendData.creator?.username}
            </StyledAuthor>
            <StyledAuthor>{metadata.description}</StyledAuthor>
            {backendData?.tags ? (
              <StyledTags>
                {backendData.tags.map((i: TagTypes, idx: number) => (
                  <Tag key={idx}>{i.name}</Tag>
                ))}
              </StyledTags>
            ) : null}
            <MediaOwnershipInfo info={backendData} />
            <ProofOfAuthenticity scanLink={scanLink} ipfsLink={ipfsLink} />
            <NFTTimeline
              timeline={timeline || []}
              creator={post.backendData.creator?.username}
            />
          </StyledContentRight>
        </StyledContentWrapper>
      </StyledWrapper>
    </Page>
  );
};

// This function gets called at build time
export async function getStaticProps(
  context: GetStaticPropsContext<Params>
): Promise<GetStaticPropsResult<Props>> {
  const { id } = context.params as Params;
  try {
    // Call an external API endpoint to get posts
    const backendData = await getMediaById(Number(id));
    const metadata = await getMediaMetadata(backendData.metadataURI);

    return {
      props: {
        post: {
          id: Number(id),
          backendData,
          metadata,
        },
      },
      // Incremental Static ReGeneration Magic!
      // If you interested, Checkout: https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration
      revalidate: 60,
    };
  } catch (error) {
    return { props: { isError: true } };
  }
}

export async function getStaticPaths() {
  const data = await getHotMediaList();

  // Get the paths we want to pre-render based on posts
  const paths = data.map(post => ({
    params: { id: String(post.id) },
  }));

  // We'll pre-render only these paths at build time.
  return { paths, fallback: true };
}

const StyledWrapperLoading = styled.div`
  text-align: center;
  margin: 100px 0 0;
`;

const StyledWrapper = styled.div`
  box-sizing: border-box;
  padding: 30px;
  margin: 0px auto;
  width: 100%;
  max-width: calc(1330px);
`;

const StyledContentWrapper = styled.div`
  width: 100%;
  display: inline-grid;
  column-gap: 30px;
  grid-template-columns: repeat(12, 1fr);
  @media screen and (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
  }
`;

const StyledContentLeft = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  align-items: flex-start;
  height: auto;
  grid-column: 1 / 8;
`;

const StyledContentRight = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  align-items: flex-start;
  height: auto;
  grid-column: 8 / 13;
`;

const StyledMarketContainer = styled.div`
  width: 100%;
  position: sticky;
  top: 125px;
  left: 0px;
  right: 0px;
  padding: 50px;
  box-sizing: border-box;
`;

const StyledMediaTitle = styled.h1`
  font-size: 50px;
  font-weight: 400;
  margin-top: 0px;
  margin-bottom: 10px;
  word-break: break-word;
`;

const StyledAuthor = styled.p`
  font-size: 16px;
  line-height: 1.2;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.7);
  word-break: break-word;
  white-space: pre-line;
  font-weight: 400;
  margin-top: 0px;
`;
const StyledTags = styled.div`
  margin-bottom: 6px;
  .ant-tag {
    margin-top: 4px;
    margin-bottom: 4px;
  }
`;

// Button 区域
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 30px;
`;

type TradeButtonProps = {
  colorType?: 'default' | 'secondary';
};
const TradeButton = styled.button<TradeButtonProps>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 20px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  appearance: none;
  color: ${({ colorType = 'default' }) => {
    if (colorType === 'default') return 'rgb(255, 255, 255)';
    if (colorType === 'secondary') return 'rgb(0, 0, 0)';
  }};
  background-color: ${({ colorType = 'default' }) => {
    if (colorType === 'default') return 'rgb(0, 0, 0)';
    if (colorType === 'secondary') return 'rgb(255, 255, 255)';
  }};
  border: ${({ colorType = 'default' }) => {
    if (colorType === 'default') return '2px solid transparent';
    if (colorType === 'secondary') return '2px solid rgb(0, 0, 0)';
  }};
  height: 60px;
  width: 100%;
  max-width: 190px;
  margin: 0px 15px 0px 0px;
  &[disabled] {
    cursor: not-allowed;
    background-color: ${({ colorType = 'default' }) => {
      if (colorType === 'default') return 'rgb(128, 128, 128)';
      if (colorType === 'secondary') return 'rgb(255, 255, 255)';
    }};
    color: ${({ colorType = 'default' }) => {
      if (colorType === 'default') return 'rgb(255, 255, 255)';
      if (colorType === 'secondary') return 'rgb(128, 128, 128)';
    }};
    ${({ colorType = 'default' }) => {
      if (colorType === 'secondary') return 'border-color: rgb(128, 128, 128);';
    }}
  }
  &:hover {
    ${({ colorType = 'default', disabled }) => {
      if (disabled) return '';
      if (colorType === 'default') return 'background-color: rgb(64, 64, 64);';
      if (colorType === 'secondary') return 'border-color: rgb(128, 128, 128);';
    }}
  }
  &:first-child {
    margin-left: 0px;
  }
`;

const SocialButton = styled.button`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 20px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  appearance: none;
  color: rgb(255, 255, 255);
  background-color: rgb(0, 0, 0);
  border: 2px solid transparent;
  height: 60px;
  width: 60px;
  &:last-child {
    margin-right: 0px;
  }
  &:hover {
    background: rgb(64, 64, 64);
  }
`;

// share
const StyledShareAndPrice = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
`;
const ContainerShare = styled.div`
  /* width: 100%; */
  margin-bottom: 10px;
  &.mr {
    margin-right: 40px;
  }
`;

const SmallLabel = styled.label`
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  line-height: 20px;
  margin-bottom: 5px;
  display: block;
`;

const LargeValue = styled.h2`
  font-weight: 500;
  font-size: 30px;
  margin-bottom: 30px;
  margin-top: 0;
`;

export default PostPage;
