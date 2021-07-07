import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Input, Tabs, Avatar, Spin, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useDebounce, useMount } from 'ahooks';
import useSWR from 'swr';
import Link from 'next/link';

import { backendSWRFetcher } from '../../backend/media';
import { Media } from '../../types/Media.entity';
import { User } from '../../types/User.types';
import { isEmpty } from 'lodash';
import NFTPreview from '../NFTPreview';
import { shortedAccount } from '../../utils/index';

const { TabPane } = Tabs;
const { Text } = Typography;

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, { wait: 1000 });
  const [isShowResult, setIsShowResult] = useState<boolean>(false);

  const showResult = useMemo(() => {
    return isShowResult && !!debouncedKeyword;
  }, [isShowResult, debouncedKeyword]);

  const { data, error } = useSWR(
    `/search?keyword=${debouncedKeyword}`,
    backendSWRFetcher
  );

  useMount(() => {
    if (process.browser) {
      document.addEventListener(
        'click',
        () => {
          setIsShowResult(false);
        },
        false
      );
    }
  });

  useEffect(() => {
    if (!isShowResult) {
      setKeyword('');
    }
  }, [isShowResult]);

  return (
    <StyledWrapper>
      <StyledHeaderSearch
        onChange={e => {
          e.stopPropagation();
          setKeyword(e.target.value);
        }}
        onFocus={e => {
          e.stopPropagation();
          setIsShowResult(true);
        }}
        value={keyword}
        onClick={e => {
          e.stopPropagation();
        }}
        placeholder='Search...'
      />
      {showResult ? (
        <StyledWrapperResult
          onClick={e => {
            e.stopPropagation();
          }}>
          {error ? (
            <div>failed to search</div>
          ) : (
            <Tabs defaultActiveKey='1'>
              <StyledPanne tab='Creators' key='1'>
                {!isEmpty(data) ? (
                  <>
                    {data.matchedUsers.length ? (
                      data.matchedUsers.map((user: User) => (
                        <Link href={`/${user.username}`} key={user.username}>
                          <a target='_blank' className='item'>
                            <Avatar src={user.avatar}></Avatar>
                            <span className='author'>
                              {shortedAccount(user.nickname)}({user.username})
                            </span>
                            <ArrowRightOutlined className='icon' />
                          </a>
                        </Link>
                      ))
                    ) : (
                      <StyledSearchNot>
                        <Text>No Results found</Text>
                      </StyledSearchNot>
                    )}
                  </>
                ) : (
                  <Spin tip='Searching now...'></Spin>
                )}
              </StyledPanne>
              <StyledPanne tab='NFTs' key='2'>
                {!isEmpty(data) ? (
                  <>
                    {data.matchedMedias.length ? (
                      data.matchedMedias.map((media: Media) => (
                        <Link href={`/p/${media.id}`} key={media.id}>
                          <a target='_blank' className='item'>
                            <div className='nft'>
                              <NFTPreview src={media.tokenURI} type='image' />
                            </div>
                            <div className='user-info'>
                              <h4 className='user-info__title'>
                                {media.title || 'not...'}
                              </h4>
                              <p className='user-info__description'>
                                {media.description || 'not...'}
                              </p>
                              <p className='user-info__username'>
                                By @{media.creator?.username}
                              </p>
                            </div>
                            <ArrowRightOutlined className='icon' />
                          </a>
                        </Link>
                      ))
                    ) : (
                      <StyledSearchNot>
                        <Text>No Results found</Text>
                      </StyledSearchNot>
                    )}
                  </>
                ) : (
                  <Spin tip='Searching now...'></Spin>
                )}
              </StyledPanne>
            </Tabs>
          )}
        </StyledWrapperResult>
      ) : null}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  width: 400px;
`;
const StyledWrapperResult = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 40px;
  width: 100%;
  border-radius: 4px;
  background: rgb(255, 255, 255);
  border: 1px solid #dedede;
  box-sizing: border-box;
  padding: 0 10px;
  .item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    color: #000;
    .author {
      margin-left: 15px;
      font-size: 14px;
      color: #000;
    }
    .icon {
      color: rgba(0, 0, 0, 0.5);
      font-size: 15px;
      margin-left: auto;
    }

    .nft {
      width: 60px;
      height: 60px;
      overflow: hidden;
    }
    .user-info {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      height: 60px;
      justify-content: space-between;
    }
    .user-info__title {
      font-size: 16px;
      font-weight: 500;
      padding: 0;
      margin: 0;
      line-height: 1;
    }
    .user-info__description {
      font-size: 14px;
      padding: 0;
      margin: 0;
      line-height: 1;
      color: #969696;
      font-weight: 400;
    }
    .user-info__username {
      font-size: 14px;
      padding: 0;
      margin: 0;
      line-height: 1;
      color: #969696;
      font-weight: 400;
    }
  }
`;
const StyledPanne = styled(TabPane)`
  overflow: auto;
  max-height: 500px;
`;
const StyledHeaderSearch = styled(Input)`
  margin-right: 16px;
`;
const StyledSearchNot = styled.div`
  margin: 10px 15px 20px;
`;

export default Search;
