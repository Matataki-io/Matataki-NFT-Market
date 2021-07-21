import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { message, Image } from 'antd';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Article } from '../../types/Article';
import { getArticle } from '../../backend/article';
import moment from 'moment';
import { isMobile } from 'react-device-detect';

const CommunityId: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (id) {
          const res: any = await getArticle(Number.parseInt(id as string));
          if (res.status === 200) {
            setArticle(res.data);
          } else {
            message.error('获取失败');
          }
        }
      } catch (e) {
        console.log('e', e);
      }
    };
    fetchPost();
  }, [router, id]);

  return (
    <>
      {article === null ? (
        <div>loading</div>
      ) : (
        <StyledWrapper>
          <Head>
            <title>{article?.title}</title>
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

          {article?.cover ? (
            isMobile ? (
              <Image
                width={'100%'}
                height={200}
                style={{ objectFit: 'cover' }}
                src={article?.cover}></Image>
            ) : (
              <Image
                width={'100%'}
                height={400}
                style={{ objectFit: 'cover' }}
                src={article?.cover}></Image>
            )
          ) : null}
          <StyledTitle>{article?.title}</StyledTitle>
          <StyledTime>
            {moment(article?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
          </StyledTime>
          <StyledLine></StyledLine>
          <StyledMd>
            {article?.content ? (
              <ReactMarkdown className='markdown-body'>
                {article?.content}
              </ReactMarkdown>
            ) : null}
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

  @media screen and (max-width: 576px) {
    padding: 10px 10px 80px;
  }
`;

const StyledTitle = styled.h1`
  font-size: 30px;
  font-family: bigCaslonMedium, BigCaslon-Medium, BigCaslon, 'Playfair Display',
    serif;
  font-weight: 500;
  color: #333333;
  line-height: 1.4;
  padding: 0;
  margin: 0;
  @media screen and (max-width: 576px) {
    font-size: 24px;
  }
`;
const StyledTime = styled.time`
  font-size: 14px;
  font-weight: 400;
  color: #777777;
  line-height: 20px;
  padding: 0;
  margin: 24px 0 16px 0;
  display: inline-block;
  @media screen and (max-width: 576px) {
    margin: 10px 0;
  }
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
