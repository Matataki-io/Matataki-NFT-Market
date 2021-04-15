import React from 'react';
import { useRouter } from 'next/router';

import { Button, Grid, Image, Link, Text, User } from '@geist-ui/react';
import { getTokenOnScan } from '../../../utils/token';
import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import styled from 'styled-components';
import useSWR from 'swr';

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
import { MediaLog } from '../../../types/MediaLog';

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
  const router = useRouter();
  const { id } = router.query;
  const { backendData, metadata } = useMediaData(post!);

  const { profile, isMeTheOwner } = useMediaToken(Number(post?.id));
  const scanLink = getTokenOnScan(Number(id));
  const ipfsLink = post?.backendData.tokenURI;

  const { data: timeline, error } = useSWR<Array<Ask | MediaLog>>(
    `/media/${id}/logs`,
    backendSWRFetcher
  );

  if (!post && !isError) return <div>Loading</div>;
  if (!post)
    return (
      <div>
        <Text h1>Sorry</Text>
        <Text>But the Token is not exist yet, please check with the URL</Text>
      </div>
    );
  //   if (!data || !metadata) return <div>loading...</div>;
  return (
    <Page>
      <StyledWrapper>
        <StyledContentWrapper>
          <StyledContentLeft>
            <StyledMarketContainer>
              <NFTPreview
                src={backendData.tokenURI}
                type={
                  metadata.mimeType ? metadata.mimeType.split('/')[0] : ''
                }></NFTPreview>
            </StyledMarketContainer>
          </StyledContentLeft>
          <StyledContentRight>
            <StyledMediaTitle>{metadata.name}</StyledMediaTitle>

            <StyledShareAndPrice>
              <ContainerShare className='mr'>
                <SmallLabel>Creator Share</SmallLabel>
                <LargeValue>{20}%</LargeValue>
              </ContainerShare>
              {profile.currentAsk.amount.gt(0) && (
                <ContainerShare>
                  <SmallLabel>Current Price</SmallLabel>
                  <LargeValue>
                    {utils.formatUnits(
                      profile.currentAsk.amount,
                      getDecimalOf(profile.currentAsk.currency)
                    )}{' '}
                    {getSymbolOf(profile.currentAsk.currency)}
                  </LargeValue>
                </ContainerShare>
              )}
            </StyledShareAndPrice>

            <Container>
              <TradeButton colorType='default'>Buy now</TradeButton>
              {!isMeTheOwner ? (
                <Link href={`/p/${post.id}/bid`}>
                  <TradeButton colorType='secondary'>Place a bid</TradeButton>
                </Link>
              ) : (
                <Link href={`/p/${post.id}/ask`}>
                  <TradeButton colorType='secondary'>Add Price</TradeButton>
                </Link>
              )}
              <SocialButton>
                <IconRespondArrow />
              </SocialButton>
            </Container>
            <StyledAuthor>
              {metadata.name} by {backendData.creator?.username}
            </StyledAuthor>
            <StyledAuthor>{metadata.description}</StyledAuthor>
            <MediaOwnershipInfo info={backendData} />
            <ProofOfAuthenticity scanLink={scanLink} ipfsLink={ipfsLink} />
            <NFTTimeline
              timeline={timeline || []}
              creator={post.backendData.creator?.username}></NFTTimeline>
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
  height: 470px;
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
  margin-bottom: 30px;
  word-break: break-word;
`;

const StyledAuthor = styled.p`
  font-size: 16px;
  line-height: 28px;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.7);
  word-break: break-word;
  white-space: pre-line;
  font-weight: 400;
  margin-top: 0px;
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
