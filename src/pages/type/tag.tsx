import React from 'react';
import styled from 'styled-components';
import { Button, Checkbox } from 'antd';

const Market: React.FC = () => {
  return (
    <StyledWrapper>
      <StyledTitle>
        What kind of artworks do you like?<span>(Multiple selections)</span>
      </StyledTitle>
      <StyledCheckbox>
        <StyledCheckboxItem>
          <Checkbox>Sculpture</Checkbox>
        </StyledCheckboxItem>
        <StyledCheckboxItem>
          <Checkbox>Classic art</Checkbox>
        </StyledCheckboxItem>
        <StyledCheckboxItem>
          <Checkbox>Digital art</Checkbox>
        </StyledCheckboxItem>
        <StyledCheckboxItem>
          <Checkbox>Comic</Checkbox>
        </StyledCheckboxItem>
        <StyledCheckboxItem>
          <Checkbox>Graphic design</Checkbox>
        </StyledCheckboxItem>
        <StyledCheckboxItem>
          <Checkbox>Manga</Checkbox>
        </StyledCheckboxItem>
        <StyledCheckboxItem>
          <Checkbox>Illustration</Checkbox>
        </StyledCheckboxItem>
        <StyledCheckboxItem>
          <Checkbox>User Interface</Checkbox>
        </StyledCheckboxItem>
        <StyledCheckboxItem>
          <Checkbox>Installation art</Checkbox>
        </StyledCheckboxItem>
      </StyledCheckbox>
      <StyledButtonWrapper>
        <StyledButton className='black'>NEXT</StyledButton>
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

const StyledCheckbox = styled.div`
  margin-top: 60px;
  display: flex;
  flex-wrap: wrap;
`;
const StyledCheckboxItem = styled.div`
  margin-right: 66px;
  margin-bottom: 50px;
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
