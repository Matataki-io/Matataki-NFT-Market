import React from 'react';
import styled from 'styled-components';
import { Button } from '@geist-ui/react';
import moment from 'moment';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import AudioRender from '../AudioRender';
import { NFTProps } from '../../../next-env';

const NFTComponents: React.FC<NFTProps> = ({
  id,
  type,
  fields,
  content,
  avatar_url,
  username,
  title,
  time,
}) => {
  return (
    <StyledNFTWrapper>
      <StyledNFTHead>
        <div className='user'>
          {content || fields ? (
            <Avatar
              className='user-avatar'
              icon={<UserOutlined />}
              src={avatar_url || ''}
            />
          ) : (
            ''
          )}
          <span className='username'>{username}</span>
        </div>
        <span className='time'>
          {time && moment(time).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </StyledNFTHead>
      <StyledNFTContent>
        {type === 'image' ? (
          <img src={content?.medium} alt='Content' className='media-images' />
        ) : type === 'video' ? (
          <video
            src={fields?.low.stringValue}
            loop
            playsInline
            // autoPlay
            poster={fields?.thumbnail.stringValue}
            className='media-video'></video>
        ) : type === 'audio' ? (
          <div className='media-audio'>
            {/* <a href={content?.medium} target='_blank' rel='noreferrer'>
              <Button style={{ margin: '40px 0' }}>Audio Play</Button>
            </a> */}
            <AudioRender src={content?.medium}></AudioRender>
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
        <StyledNFTFooterUser>
          <div className='user'>
            <span className='subtitle'>{username ? 'Collected by' : ''}</span>
            <div className='owner'>
              <span className='owner-name'>{username}</span>
              {content || fields ? (
                <Avatar
                  className='custom-avatar'
                  icon={<UserOutlined />}
                  size={16}
                  src={avatar_url || ''}
                />
              ) : (
                ''
              )}
            </div>
          </div>
          <div className='id'>{id ? `#${id}` : ''}</div>
        </StyledNFTFooterUser>
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
  padding: 20px 15px;
  height: 70px;
  border: 2px solid rgba(0, 0, 0, 0.1);
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
  height: 100%;
  border-left: 2px solid rgba(0, 0, 0, 0.1);
  border-right: 2px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  .media-images,
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
  .media-audio {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const StyledNFTFooter = styled.div`
  padding: 15px;
  min-height: 100px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  h5 {
    font-size: 15px;
    font-weight: 600;
    line-height: 30px;
    margin-bottom: 10px;
    margin-top: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
`;
const StyledNFTFooterUser = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .user {
    font-weight: 500;
    width: auto;
    flex: 0 1 auto;
    margin-bottom: 0px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .subtitle {
    font-size: 15px;
    margin: 0px 5px 0px 0px;
    color: rgba(0, 0, 0, 0.5);
    line-height: 30px;
    font-weight: 400;
  }
  .owner {
    width: auto;
    flex: 0 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .owner-name {
      font-weight: 500;
      font-size: 15px;
      line-height: 30px;
      white-space: nowrap;
      margin: 0px 5px 0px 0px;
    }
  }
  .id {
    font-size: 16px;
    font-weight: 400;
  }
  .custom-avatar {
    flex: 0 0 16px;
  }
`;

export default NFTComponents;
