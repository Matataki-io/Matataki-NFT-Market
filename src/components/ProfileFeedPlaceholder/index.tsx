import React from 'react';
import styled from 'styled-components';

export interface ProfileFeedPlaceholderProps {
  isLoggedIn?: boolean;
}

const ProfileFeedPlaceholder: React.FC<ProfileFeedPlaceholderProps> = ({
  isLoggedIn = false,
}) => {
  return (
    <StyledPostContainer>
      <CopyContainer>
        <MaxWidth>
          <Flex>
            <ComingSoonCopy>
              {isLoggedIn
                ? 'Your profile is empty. Create or buy something and it’ll be shown here.'
                : 'Coming soon.'}
            </ComingSoonCopy>
            {isLoggedIn && <StyledButton>Create</StyledButton>}
          </Flex>
        </MaxWidth>
      </CopyContainer>
      <PlaceholderPost />
      <PlaceholderPost />
    </StyledPostContainer>
  );
};

const StyledPostContainer = styled.div`
  width: 100%;
  height: 30%;
  max-height: 350px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  bottom: 0px;
  left: 0px;
  right: 0px;
  box-sizing: border-box;
  padding: 30px;
  margin: 0px auto;
  max-width: calc(1030px);
`;

const CopyContainer = styled.div`
  left: 0px;
  right: 0px;
  position: absolute;
`;

const MaxWidth = styled.div`
  box-sizing: border-box;
  padding: 30px;
  margin: 0px auto;
  width: 100%;
  max-width: calc(480px);
`;

const Flex = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  align-items: center;
`;

const ComingSoonCopy = styled.h5`
  text-align: center;
  line-height: 27px;
  margin-bottom: 30px;
  font-size: 17px;
  font-weight: 400;
  margin-top: 0px;
`;

const PlaceholderPost = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  flex: 1 1 auto;
  height: 450px;
  max-width: 450px;

  &:last-child {
    margin-left: 15px;
  }
`;

const StyledButton = styled.button`
  margin-right: 0px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 20px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  appearance: none;
  color: rgb(255, 255, 255);
  background: rgb(0, 0, 0);
  border: 2px solid transparent;

  &:hover {
    background: rgb(64, 64, 64);
  }
`;

export default ProfileFeedPlaceholder;
