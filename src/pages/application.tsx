import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import passed from '../assets/icons/passed.svg';
import { useLogin } from '../hooks/useLogin';
import { UserRole } from '../constant';
import { Button, message, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { useWallet } from 'use-wallet';
import { userIsBindMatataki, userUpgradeToArtist } from '../backend/user';

const Application: React.FC = () => {
  const { userDataByWallet } = useLogin();
  const router = useRouter();
  const wallet = useWallet();
  const [bindMatataki, setBindMatataki] = useState({
    isMatatakiBinded: false,
    isFanPiaoIssued: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  // 获取用户绑定状态
  const userIsBindMatatakiFn = useCallback(async (address: string) => {
    try {
      const res = await userIsBindMatataki(address);
      if (res.status === 200 && res.data.code === 200) {
        setBindMatataki(res.data.data);
      } else {
        throw new Error('fail');
      }
    } catch (e) {
      console.log('e', e);
      setBindMatataki({
        isMatatakiBinded: false,
        isFanPiaoIssued: false,
      });
    }
  }, []);

  // 成为艺术家
  const userUpgradeToArtistFn = useCallback(async () => {
    setLoading(true);

    try {
      const res = await userUpgradeToArtist();
      if (
        res.status === 201 &&
        res.data.code === 200 &&
        res.data.data.isAccountUpgraded
      ) {
        message.success('success');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (wallet.account) {
      userIsBindMatatakiFn(wallet.account);
    }
  }, [wallet, userIsBindMatatakiFn]);

  return (
    <StyledWrapper>
      <StyledTitle>申请成为艺术家</StyledTitle>
      <StyledItem>
        <StyledSubtitle>条件一</StyledSubtitle>
        <StyledUl>
          <li>
            登入钱包已经绑定 Matatkai 账号{' '}
            <a
              href={`${process.env.NEXT_PUBLIC_MATATAKI}/setting/account`}
              target='_blank'
              rel='noopener noreferrer'>
              立即绑定
            </a>{' '}
            {bindMatataki.isMatatakiBinded ? '✅' : '❌'}
          </li>
          <li>
            Matataki 账号已经发行过 Fan 票{' '}
            <a
              href={`${process.env.NEXT_PUBLIC_MATATAKI}/token`}
              target='_blank'
              rel='noopener noreferrer'>
              立即发行
            </a>{' '}
            {bindMatataki.isFanPiaoIssued ? '✅' : '❌'}
          </li>
          {userDataByWallet && userDataByWallet.role !== UserRole.Artist && (
            <Tooltip placement='top' title={'完成所有条件后'}>
              <Button loading={loading} onClick={userUpgradeToArtistFn}>
                成为艺术家
              </Button>
            </Tooltip>
          )}
        </StyledUl>
      </StyledItem>

      <StyledItem>
        <StyledSubtitle>条件二</StyledSubtitle>
        <StyledUl>
          <li>
            <a
              href={`${process.env.NEXT_PUBLIC_WJ}`}
              target='_blank'
              rel='noopener noreferrer'>
              填写表单
            </a>
          </li>
        </StyledUl>
      </StyledItem>
      {userDataByWallet && userDataByWallet.role === UserRole.Artist && (
        <>
          <StyledPassedImg src={passed} />
          <StyledPassedText>
            🎉🎉&nbsp;&nbsp;恭喜已经成为艺术家&nbsp;&nbsp;🎉🎉
          </StyledPassedText>
        </>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;
  padding: 40px 10px;
`;

const StyledTitle = styled.h1`
  text-align: center;
  font-size: 26px;
`;
const StyledSubtitle = styled.h2``;
const StyledItem = styled.div`
  max-width: 500px;
  margin: 20px auto;
`;
const StyledUl = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    font-size: 16px;
    margin: 10px 0;
    a {
      text-decoration: underline;
    }
  }
`;
const StyledPassedImg = styled.img`
  margin: 80px auto 40px;
  width: 500px;
  display: block;
  @media screen and (max-width: 576px) {
    width: 90%;
  }
`;
const StyledPassedText = styled.p`
  text-align: center;
  font-size: 14px;
  margin: 20px 0;
  padding: 0;
  color: #f28dfd;
`;

export default Application;
