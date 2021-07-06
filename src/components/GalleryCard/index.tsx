import React from 'react';
import styled from 'styled-components';
import { Gallery } from '../../types/Gallery';

const GalleryCard: React.FC<Gallery> = ({ name, cover, intro, children }) => {
  return (
    <StyledWrapper>
      <StyledCover>
        {cover ? <img src={cover} alt='Image' /> : null}
      </StyledCover>
      <StyledTitle>{name}</StyledTitle>
      {intro && <Styleddescription>{intro}</Styleddescription>}
      {/* <StyledActions>{children}</StyledActions> */}
    </StyledWrapper>
  );
};
const StyledWrapper = styled.div``;
const StyledCover = styled.div`
  width: 100%;
  height: 192px;
  overflow: hidden;
  border: 1px solid rgb(0 0 0 / 5%);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const StyledTitle = styled.p`
  font-size: 24px;
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  color: #333333;
  line-height: 1.5;
  padding: 0;
  margin: 24px 0 16px;
  word-break: break-word;
  @media screen and (max-width: 576px) {
    font-size: 18px;
    margin: 10px 0;
  }
`;
const Styleddescription = styled.p`
  font-size: 14px;
  font-weight: 300;
  color: #777777;
  line-height: 20px;
  padding: 0;
  margin: 0;
  word-break: break-word;
`;
const StyledActions = styled.div`
  padding: 24px 0 16px;
`;
export default GalleryCard;
