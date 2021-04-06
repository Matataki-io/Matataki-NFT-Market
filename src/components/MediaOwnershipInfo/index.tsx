import React from 'react';
import styled from 'styled-components';
import UserLink, { UserLinkProps } from '../UserLink';

export interface MediaOwnership {
  creator?: Omit<UserLinkProps, 'label'>;
  owner?: Omit<UserLinkProps, 'label'>;
}

export interface MediaOwnershipInfoProps {
  info: MediaOwnership;
}

const MediaOwnershipInfo: React.FC<MediaOwnershipInfoProps> = ({ info }) => {
  const { creator, owner } = info;

  return (
    <Container>
      {creator && <UserLink {...creator} label='Creator' />}
      {owner && <UserLink {...owner} label='Owner' />}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

export default MediaOwnershipInfo;
