import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Radio, Spin, message, Select, Pagination } from 'antd';
import NFT from '../components/NFT';
import { NFTProps } from '../../next-env';
import { Media, MediaMetadata } from '../types/Media.entity';
import { getMediaMetadata, backendSWRFetcher } from '../backend/media';
import { useMarketPrices } from '../hooks/useMarketPrices';
import { getTags } from '../backend/tag';
import { Tag as TagType } from '../types/Tag';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { isMobile } from 'react-device-detect';

const { Option } = Select;

type MediaWithMetadata = Media & {
  metadata: MediaMetadata;
};

enum SortBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

const Market: React.FC = () => {
  // nft list
  const [NFTList, setNFTList] = useState<Array<NFTProps>>([]);

  const nftIds = useMemo(
    () => NFTList.map(i => (i.id === undefined ? null : i.id)),
    [NFTList]
  );
  const { priceBook, isLoading: isPriceBookLoading } = useMarketPrices(nftIds);
  const [tagList, setTagList] = useState<Array<TagType>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sort, setSort] = useState<SortBy>(SortBy.DESC);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [currentTag, setCurrentTag] = useState<string[]>([]);
  const { data: mediaList, error } = useSWR(
    `/media?page=${page}&limit=${limit}&order=${sort}${
      !isEmpty(currentTag) ? '&tags=' + currentTag : ''
    }`,
    backendSWRFetcher
  );

  // 获取NFT数据
  const fetchNFTData = useCallback(async () => {
    try {
      console.log('mediaList', mediaList);
      if (mediaList.items.length) {
        setLoading(true);
        try {
          const getMediaWithMetaList = mediaList.items.map(
            async (item: Media) => {
              const metadata = await getMediaMetadata(item.metadataURI);
              return {
                ...item,
                metadata,
              };
            }
          );
          const mediaWithMetaList: MediaWithMetadata[] = await Promise.all(
            getMediaWithMetaList
          );
          const realNftList: NFTProps[] = mediaWithMetaList.map(media => {
            return {
              id: media.id,
              type: media.metadata.mimeType.split('/')[0],
              title: media.metadata.name,
              fields: {
                low: { stringValue: media.tokenURI },
                stream: { stringValue: media.tokenURI },
                medium: { stringValue: media.tokenURI },
                high: { stringValue: media.tokenURI },
                thumbnail: { stringValue: media.tokenURI },
              },
              content: {
                low: media.tokenURI,
                stream: media.tokenURI,
                medium: media.tokenURI,
                high: media.tokenURI,
                thumbnail: media.tokenURI,
              },
              owner: media.owner,
              creator: media.creator,
              tags: media.tags,
            };
          });

          setNFTList(realNftList);
        } catch (e) {
          console.log('e', e.toString());
          setNFTList([]);
        } finally {
          setLoading(false);
        }
      } else {
        setNFTList([]);
      }
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
      setNFTList([]);
    }
  }, [mediaList]);

  useEffect(() => {
    if (!isEmpty(mediaList)) {
      fetchNFTData();
    } else {
      setNFTList([]);
    }
  }, [mediaList, fetchNFTData]);

  // fetch department tags
  useEffect(() => {
    const fetch = async () => {
      try {
        const res: any = await getTags();
        if (res.status === 200) {
          setTagList(res.data);
        } else {
          throw new Error('fail');
        }
      } catch (e) {
        console.log(e.toString());
      }
    };
    fetch();
  }, []);

  const handleTagSelect = (value: string) => {
    // console.log('value', value);
    setCurrentTag([value]);
  };

  if (!isEmpty(error)) {
    return (
      <StyledWrapper>
        <StyledWrapperLoading>Please refresh the page...</StyledWrapperLoading>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper>
      <StyledHeadTitle>Market Place</StyledHeadTitle>
      <StyledHead>
        <div>
          <h3 className='title'>DEPARTMENT</h3>
          <StyledHeadContainer className='filter'>
            <Select
              className='tags'
              allowClear
              placeholder='Select tag'
              onSelect={handleTagSelect}
              onClear={() => setCurrentTag([])}>
              {tagList.map((i: TagType, idx: number) => (
                <Option value={i.name} key={`${idx}-${i.name}`}>
                  {i.name}
                </Option>
              ))}
            </Select>
          </StyledHeadContainer>
        </div>
        <div>
          <h3 className='title'>SORT BY</h3>
          <StyledHeadContainer className='filter'>
            <Radio.Group onChange={e => setSort(e.target.value)} value={sort}>
              <Radio value={SortBy.DESC}>New</Radio>
              <Radio value={SortBy.ASC}>Create</Radio>
            </Radio.Group>
          </StyledHeadContainer>
        </div>
      </StyledHead>
      <StyledLine></StyledLine>
      {isEmpty(mediaList) ? ( // 如果在加载
        <StyledWrapperLoading>
          <Spin tip='Loading...'></Spin>
        </StyledWrapperLoading>
      ) : isEmpty(NFTList) && !loading ? ( // 如果空数据并且loading完成
        <StyledWrapperLoading>
          <p>Not Result...</p>
        </StyledWrapperLoading>
      ) : (
        <>
          <StyledNfts>
            {NFTList.map((i, idx) => (
              <Link href={`/p/${i.id}`} key={`${idx}-${i.id}`}>
                <a target='_blank'>
                  <NFT {...i} currentAsk={priceBook[i.id as number]}></NFT>
                </a>
              </Link>
            ))}
          </StyledNfts>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Pagination
              pageSize={limit}
              current={page}
              total={mediaList?.meta.totalItems || 0}
              showSizeChanger={false}
              onChange={page => {
                setPage(page);
              }}
            />
          </div>
        </>
      )}
    </StyledWrapper>
  );
};

const StyledWrapperLoading = styled.div`
  text-align: center;
  margin: 100px 0 0;
`;

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1114px;
  padding: 48px 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 576px) {
    padding: 20px 10px 80px;
  }
`;

const StyledHeadTitle = styled.h2`
  font-size: 48px;
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  color: #333333;
  line-height: 1.2;
  padding: 0;
  margin: 0;
  @media screen and (max-width: 576px) {
    font-size: 22px;
  }
`;
const StyledHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 0;
  flex-wrap: wrap;
  .title {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    line-height: 1.5;
    padding: 0;
    margin: 0;
  }
  @media screen and (max-width: 576px) {
    padding: 20px 0;
  }
`;
const StyledHeadContainer = styled.div`
  margin: 24px 0 0 0;
  @media screen and (max-width: 576px) {
    margin-top: 10px;
  }
  &.filter {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-row-gap: 24px;
    .tags {
      width: 300px;
      @media screen and (max-width: 576px) {
        width: 160px;
      }
    }
  }
`;

const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  background: #dbdbdb;
`;

const StyledNfts = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(3, minmax(0px, 330px));
  gap: 40px 24px;
  margin: 44px auto 0;
  min-height: 320px;
  & > a {
    width: 100%;
  }
  /* @media screen and (max-width: 1366px) {
    grid-template-columns: repeat(3, minmax(0px, 330px));
  } */
  @media screen and (max-width: 1140px) {
    grid-template-columns: repeat(2, minmax(0px, 330px));
  }
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media screen and (max-width: 576px) {
    margin-top: 20px;
    gap: 10px 0;
  }
  .loading-container {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
  & > a {
    height: 456px;
  }
`;
export default Market;
