import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import GalleryCard from '../../components/GalleryCard';
import type { Gallery } from '../../types/Gallery';
import useSWR from 'swr';
import { backendSWRFetcher } from '../../backend/media';
import { Button, Spin } from 'antd';
import { UserRole } from '../../constant';
import { Card, Text } from '@geist-ui/react';

const GalleryIndex: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, error } = useSWR(
    `/gallery?page=${page}&limit=${limit}`,
    backendSWRFetcher
  );
  const { data: me, error: meError } = useSWR('/user/me', backendSWRFetcher);

  return (
    <StyledWrapper>
      <Spin size={'large'} spinning={!data}>
        {data && (
          <>
            <StyledHead>
              <StyledHeadTitle>Gallery List</StyledHeadTitle>
            </StyledHead>
            <StyledGallery>
              {data.items.map((gallery: Gallery, idx: number) => (
                <Link key={`${gallery.id}`} href={`/gallery/${gallery.id}`}>
                  <a>
                    <GalleryCard {...gallery} />
                  </a>
                </Link>
              ))}
            </StyledGallery>
          </>
        )}
      </Spin>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1480px;
  padding: 48px 20px 256px;
  box-sizing: border-box;

  margin: 0 auto;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
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
  @media screen and (max-width: 678px) {
    font-size: 30px;
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

  .loading-container {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
`;

export default GalleryIndex;
