import React from 'react';
import styled from 'styled-components';
import passed from '../assets/icons/passed.svg';
import { useLogin } from '../hooks/useLogin';
import { UserRole } from '../constant';

const Application: React.FC = () => {
  const { userDataByWallet } = useLogin();

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
            </a>
          </li>
          <li>
            Matataki 账号已经发行过 Fan 票{' '}
            <a
              href={`${process.env.NEXT_PUBLIC_MATATAKI}/token`}
              target='_blank'
              rel='noopener noreferrer'>
              立即发行
            </a>
          </li>
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
