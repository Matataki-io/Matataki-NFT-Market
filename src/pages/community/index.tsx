import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import CommunityCard from '../../components/CommunityCard';
import { Post } from '../../types/post';
import { getPosts } from '../../backend/post';

const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    const fetch = async () => {
      setPosts(await getPosts(1, 10));
    };
    fetch();
  }, []);
  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadTitle>Community</StyledHeadTitle>
      </StyledHead>
      <StyledItem>
        {posts.map(i => (
          <Link key={i.id} href={`/community/${i.id}`}>
            <a>
              <CommunityCard post={i}></CommunityCard>
            </a>
          </Link>
        ))}
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
  font-family: BigCaslon-Medium, BigCaslon;
  font-weight: 500;
  color: #333333;
  line-height: 58px;
  padding: 0;
  margin: 0;
`;
const StyledItem = styled.div`
  & > a {
    display: block;
    margin: 48px 0;
  }
`;
export default Community;
