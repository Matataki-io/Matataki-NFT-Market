import { Avatar } from '@geist-ui/react';
import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { IconVerified } from '../Icons';

export interface UserLinkProps {
  label: string;
  avatar: string;
  username: string;
  isVerified?: boolean;
}

const UserLink: React.FC<UserLinkProps> = ({
  label,
  avatar,
  username,
  isVerified = false,
}) => {
  const router = useRouter();
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    router.push(`/${username}`);
  };

  return (
    <CreatorContainer onClick={handleClick}>
      <HeadLabel>{label}</HeadLabel>
      <UserInfo>
        <AccountAvatar src={avatar} size={30} />
        <UserName>@{username}</UserName>
        {isVerified && (
          <VerifiedIcon>
            <IconVerified />
          </VerifiedIcon>
        )}
      </UserInfo>
    </CreatorContainer>
  );
};

const UserName = styled.div`
  font-weight: 500;
  font-size: 16px;
`;

const CreatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: auto;
  flex: 1 0 auto;
  &:hover ${UserName} {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const HeadLabel = styled.label`
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  line-height: 20px;
  margin-bottom: 10px;
  display: block;
`;

const UserInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const AccountAvatar = styled(Avatar)`
  margin: 0px 10px 0px 0px !important;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 1px inset !important;
  border: none !important;
  background-color: #000000 !important;
`;

const VerifiedIcon = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  svg {
    padding: 4px;
  }
`;

export default UserLink;
