import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Page from '../../components/Page';
import MediaViewer from '../../components/MediaViewer';
import SwitchOptions, {
  SwitchOptionsOnChangeParam,
} from '../../components/SwitchOptions';
import MediaMarketInfo from '../../components/MediaMarketInfo';
import MediaTradeActions from '../../components/MediaTradeActions';
import MediaOwnershipInfo, {
  MediaOwnership,
} from '../../components/MediaOwnershipInfo';
import ProofOfAuthenticity from '../../components/ProofOfAuthenticity';
import {
  getMediaById,
  getMediaList,
  getMediaMetadata,
  MediaListItem,
  MediaMetadata,
} from '../../api/api';
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { getTokenOnScan } from '../../utils/token';

export type MediaPagePost = {
  id: number;
  backendData: MediaListItem;
  metadata: MediaMetadata;
};

export interface MediaPageProps {
  post?: MediaPagePost;
  isError?: boolean;
}

export type RealPostInfo = {
  post: MediaPagePost;
  ownership: MediaOwnership;
  scanLink: string;
  ipfsLink: string;
};

const initRealPostInfo: RealPostInfo = {
  post: {
    id: -1,
    backendData: {
      id: -1,
      isBurn: false,
      tokenURI: '',
      metadataURI: '',
      contentHash: '',
      metadataHash: '',
      creationTx: '',
    },
    metadata: {
      description: '',
      mimeType: '',
      name: '',
      version: '',
    },
  },
  ownership: {
    creator: {
      avatar: '',
      username: '',
      isVerified: false,
    },
    owner: {
      avatar: '',
      username: '',
      isVerified: false,
    },
  },
  scanLink: '',
  ipfsLink: '',
};

const MediaPage: React.FC<MediaPageProps> = ({ post, isError }) => {
  const router = useRouter();
  const { id } = router.query;
  const switchOptions = ['Media', 'Market'] as const;
  const handleSwitchChange = (
    o: SwitchOptionsOnChangeParam<typeof switchOptions[number]>
  ) => {
    console.log(o.option);
  };

  const [postInfo, setPostInfo] = useState<RealPostInfo>(initRealPostInfo);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // Call an external API endpoint to get posts
        const { data: backendData } = await getMediaById(id as string);
        const { data: metadata } = await getMediaMetadata(
          backendData.metadataURI
        );
        const scanLink = getTokenOnScan(backendData.id);
        const ipfsLink = backendData.tokenURI;

        const realPostInfo: RealPostInfo = {
          ...post,
          post: {
            id: Number(backendData.id),
            backendData,
            metadata,
          },
          ownership: {
            creator: {
              avatar:
                'https://ipfs.fleek.co/ipfs/bafybeib6gfnnniiapr7haxeo7ao36ffzcvm6xwjvsl4sfzvf2p7yxkwyei',
              username: 'kikillo',
              isVerified: true,
            },
            owner: {
              avatar: '',
              username: 'mattjrob',
              isVerified: true,
            },
          },
          scanLink,
          ipfsLink,
        };

        setPostInfo(realPostInfo);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id, post]);

  return (
    <Page>
      <StyledWrapper>
        <StyledContentWrapper>
          <StyledContentLeft>
            <StyledMarketContainer>
              <MediaViewer
                type='image'
                src={postInfo.post.backendData.tokenURI}
              />
              <SwitchOptions
                options={switchOptions}
                onChange={handleSwitchChange}
              />
            </StyledMarketContainer>
          </StyledContentLeft>
          <StyledContentRight>
            <StyledMediaTitle>{postInfo.post.metadata.name}</StyledMediaTitle>
            <MediaMarketInfo value={20} />
            <MediaTradeActions />
            <StyledAuthor>
              {postInfo.post.metadata.name} by{' '}
              {postInfo.ownership.creator?.username}
            </StyledAuthor>
            <StyledAuthor>{postInfo.post.metadata.description}</StyledAuthor>
            <MediaOwnershipInfo info={postInfo.ownership} />
            <ProofOfAuthenticity
              scanLink={postInfo.scanLink}
              ipfsLink={postInfo.ipfsLink}
            />
          </StyledContentRight>
        </StyledContentWrapper>
      </StyledWrapper>
    </Page>
  );
};

export type UrlQueryParams = {
  id: string;
  username: string;
};

// This function gets called at build time
export async function getStaticPaths(): Promise<
  GetStaticPathsResult<UrlQueryParams>
> {
  const { data } = await getMediaList();

  // Get the paths we want to pre-render based on posts
  const paths = data.map(post => ({
    params: { id: String(post.id), username: 'jah' },
  }));

  // We'll pre-render only these paths at build time.
  return { paths, fallback: true };
}

// This function gets called at build time
export async function getStaticProps(
  context: GetStaticPropsContext<UrlQueryParams>
): Promise<GetStaticPropsResult<MediaPageProps>> {
  const { id } = context.params as UrlQueryParams;
  try {
    // Call an external API endpoint to get posts
    const { data: backendData } = await getMediaById(id);
    const { data: metadata } = await getMediaMetadata(backendData.metadataURI);

    return {
      props: {
        post: {
          id: Number(id),
          backendData,
          metadata,
        },
        isError: false,
      },
    };
  } catch (error) {
    return { props: { isError: true } };
  }
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

export default MediaPage;
