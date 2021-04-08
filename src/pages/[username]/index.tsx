import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Avatar } from '@geist-ui/react';
import Page from '../../components/Page';
import {
  AccountName,
  AccountUsername,
  AccountBio,
  AccountWebsite,
  EditProfileButton,
} from '../../components/UserInformation';
import { UserInfoState } from '../../store/userInfoSlice';
import { useAppSelector } from '../../hooks/redux';
import { NFTProps } from '../../../next-env';
import { default as MediaCard } from '../../components/NFT';
import ProfileFeedPlaceholder from '../../components/ProfileFeedPlaceholder';

import { useLogin } from '../../hooks/useLogin';

interface Props {
  setIsProfile: (value: boolean) => void;
}

const UserInfoPage: React.FC<Props> = ({ setIsProfile }) => {
  const router = useRouter();
  const { username } = router.query;
  const [userInfo, setUserInfo] = useState<UserInfoState>({
    avatar: '',
    nickname: '',
    username: '',
  });
  const [isVerifiedUser, setIsVerifiedUser] = useState(false);
  const [isMyself, setIsMyself] = useState(false);
  const appUserInfo = useAppSelector(state => state.userInfo);
  const [nftListData, setNFTListData] = useState<Array<NFTProps>>([]);

  const { isRegistered, userDataByWallet } = useLogin();

  useEffect(() => {
    if (userDataByWallet && userDataByWallet.username === username) {
      setUserInfo(appUserInfo);
      setIsMyself(true);
      setNFTListData([]);
    } else {
      const exampleUserInfo: UserInfoState = {
        avatar:
          'https://ipfs.fleek.co/ipfs/bafybeihj36tzvur2ozmunei5k32mumaonibgsnhorhus3mjsg2xki7k3pu',
        introduction:
          'Visual Artist + Filmmaker. I use my influences of Sci-Fi, Graphic Novels, Anime, and Hip Hop to create pieces that transports you into my abstract universe.',
        nickname: 'Jah.',
        username: 'jah',
        website: 'https://www.byjah.art/',
      };
      const exampleNFTListData: Array<NFTProps> = [
        {
          id: 2020,
          type: 'image',
          content: {
            low:
              'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
            medium:
              'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
            high:
              'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
            thumbnail:
              'https://ipfs.fleek.co/ipfs/bafybeied6bdcpljxzhhlph6hb4pjunsmhfaxh5siiqxgonpbkkwhyjqoli',
            stream: '',
          },
          avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
          username: '@subtle-bubble',
          title: 'Scream Alone',
          time: Date.now(),
        },
        {
          id: 2024,
          type: 'image',
          content: {
            low:
              'https://ipfs.fleek.co/ipfs/bafybeifwauzh4mtqunlj2mnj3fusfod2kdq7rjf4y6epai7faahsc6gl6a',
            medium:
              'https://ipfs.fleek.co/ipfs/bafybeifwauzh4mtqunlj2mnj3fusfod2kdq7rjf4y6epai7faahsc6gl6a',
            high:
              'https://ipfs.fleek.co/ipfs/bafybeifwauzh4mtqunlj2mnj3fusfod2kdq7rjf4y6epai7faahsc6gl6a',
            thumbnail:
              'https://ipfs.fleek.co/ipfs/bafybeifwauzh4mtqunlj2mnj3fusfod2kdq7rjf4y6epai7faahsc6gl6a',
            stream: '',
          },
          avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
          username: '@subtle-bubble',
          title: 'Scream Alone',
          time: Date.now(),
        },
        {
          id: 2025,
          type: 'image',
          content: {
            low:
              'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
            medium:
              'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
            high:
              'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
            thumbnail:
              'https://ipfs.fleek.co/ipfs/bafybeiahiogjgcijj2vqvvt6w2lhmxwxmhv5ignexrus76w62foc4uqzw4',
            stream: '',
          },
          avatar_url: 'https://react.geist-ui.dev/images/avatar.png',
          username: '@subtle-bubble',
          title: 'Scream Alone',
          time: Date.now(),
        },
      ];
      setUserInfo(exampleUserInfo);
      setIsVerifiedUser(true);
      setNFTListData(exampleNFTListData);
    }
  }, [appUserInfo, username, isRegistered, userDataByWallet]);

  return (
    <Page>
      <StyledWrapper>
        <StyledAvatar src={userInfo.avatar} size={120} />
        <StyledInfoBox>
          <StyledInfo>
            <AccountName>{userInfo.nickname}</AccountName>
            <AccountUsername isVerified={isVerifiedUser}>
              {userInfo.username}
            </AccountUsername>
            {userInfo.introduction && (
              <AccountBio>{userInfo.introduction}</AccountBio>
            )}
            {userInfo.website && <AccountWebsite href={userInfo.website} />}
            {isMyself && (
              <StyledEditButton onClick={() => setIsProfile(true)}>
                Edit profile
              </StyledEditButton>
            )}
          </StyledInfo>
        </StyledInfoBox>
        {nftListData.length ? (
          <StyledMediaCardContainer>
            {nftListData.map((item, index) => (
              <MediaCard {...item} key={`media-card-${index}`} />
            ))}
          </StyledMediaCardContainer>
        ) : (
          <ProfileFeedPlaceholder
            isLoggedIn={appUserInfo.username === username}
          />
        )}
      </StyledWrapper>
    </Page>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 40px;
`;

const StyledAvatar = styled(Avatar)`
  margin-bottom: 50px;
`;

const StyledInfoBox = styled.div`
  box-sizing: border-box;
  padding: 30px;
  margin: 0px auto;
  width: 100%;
  max-width: calc(530px);
`;

const StyledInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const StyledMediaCardContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0px, 1fr));
  gap: 50px 30px;
`;
// from EditProfileButton Copy
const StyledEditButton = styled.button`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 20px;
  margin: 0px 5px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  appearance: none;
  color: rgb(0, 0, 0);
  background-color: rgb(230, 230, 230);
  border: 1px solid transparent;
  &:hover {
    background-color: rgb(230, 230, 230);
    border-color: rgb(0, 0, 0);
  }
`;

export default UserInfoPage;
