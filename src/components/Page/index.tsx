import React from 'react';
import styled from 'styled-components';

const Page: React.FC = ({ children }) => (
  <StyledWrapper>{children}</StyledWrapper>
);

const StyledWrapper = styled.div`
  width: 100%;
  max-width: 1480px;
  padding: 0 20px 200px;
  box-sizing: border-box;
  margin: 0 auto;
  flex: 1;
  @media screen and (max-width: 567px) {
    padding: 0 10px 80px;
  }
`;

export default Page;
