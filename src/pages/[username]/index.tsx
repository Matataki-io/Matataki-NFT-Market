import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Avatar } from '@geist-ui/react'
import Page from '../../components/Page'
import { AccountName, AccountUsername, AccountBio, AccountWebsite } from '../../components/UserInformation'
import { UserInfoState } from '../../store/userInfoSlice'
import { useAppSelector } from '../../hooks/redux'

const Post: React.FC = () => {
  const router = useRouter()
  const { username } = router.query
  const [userInfo, setUserInfo] = useState<UserInfoState>({
    avatar: '',
    nickname: '',
    username: '',
  })
  const [isVerifiedUser, setIsVerifiedUser] = useState(false)
  const [isMyself, setIsMyself] = useState(false)
  const appUserInfo = useAppSelector((state) => state.userInfo)

  useEffect(() => {
    if (appUserInfo.username === username) {
      setUserInfo(appUserInfo)
      setIsMyself(true)
    } else {
      const exampleUserInfo: UserInfoState = {
        avatar: 'https://ipfs.fleek.co/ipfs/bafybeihj36tzvur2ozmunei5k32mumaonibgsnhorhus3mjsg2xki7k3pu',
        introduction: 'Visual Artist + Filmmaker. I use my influences of Sci-Fi, Graphic Novels, Anime, and Hip Hop to create pieces that transports you into my abstract universe.',
        nickname: 'Jah.',
        username: 'jah',
        website: 'https://www.byjah.art/'
      }
      setUserInfo(exampleUserInfo)
      setIsVerifiedUser(true)
    }
  }, [appUserInfo, username])

  return (
    <Page>
      <StyledWrapper>
        <StyledAvatar src={userInfo.avatar} size={120} />
        <StyledInfoBox>
          <StyledInfo>
            <AccountName>{userInfo.nickname}</AccountName>
            <AccountUsername isVerified={isVerifiedUser}>{userInfo.username}</AccountUsername>
            {userInfo.introduction && <AccountBio>{userInfo.introduction}</AccountBio>}
            {userInfo.website && <AccountWebsite href={userInfo.website} />}
            {isMyself && (
              <p>Hello Myself</p>
            )}
          </StyledInfo>
        </StyledInfoBox>
      </StyledWrapper>
    </Page>
  )
}

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 40px;
`

const StyledAvatar = styled(Avatar)`
  margin-bottom: 50px;
`

const StyledInfoBox = styled.div`
  box-sizing: border-box;
  padding: 30px;
  margin: 0px auto;
  width: 100%;
  max-width: calc(530px);
`

const StyledInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

export default Post
