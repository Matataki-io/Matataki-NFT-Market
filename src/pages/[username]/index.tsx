import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import Page from '../../components/Page';
import {
  AccountName,
  AccountUsername,
  AccountBio,
  AccountWebsite,
} from '../../components/UserInformation';
import { UserInfoState } from '../../store/userInfoSlice';
import { useAppSelector } from '../../hooks/redux';
import { NFTProps } from '../../../next-env';
import { default as MediaCard } from '../../components/NFT';
import ProfileFeedPlaceholder from '../../components/ProfileFeedPlaceholder';

import { useLogin } from '../../hooks/useLogin';
import { getUser, getUserBids } from '../../backend/user';
import { getMediaById, getMediaMetadata } from '../../backend/media';
import { User } from '../../types/User.types';
import { BidLog } from '../../types/Bid.d';
import BidsCard from '../../components/BidsCard';
import BidsCancelModal from '../../components/BidsCancelModal';

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
  const [switchFeedOrBids, setSwitchFeedOrBids] = useState<'feed' | 'bids'>(
    'feed'
  );
  const [bidsList, setBidsList] = useState<Array<BidLog>>([]);
  const { userDataByWallet } = useLogin();
  // show bid cancel modal
  const [isModalVisibleBidsCancel, setIsModalVisibleBidsCancel] = useState(
    false
  );
  // click bid idx
  const [currentBidsIdx, setCurrentBidsIdx] = useState<number>(0);
  const keyMessage = 'fetchUser';

  useEffect(() => {
    const fetchUserInfoData = async () => {
      if (typeof username !== 'string') return;
      try {
        const userInfo = await getUser(username as string);
        console.log('userInfo', userInfo);
        if (userDataByWallet && userDataByWallet.username === username) {
          setIsMyself(true);
        }
        setUserInfo(userInfo);
        setIsVerifiedUser(false);
        return userInfo;
      } catch (e) {
        let err = e.toString();
        console.log('e', e.toString());

        if (err.includes('status code 404')) {
          message.destroy(keyMessage);
          message.error({ content: 'No such user！', key: keyMessage });
          router.push('/');
        }

        setIsVerifiedUser(false);
        return;
      }
    };

    const fetchNFTListData = async (userInfo: User) => {
      const uniNftId = new Set<number>();
      if (userInfo.createdMedia) {
        userInfo.createdMedia.map(item => uniNftId.add(item));
      }
      if (userInfo.ownedMedia) {
        userInfo.ownedMedia.map(item => uniNftId.add(item));
      }
      const getUserMediaList = Array.from(uniNftId).map(async id => {
        const media = await getMediaById(id);
        return media;
      });
      const userMediaList = await Promise.all(getUserMediaList);
      const getUserNftList: Promise<NFTProps>[] = userMediaList.map(
        async media => {
          const metadata = await getMediaMetadata(media.metadataURI);
          return {
            id: media.id,
            type: metadata.mimeType.split('/')[0],
            title: metadata.name,
            fields: {
              low: { stringValue: media.tokenURI },
              stream: { stringValue: media.tokenURI },
              medium: { stringValue: media.tokenURI },
              high: { stringValue: media.tokenURI },
              thumbnail: { stringValue: media.tokenURI },
            },
            content: {
              low: media.tokenURI,
              stream: media.tokenURI,
              medium: media.tokenURI,
              high: media.tokenURI,
              thumbnail: media.tokenURI,
            },
            owner: media.owner,
            creator: media.creator,
          };
        }
      );
      const userNftList = await Promise.all(getUserNftList);
      setNFTListData(userNftList || []);
    };

    const fetchAll = async () => {
      const userInfo = await fetchUserInfoData();
      if (!isEmpty(userInfo)) {
        await fetchNFTListData(userInfo!);
      }
    };

    fetchAll();
  }, [appUserInfo, userDataByWallet, username]);
  // get user bids list
  useEffect(() => {
    if (typeof username !== 'string') return;

    const fetch = async () => {
      try {
        const data = await getUserBids(username);
        setBidsList(data);
        // console.log('data', data);
      } catch (e) {
        console.error('e', e.toString());
      }
    };

    if (switchFeedOrBids === 'bids') {
      fetch();
    }
  }, [switchFeedOrBids, username]);

  // switch feed or bids
  const SwitchFeedOrBids = () => {
    return (
      <StyledSwitchWrapper>
        <StyledSwitchButton
          active={switchFeedOrBids === 'feed'}
          onClick={() => setSwitchFeedOrBids('feed')}>
          Feed
        </StyledSwitchButton>
        <StyledSwitchButton
          active={switchFeedOrBids === 'bids'}
          onClick={() => setSwitchFeedOrBids('bids')}>
          Bids
        </StyledSwitchButton>
      </StyledSwitchWrapper>
    );
  };

  // show bid cancel modal fn
  const showBidCancelModal = (idx: number) => {
    setCurrentBidsIdx(idx);
    setIsModalVisibleBidsCancel(true);
  };
  // return show cancel modal data
  const currentBids: BidLog = useMemo(() => {
    if (bidsList.length) {
      return bidsList[currentBidsIdx];
    }
    return {} as any;
  }, [currentBidsIdx, bidsList]);

  return (
    <Page>
      <StyledWrapper>
        <StyledAvatar
          icon={<UserOutlined />}
          src={userInfo.avatar}
          size={120}
        />
        <StyledInfoBox>
          <StyledInfo>
            <AccountName>{userInfo.nickname}</AccountName>
            <AccountUsername isVerified={isVerifiedUser}>
              {userInfo.username}
            </AccountUsername>
            {userInfo.bio && <AccountBio>{userInfo.bio}</AccountBio>}
            {userInfo.website && <AccountWebsite href={userInfo.website} />}
            {isMyself && (
              <StyledEditButton onClick={() => setIsProfile(true)}>
                Edit profile
              </StyledEditButton>
            )}
            <SwitchFeedOrBids></SwitchFeedOrBids>
          </StyledInfo>
        </StyledInfoBox>
        {switchFeedOrBids === 'feed' ? (
          <>
            {nftListData.length ? (
              <StyledMediaCardContainer>
                {nftListData.map((item, index) => (
                  <Link href={`/p/${item.id}`} key={`media-card-${index}`}>
                    <a target='_blank'>
                      <MediaCard {...item} />
                    </a>
                  </Link>
                ))}
              </StyledMediaCardContainer>
            ) : (
              <ProfileFeedPlaceholder
                setIsProfile={setIsProfile}
                isLoggedIn={isMyself}
              />
            )}
          </>
        ) : switchFeedOrBids === 'bids' ? (
          <StyledBidsContainer>
            <>
              {bidsList.map((i, idx) => (
                <BidsCard
                  showBidCancelModal={showBidCancelModal}
                  idx={idx}
                  {...i}
                  key={idx}></BidsCard>
              ))}
              <BidsCancelModal
                currentBids={currentBids}
                isModalVisibleBidsCancel={isModalVisibleBidsCancel}
                setIsModalVisibleBidsCancel={
                  setIsModalVisibleBidsCancel
                }></BidsCancelModal>
            </>
          </StyledBidsContainer>
        ) : null}
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
  justify-content: center;
  gap: 30px 20px;
  margin: 48px auto 0;
  grid-template-columns: repeat(4, minmax(0px, 330px));
  @media screen and (max-width: 1366px) {
    grid-template-columns: repeat(3, minmax(0px, 330px));
  }
  @media screen and (max-width: 1140px) {
    grid-template-columns: repeat(2, minmax(0px, 330px));
  }
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
const StyledBidsContainer = styled.div`
  width: 100%;
  max-width: 680px;
  padding: 0 20px;
  box-sizing: border-box;
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

const StyledSwitchWrapper = styled.div`
  margin: 60px auto 0;
`;
const StyledSwitchButton = styled.button<{ active: boolean }>`
  border: 2px solid #000;
  color: ${({ active }) => (active ? '#fff' : '#000')};
  outline: none;
  padding: 10px 14px;
  font-size: 16px;
  background: ${({ active }) => (active ? '#000' : '#fff')};
  cursor: pointer;
  transition: all 0.2s;
`;
export default UserInfoPage;
