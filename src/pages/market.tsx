import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Checkbox, Radio, Spin, message, Select } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import NFT from '../components/NFT';
import { NFTProps } from '../../next-env';
import { PaginationResult } from '../types/PaginationResult';
import { Media, MediaMetadata } from '../types/Media.entity';
import { getMediaList, getMediaMetadata } from '../backend/media';
import { getTags } from '../backend/tag';
const { Option } = Select;

type PaginationMeta = PaginationResult['meta'];
type MediaWithMetadata = Media & {
  metadata: MediaMetadata;
};

enum SortBy {
  ASCE = 'ASCE',
  DECE = 'DECE',
}

const Market: React.FC = () => {
  // 更多 NFT
  const [NFTList, setNFTList] = useState<Array<NFTProps>>([]);
  const [fullNFTList, setFullNFTList] = useState<Array<NFTProps>>([]);
  const [departmentTags, setDepartmentTags] = useState<Array<JSX.Element>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sort, setSort] = useState<SortBy>(SortBy.DECE);
  const [page, setPage] = useState<number>(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 0,
    totalPages: 0,
    currentPage: 0,
  });

  // 获取NFT数据
  const fetchNFTData = async () => {
    try {
      const mediaList = await getMediaList(page, 12);
      console.log('mediaList', mediaList);
      if (mediaList.items.length) {
        const getMediaWithMetaList = mediaList.items.map(async item => {
          const metadata = await getMediaMetadata(item.metadataURI);
          return {
            ...item,
            metadata,
          };
        });
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

        setNFTList(NFTList.concat(realNftList));
        setFullNFTList(fullNFTList.concat(realNftList));
        setPaginationMeta(mediaList.meta);
      }
      let _page = page;
      setPage(++_page);
    } catch (e) {
      message.error(`数据获取失败${e.toString()}`);
    }
  };

  // fetch department tags
  getTags().then(res => {
    setDepartmentTags(
      res.data.map(tag => (
        <Option value={tag.name} key={tag.name}>
          {tag.name}
        </Option>
      ))
    );
  });

  const onListDepartment = (checkedList: any[]) => {
    if (!checkedList.length) {
      setNFTList(fullNFTList);
      setHasMore(true);
    } else {
      setHasMore(false);

      const subList = fullNFTList.filter(media => {
        const mediaTags = media.tags.map(tag => tag.name);
        return checkedList.every(tag => mediaTags.includes(tag));
      });

      setNFTList(subList);
    }
  };

  const onSort = (e: any) => {
    if (NFTList.length) {
      NFTList.sort((a, b) =>
        // @ts-ignore
        e.target.value === SortBy.ASCE ? a.id - b.id : b.id - a.id
      );
    }

    setSort(e.target.value);
  };

  // 处理滚动Load
  const handleInfiniteOnLoad = async () => {
    setLoading(true);
    // 第一页不判断
    await fetchNFTData();
    setLoading(false);
  };
  return (
    <StyledWrapper>
      <StyledHeadTitle>Market Place</StyledHeadTitle>
      <StyledHead>
        <div>
          <h3>DEPARTMENT</h3>
          <StyledHeadContainer className='filter'>
            <Select
              mode='multiple'
              allowClear
              size='large'
              style={{ width: '420px' }}
              placeholder='Select tag to filter media'
              onChange={onListDepartment}>
              {departmentTags}
            </Select>
          </StyledHeadContainer>
        </div>
        <div>
          <h3>SORT BY</h3>
          <StyledHeadContainer className='filter'>
            <Radio.Group onChange={onSort} value={sort}>
              <Radio value={SortBy.ASCE}>Creat Date - Ascending</Radio>
              <Radio value={SortBy.DECE}>Creat Date - Descending</Radio>
            </Radio.Group>
          </StyledHeadContainer>
        </div>
      </StyledHead>
      <StyledLine></StyledLine>
      <InfiniteScroll
        pageStart={0}
        loadMore={handleInfiniteOnLoad}
        hasMore={!loading && hasMore}>
        <StyledNfts>
          {NFTList.map((i, idx) => (
            // 这里有报错
            // Warning: validateDOMNesting(...): <a> cannot appear as a descendant of <a>.
            <Link href={`/p/${i.id}`} key={idx}>
              <a target='_blank'>
                <NFT {...i}></NFT>
              </a>
            </Link>
          ))}
          {loading && hasMore && (
            <div className='loading-container'>
              <Spin />
            </div>
          )}
        </StyledNfts>
      </InfiniteScroll>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1114px;
  padding: 48px 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const StyledHeadTitle = styled.h2`
  font-size: 48px;
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  color: #333333;
  line-height: 58px;
  padding: 0;
  margin: 0;
`;
const StyledHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 0;
  flex-wrap: wrap;
  .title {
    font-size: 20px;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
    padding: 0;
    margin: 0;
  }
`;
const StyledHeadContainer = styled.div`
  margin: 24px 0 0 0;
  &.filter {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-row-gap: 24px;
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
