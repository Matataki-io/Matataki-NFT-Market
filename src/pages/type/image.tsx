import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Checkbox } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const like = [
  {
    img: 'https://placeimg.com/340/340/arch?t=1617248569810',
    text: 'AAAAAA',
    checked: false,
  },
  {
    img: 'https://placeimg.com/340/340/arch?t=1617248569810',
    text: 'AAAAAA',
    checked: false,
  },
  {
    img: 'https://placeimg.com/340/340/arch?t=1617248569810',
    text: 'AAAAAA',
    checked: false,
  },
  {
    img: 'https://placeimg.com/340/340/arch?t=1617248569810',
    text: 'AAAAAA',
    checked: false,
  },
  {
    img: 'https://placeimg.com/340/340/arch?t=1617248569810',
    text: 'AAAAAA',
    checked: false,
  },
  {
    img: 'https://placeimg.com/340/340/arch?t=1617248569810',
    text: 'AAAAAA',
    checked: false,
  },
  {
    img: 'https://placeimg.com/340/340/arch?t=1617248569810',
    text: 'AAAAAA',
    checked: false,
  },
  {
    img: 'https://placeimg.com/340/340/arch?t=1617248569810',
    text: 'AAAAAA',
    checked: false,
  },
  {
    img: 'https://placeimg.com/340/340/arch?t=1617248569810',
    text: 'AAAAAA',
    checked: false,
  },
];

const Market: React.FC = () => {
  const [likeType, setLikeType] = useState(like);

  useEffect(() => {
    let list = like.slice();
    setLikeType(list);
  }, []);

  const toggleCheckbox = (idx: number) => {
    let list = likeType.slice();
    list[idx].checked = !list[idx].checked;
    setLikeType(list);
  };

  return (
    <StyledWrapper>
      <StyledTitle>
        What kind of artworks do you like?<span>(Multiple selections)</span>
      </StyledTitle>
      <StyledItemWrapper>
        {likeType.map((i, idx) => (
          <StyledItem key={idx} onClick={() => toggleCheckbox(idx)}>
            <div className='cover'>
              <img src={i.img} alt='Image' />
            </div>
            <div className='text'>
              <p>{i.text}</p>
            </div>
            <StyledItemCheckbox checked={i.checked}></StyledItemCheckbox>
          </StyledItem>
        ))}
      </StyledItemWrapper>
      <StyledButtonWrapper>
        <StyledButton className='black'>
          SAVE & GO
          <ArrowRightOutlined />
        </StyledButton>
      </StyledButtonWrapper>
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
const StyledTitle = styled.h1`
  font-size: 48px;
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  color: #333333;
  line-height: 58px;
  padding: 0;
  margin: 0;
  text-align: center;
  span {
    color: #b2b2b2;
  }
`;
const StyledItemWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0px, 1fr));
  grid-row-gap: 24px;
  grid-column-gap: 24px;
  margin-top: 48px;
`;
const StyledItem = styled.div`
  position: relative;
  cursor: pointer;
  .cover {
    width: 100%;
    height: 100%;
    z-index: 1;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .text {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    p {
      color: #fff;
      font-size: 26px;
      font-weight: 400;
    }
  }
`;
const StyledItemCheckbox = styled(Checkbox)`
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 3;
`;
const StyledButtonWrapper = styled.div`
  text-align: right;
  margin-top: 200px;
`;
const StyledButton = styled(Button)`
  width: 240px;
  height: 60px;
  border: 2px solid #333333;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
  margin-bottom: 16px;
  &.black {
    background: #333333;
    color: #ffffff;
    &:hover {
      color: #ffffff;
    }
  }
  &:hover {
    color: #333333;
    border-color: #333333;
  }
  &.ant-btn:hover,
  &.ant-btn:focus {
    border-color: #333333;
  }
`;
export default Market;
