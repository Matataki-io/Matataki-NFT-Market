import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Post } from '../../types/post';
import { getPost } from '../../backend/post';

const CommunityId: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const x = await getPost(Number.parseInt(id as string));
        setPost(x);
      }
    };
    fetchPost();
  }, [router]);

  return (
    <>
      {post === null ? (
        <div>loading</div>
      ) : (
        <StyledWrapper>
          <Head>
            <title>{post?.title}</title>
            <link
              rel='preload'
              href='https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css'
              as='style'
            />
            <link
              rel='stylesheet'
              href='https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css'
            />
          </Head>
          <StyledTitle>{post?.title}</StyledTitle>
          <StyledTime>March 28, 2021</StyledTime>
          <StyledUser>
            <Avatar></Avatar>
            <span className='username'>{post?.author}</span>
          </StyledUser>
          <StyledLine></StyledLine>
          <StyledMd>
            <ReactMarkdown className='markdown-body'>
              {post?.content}
            </ReactMarkdown>
          </StyledMd>
        </StyledWrapper>
      )}
    </>
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

const StyledTitle = styled.h1`
  font-size: 48px;
  font-family: BigCaslon-Medium, BigCaslon;
  font-weight: 500;
  color: #333333;
  line-height: 58px;
  padding: 0;
  margin: 0;
`;
const StyledTime = styled.time`
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #777777;
  line-height: 20px;
  padding: 0;
  margin: 24px 0 16px 0;
  display: inline-block;
`;
const StyledUser = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 44px;
  .username {
    margin-left: 8px;
  }
`;
const StyledLine = styled.div`
  height: 1px;
  background: #dbdbdb;
`;
const StyledMd = styled.div`
  margin: 28px 0 0 0;
  .markdown-body {
  }
`;
export default CommunityId;
