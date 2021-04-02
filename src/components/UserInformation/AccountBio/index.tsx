import React from 'react';
import styled from 'styled-components';

const AccountBio: React.FC = ({ children }) => (
  <StyledBio>{children}</StyledBio>
);

const StyledBio = styled.h5`
  font-size: 17px;
  font-weight: 400;
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
  line-height: 25px;
  margin-bottom: 10px;
`;

export default AccountBio;
