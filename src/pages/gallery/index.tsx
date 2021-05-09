import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { isEmpty } from 'lodash';

import GalleryCard from '../../components/GalleryCard';
import { getGalleryUsers } from '../../backend/user';
import { User } from '../../types/User.types';
import { Table } from 'antd';
import useSWR from 'swr';
import { localFetcher as fetcher } from '../../backend/client';

const Gallery: React.FC = () => {
  const [galleryList, setGalleryList] = useState<Array<any>>([]);
  const { data: reviewData, error } = useSWR(
    '/gallery/request?page=1&limit=10',
    fetcher
  );
  const [pageIndex, setPageIndex] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const columns = [];

  useEffect(() => {
    const fetch = async () => {
      const data: Array<User> = await getGalleryUsers();
      setGalleryList(data);
    };
    fetch();
  }, []);

  if (!reviewData && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className='error'>发生了错误 {error}</div>;
  }

  return (
    <StyledWrapper>
      <div>
        <StyledHead>
          <h3>Review List:</h3>
        </StyledHead>
        <div>
          {isEmpty(reviewData.items) ? (
            'empty'
          ) : (
            <Table
              dataSource={reviewData.items}
              pagination={{
                current: pageIndex,
                total: reviewData.length,
                defaultPageSize: pageLimit,
                pageSize: pageLimit,
                showSizeChanger: true,
                position: ['bottomCenter'],
                onChange: (page, limit) => {
                  setPageIndex(page);
                  if (limit) setPageLimit(limit);
                },
              }}
              columns={columns}
            />
          )}
        </div>
      </div>
      <div>
        <StyledHead>
          <StyledHeadTitle>Gallery List</StyledHeadTitle>
        </StyledHead>
        <StyledGallery>
          {galleryList.map((i: User, idx: number) => (
            <Link key={`${idx}-${i.address}`} href={`/${i.username}`}>
              <a>
                <GalleryCard {...i}></GalleryCard>
              </a>
            </Link>
          ))}
        </StyledGallery>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1480px;
  padding: 48px 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;
const StyledHead = styled.div``;
const StyledHeadTitle = styled.h2`
  font-size: 48px;
  font-family: BigCaslon-Medium, BigCaslon;
  font-weight: 500;
  color: #333333;
  line-height: 58px;
  padding: 0;
  margin: 0;
`;

const StyledGallery = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(4, minmax(0px, 1fr));
  gap: 48px 24px;
  margin: 48px auto 0;
  min-height: 320px;
  & > a {
    width: 100%;
  }
  @media screen and (max-width: 1366px) {
    grid-template-columns: repeat(3, minmax(0px, 1fr));
  }
  @media screen and (max-width: 1140px) {
    grid-template-columns: repeat(2, minmax(0px, 1fr));
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
`;

export default Gallery;
