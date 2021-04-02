import React from 'react';
import styled from 'styled-components';

export interface MediaViewerProps {
  /** @description 只有 type = image 实现了 */
  type: 'image' | 'video' | 'audio' | 'file';
  src: string;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ src, type }) => {
  return (
    <StyledMediaViewer>
      {type === 'image' && (
        <StyledMediaRendererImage src={src} alt='media-image' />
      )}
    </StyledMediaViewer>
  );
};

const StyledMediaViewer = styled.div`
  height: 100%;
  min-height: 400px;
  position: relative;
  border: 2px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledMediaRendererImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  margin: 0px auto;
  object-fit: contain;
`;

export default MediaViewer;
