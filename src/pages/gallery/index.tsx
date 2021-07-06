import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import GalleryCard from '../../components/GalleryCard';
import type { Gallery } from '../../types/Gallery';
import useSWR from 'swr';
import { backendSWRFetcher } from '../../backend/media';
import { Spin, Pagination } from 'antd';
import { isEmpty } from 'lodash';

const GalleryIndex: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const { data, error } = useSWR(
    `/gallery?page=${page}&limit=${limit}`,
    backendSWRFetcher
  );

  if (!isEmpty(error)) {
    return (
      <StyledWrapper>
        <StyledWrapperLoading>Please refresh the page...</StyledWrapperLoading>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadTitle>Gallery List</StyledHeadTitle>
      </StyledHead>
      {isEmpty(data) ? (
        <StyledWrapperLoading>
          <Spin tip='Loading...'></Spin>
        </StyledWrapperLoading>
      ) : isEmpty(data.items) ? (
        <StyledWrapperLoading>
          <p>Not Result...</p>
        </StyledWrapperLoading>
      ) : (
        <>
          <StyledGallery>
            {data.items.map((gallery: Gallery) => (
              <Link key={`${gallery.id}`} href={`/gallery/${gallery.id}`}>
                <a>
                  <GalleryCard {...gallery} />
                </a>
              </Link>
            ))}
          </StyledGallery>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Pagination
              pageSize={limit}
              current={page}
              total={data?.meta.totalItems || 0}
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

  max-width: 1480px;
  padding: 48px 20px 256px;
  box-sizing: border-box;

  margin: 0 auto;
  width: 100%;

  @media screen and (max-width: 576px) {
    padding: 20px 10px 80px;
  }
`;
const StyledHead = styled.div``;
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

  @media screen and (max-width: 576px) {
    margin-top: 20px;
    gap: 10px 0;
  }

  .loading-container {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
`;

export default GalleryIndex;
