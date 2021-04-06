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

const UserInfoPage: React.FC = () => {
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

  useEffect(() => {
    if (appUserInfo.username === username) {
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
          type: 'image', // type is image video audio text file url
          content: {
            low: 'https://placeimg.com/700/340/arch',
            medium: 'https://placeimg.com/700/340/arch',
            high: 'https://placeimg.com/700/340/arch',
            thumbnail: 'https://placeimg.com/700/340/arch',
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
          id: 1065,
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
  }, [appUserInfo, username]);

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
            {isMyself && <EditProfileButton />}
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

export default UserInfoPage;
