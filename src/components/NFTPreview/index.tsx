import React from 'react';
import styled from 'styled-components';

import { Button } from 'antd';
import AudioRender from '../AudioRender';

interface Props {
  src: string;
  type: string;
}

const NFTPreview: React.FC<Props> = ({ src, type }) => {
  return (
    // 暂时只支持Image
    <StyledWrapper>
      {src ? (
        type === 'image' ? (
          <img src={src} className='image' alt='Image' />
        ) : type === 'video' ? (
          <video
            src={src}
            loop
            playsInline
            // autoPlay
            className='video'></video>
        ) : type === 'audio' ? (
          <AudioRender src={src} mode='all'></AudioRender>
        ) : type === 'text' ? (
          <a href={src} target='_blank' rel='noreferrer'>
            <Button style={{ margin: '40px 0' }}>Text View</Button>
          </a>
        ) : type === 'file' ? (
          <a href={src} target='_blank' rel='noreferrer'>
            <Button style={{ margin: '40px 0' }}>File View</Button>
          </a>
        ) : type === 'url' ? (
          <a href={src} target='_blank' rel='noreferrer'>
            <Button style={{ margin: '40px 0' }}>Url View</Button>
          </a>
        ) : null
      ) : null}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: block;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  width: 100%;
  height: 100%;
  max-width: 700px;
  max-height: 700px;
  .image,
  .video {
    box-sizing: border-box;
    padding: 0px;
    border: none;
    margin: auto;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: scale-down;
  }
`;

export default NFTPreview;
