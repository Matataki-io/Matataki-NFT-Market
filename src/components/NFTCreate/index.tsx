import React, { useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AudioRender from '../AudioRender';
import { NFTProps } from '../../../next-env';

const NFTComponents: React.FC<NFTProps> = ({
  id,
  type,
  fields,
  content,
  title,
  owner,
  creator,
  tags,
}) => {
  return (
    <StyledNFTWrapper>
      <StyledNFTHead>
        <Link href={`/${creator?.username!}`}>
          <a target='_blank' className='user'>
            {content || fields ? (
              <Avatar
                className='user-avatar'
                icon={<UserOutlined />}
                src={creator?.avatar}
              />
            ) : null}
            <span className='username'>{creator?.username}</span>
          </a>
        </Link>
      </StyledNFTHead>
      <StyledNFTContent>
        {type === 'image' ? (
          <div className='media-images'>
            <img src={content?.medium} alt='Content' />
          </div>
        ) : type === 'video' ? (
          <video
            src={fields?.low.stringValue}
            loop
            playsInline
            // autoPlay
            // poster={fields?.thumbnail.stringValue}
            className='media-video'></video>
        ) : type === 'audio' ? (
          <div className='media-audio'>
            {/* <a href={content?.medium} target='_blank' rel='noreferrer'>
              <Button style={{ margin: '40px 0' }}>Audio Play</Button>
            </a> */}
            <AudioRender src={content!.medium} mode='simple'></AudioRender>
          </div>
        ) : type === 'text' ? (
          <div className='media-text'>
            <a href={content?.medium} target='_blank' rel='noreferrer'>
              <Button style={{ margin: '40px 0' }}>Text View</Button>
            </a>
          </div>
        ) : type === 'file' ? (
          <div className='media-file'>
            <a href={content?.medium} target='_blank' rel='noreferrer'>
              <Button style={{ margin: '40px 0' }}>File View</Button>
            </a>
          </div>
        ) : type === 'url' ? (
          <div className='media-url'>
            <a href={content?.medium} target='_blank' rel='noreferrer'>
              <Button style={{ margin: '40px 0' }}>Url View</Button>
            </a>
          </div>
        ) : (
          ''
        )}
      </StyledNFTContent>
      <StyledNFTFooter>
        <h5>{title}</h5>
      </StyledNFTFooter>
    </StyledNFTWrapper>
  );
};

const StyledNFTWrapper = styled.div`
  color: #000;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;
const StyledNFTHead = styled.div`
  padding: 22px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .user {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .user-avatar {
      flex: 0 0 32px;
    }
  }
  .username {
    font-weight: 500;
    font-size: 16px;
    color: #000;
    margin: 0px 0px 0px 10px;
  }
  .time {
    font-size: 14px;
    font-weight: 400;
    opacity: 0.5;
    margin: 0px;
    color: #000;
  }
`;
const StyledNFTContent = styled.div`
  overflow: hidden;
  z-index: 0;
  position: relative;
  /* height: 100%;
  width: 100%; */
  height: 342px;
  max-width: 342px;
  /* width: 342px; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* flex: 1; */
  border: 1px solid rgb(0 0 0 / 5%);
  .media-video,
  .media-text,
  .media-file,
  .media-url {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    margin: 0px auto;
    object-fit: contain;
  }
  .media-images {
    width: 100%;
    height: 100%;
    /* min-height: 300px; */
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      display: block;
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      margin: 0px auto;
      object-fit: contain;
    }
  }
  .media-audio {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const StyledNFTFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  h5 {
    margin: 24px 0 22px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    font-size: 24px;
    font-family: bigCaslonMedium, BigCaslon-Medium, BigCaslon,
      'Playfair Display', serif;
    font-weight: 500;
    color: #333333;
    line-height: 28px;
  }
`;
const StyledNFTFooterPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  & > div:nth-child(1) {
    margin-right: 62px;
  }
  width: 100%;
  .price {
    font-size: 20px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #193cb1;
    line-height: 24px;
    padding: 0;
    margin: 0;
  }
  .name {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #193cb1;
    line-height: 17px;
    padding: 0;
    margin: 4px 0 0 0;
  }
`;

export default NFTComponents;
