import React from 'react';
import styled from 'styled-components';
import { Button, Checkbox } from '@geist-ui/react';

const Market: React.FC = () => {
  return (
    <StyledWrapper>
      <h1>
        What kind of artworks do you like?<span>(Multiple selections)</span>
      </h1>
      <StyledItem>
        <div>
          <Checkbox>Sculpture</Checkbox>
        </div>
        <div>
          <Checkbox>Classic art</Checkbox>
        </div>
        <div>
          <Checkbox>Digital art</Checkbox>
        </div>
        <div>
          <Checkbox>Comic</Checkbox>
        </div>
        <div>
          <Checkbox>Graphic design</Checkbox>
        </div>
        <div>
          <Checkbox>Manga</Checkbox>
        </div>
        <div>
          <Checkbox>Illustration</Checkbox>
        </div>
        <div>
          <Checkbox>User Interface</Checkbox>
        </div>
        <div>
          <Checkbox>Installation art</Checkbox>
        </div>
      </StyledItem>
      <div>
        <Button>NEXT</Button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1114px;
  padding: 0 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const StyledItem = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0px, 1fr));
`;
export default Market;
