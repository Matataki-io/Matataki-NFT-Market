import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import CommunityCard from '../../components/CommunityCard';
import { Article } from '../../types/Article';
import { getArticles } from '../../backend/article';
import { PaginationResult } from '../../types/PaginationResult';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import { backendSWRFetcher } from '../../backend/media';
import { Pagination } from 'antd';

const Community: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const { data, error } = useSWR(
    `/article?page=${pageIndex}&limit=10`,
    backendSWRFetcher
  );

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className='error'>发生了错误 {error}</div>;
  }

  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadTitle>Community</StyledHeadTitle>
      </StyledHead>
      <StyledItem>
        {data.items.map((i: Article) => (
          <Link key={i.id} href={`/community/${i.id}`}>
            <a>
              <CommunityCard article={i}></CommunityCard>
            </a>
          </Link>
        ))}
        {isEmpty(data.items) ? <div>Empty</div> : ''}
        <StyledPagination>
          <Pagination
            defaultCurrent={pageIndex}
            onChange={(page, pageSize) => setPageIndex(page)}
            total={data.meta.totalItems}></Pagination>
        </StyledPagination>
      </StyledItem>
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
const StyledItem = styled.div`
  & > a {
    display: block;
    margin: 48px 0;
    @media screen and (max-width: 678px) {
      margin: 20px 0;
    }
  }
`;
const StyledPagination = styled.div`
  text-align: center;
`;
export default Community;
