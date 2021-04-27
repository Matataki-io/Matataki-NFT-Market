import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Avatar, message, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import { ReactSVG } from 'react-svg';
import {
  AccountName,
  AccountUsername,
  AccountBio,
  AccountWebsite,
} from '../../components/UserInformation';
import { UserInfoState } from '../../store/userInfoSlice';
import { useAppSelector } from '../../hooks/redux';
import { NFTProps } from '../../../next-env';
import NFTSimple from '../../components/NFTSimple';
import ProfileFeedPlaceholder from '../../components/ProfileFeedPlaceholder';

import { useLogin } from '../../hooks/useLogin';
import { getUser, getUserBids } from '../../backend/user';
import { getMediaById, getMediaMetadata } from '../../backend/media';
import { User } from '../../types/User.types';
import { BidLog } from '../../types/Bid.d';
import BidsCard from '../../components/BidsCard';
import BidsCancelModal from '../../components/BidsCancelModal';

import IconTelegram from '../../assets/icons/telegram.svg';
import IconTwitter from '../../assets/icons/twitter.svg';
import IconEmail from '../../assets/icons/email1.svg';

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

  return (
    <StyledWrapper>
      <StyledHead>
        <StyledHeadUser>
          <Avatar icon={<UserOutlined />} src={userInfo.avatar} size={66} />
          <StyledHeadUserInfo>
            <h1>
              {userInfo.nickname}({userInfo.username})
            </h1>
            <p>{userInfo.bio || 'Not...'}</p>
          </StyledHeadUserInfo>
        </StyledHeadUser>
        <div>
          <StyledHeadIcon>
            <ReactSVG className='icon' src={IconTelegram} />
            <ReactSVG className='icon' src={IconTwitter} />
            <ReactSVG className='icon' src={IconEmail} />
          </StyledHeadIcon>
          {isMyself ? (
            <Button onClick={() => router.push(`/${username}/edit/collector`)}>
              EDIT PROFILE
            </Button>
          ) : null}
        </div>
      </StyledHead>
      <StyledLine></StyledLine>
      <StyledMediaCardContainer>
        {nftListData.map((item, index) => (
          <Link href={`/p/${item.id}`} key={`media-card-${index}`}>
            <a target='_blank'>
              <NFTSimple {...item} />
            </a>
          </Link>
        ))}
      </StyledMediaCardContainer>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1480px;
  padding: 0 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;
const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  background: #dbdbdb;
`;
const StyledHead = styled.div`
  display: flex;
  align-items: cennter;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 48px 0;
`;
const StyledHeadUser = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;
const StyledHeadUserInfo = styled.div`
  margin: 0 0 0 15px;
  h1 {
    font-size: 34px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #333333;
    line-height: 1;
    padding: 0;
    margin: 0;
  }
  p {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 1.2;
    padding: 0;
    margin: 0;
  }
`;
const StyledHeadIcon = styled.div`
  display: flex;
  align-items: center;
  .icon {
    width: 32px;
    height: 32px;
    margin-left: 32px;
    &:nth-of-type(1) {
      margin-left: 0;
    }
    svg {
      font-size: 32px;
      color: #333333;
    }
  }
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
export default UserInfoPage;
