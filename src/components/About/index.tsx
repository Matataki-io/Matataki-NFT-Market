import React from 'react';
import styled from 'styled-components';

const StyledAboutComponents = styled.a`
  .cover {
    width: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  p {
    font-size: 20px;
    font-family: bigCaslonMedium, BigCaslon-Medium, BigCaslon,
      'Playfair Display', serif;
    font-weight: 500;
    color: #333333;
    line-height: 1.5;
    padding: 0;
    margin: 16px 0 0 0;
    @media screen and (max-width: 576px) {
      font-size: 14px;
      margin: 10px 0 0 0;
    }
  }
`;

interface AboutProps {
  img: string;
  text: string;
  link: string;
}

const AboutComponents: React.FC<AboutProps> = ({ img, text, link }) => {
  return (
    <StyledAboutComponents target='_blank' href={link}>
      <div className='cover'>
        <img src={img} alt='About' />
      </div>
      <p>{text}</p>
    </StyledAboutComponents>
  );
};
export default AboutComponents;
