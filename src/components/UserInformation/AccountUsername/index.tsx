import React from 'react';
import styled from 'styled-components';
import { IconVerified } from '../../Icons';

export interface AccountUsernameProps {
  isVerified?: boolean;
}

const AccountUsername: React.FC<AccountUsernameProps> = ({
  children,
  isVerified = false,
}) => (
  <StyledContainer>
    <StyledUsername>@{children}</StyledUsername>
    {isVerified && (
      <StyledIcon>
        <IconVerified />
      </StyledIcon>
    )}
  </StyledContainer>
);

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const StyledUsername = styled.h4`
  font-size: 17px;
  font-weight: 400;
  text-transform: lowercase;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 0;
`;

const StyledIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-left: 5px;
`;

export default AccountUsername;
