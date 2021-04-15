import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
export default function Custom404() {
  return (
    <StyledWrapper>
      <h1>404 - Page Not Found</h1>
      <Link href={'/'}>
        <a>Back Home Page</a>
      </Link>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 900px;
  min-height: 300px;
  margin: 0 auto;
  padding: 100px 0 0;
  text-align: center;
  flex: 1;
`;
