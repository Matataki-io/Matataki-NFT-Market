import React from 'react';
import styled from 'styled-components';
import { ReactSVG } from 'react-svg';
// import { Button, Tooltip } from 'antd';
import Link from 'next/link';

import IconGithub from '../../assets/icons/github.svg';
import IconTelegram from '../../assets/icons/telegram.svg';
import IconDiscord from '../../assets/icons/discord.svg';
import IconTwitter from '../../assets/icons/twitter.svg';

import logoMtk from '../../assets/images/logo-mtk.png';

const StyledFooter = styled.div`
  background: #f1f1f1;
`;
const StyledFooterWrapper = styled.div`
  width: 100%;
  max-width: 1480px;
  padding: 48px 20px 24px;
  box-sizing: border-box;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;
const StyledFooterItem = styled.div`
  &.item-social {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
  }
  &.item-rights {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 56px;
    .rights {
      font-size: 14px;
      font-weight: 400;
      color: #777777;
      line-height: 20px;
    }
    .language {
      font-size: 14px;
      font-weight: 400;
      color: #777777;
      line-height: 20px;
    }
  }
`;
const StyledFooterNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  ul {
    padding: 0;
    margin: 0 160px 0 0;
    list-style: none;
    &:nth-last-of-type(1) {
      margin-right: 0;
    }
    li {
      margin-bottom: 16px;
      &::before {
        display: none;
      }
      h3 {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
      }
      a {
        font-size: 14px;
        font-weight: 400;
        color: #777777;
        line-height: 20px;
      }
    }
  }
`;

const StyledFooterSocial = styled.div`
  display: flex;
  align-items: center;
  & > a {
    margin-left: 48px;
    &:nth-of-type(1) {
      margin-left: 0;
    }
  }
  .img {
    width: 32px;
    height: 32px;
  }
  .icon {
    width: 32px;
    height: 32px;
    svg {
      font-size: 32px;
      color: #333333;
    }
  }
`;

export default function Footer() {
  return (
    <StyledFooter>
      <StyledFooterWrapper>
        <StyledFooterItem className='item-social'>
          <StyledFooterNav>
            <ul>
              <li>
                <Link href='/application'>
                  <a>Be creator</a>
                </Link>
              </li>
            </ul>
          </StyledFooterNav>
          <StyledFooterSocial>
            {/* <ReactSVG className='icon' src={IconGithub} /> */}
            <a
              href={process.env.NEXT_PUBLIC_MATATAKI}
              target='_blank'
              rel='noopener noreferrer'>
              <img className='img' src={logoMtk}></img>
            </a>
            <a
              href='https://t.me/smartsignature_io'
              target='_blank'
              rel='noopener noreferrer'>
              <ReactSVG className='icon' src={IconTelegram} />
            </a>
            <a
              href='https://twitter.com/realmatataki'
              target='_blank'
              rel='noopener noreferrer'>
              <ReactSVG className='icon' src={IconTwitter} />
            </a>
            {/* <ReactSVG className='icon' src={IconDiscord} /> */}
          </StyledFooterSocial>
        </StyledFooterItem>
        <StyledFooterItem className='item-rights'>
          <span className='rights'>
            © 2021 {process.env.NEXT_PUBLIC_APP_NAME} All Rights Reserved{' '}
          </span>
          <div className='i18n-switch'>
            {/* <Tooltip
              color='#fff'
              title={
                <>
                  <div style={{ display: 'flex' }}>
                    <Button size='small'>中文</Button>
                    <Button size='small'>日本语</Button>
                    <Button size='small'>English</Button>
                  </div>
                </>
              }>
              <span className='language'>English</span>
            </Tooltip> */}
          </div>
        </StyledFooterItem>
      </StyledFooterWrapper>
    </StyledFooter>
  );
}
