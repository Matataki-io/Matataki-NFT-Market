import React from 'react';
import { Menu, Dropdown, Avatar, message } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import styles from './index.module.scss';
import { ReactSVG } from 'react-svg';
import { useWallet } from 'use-wallet';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { removeCookie } from '../../utils/cookie';
import { useLogin } from '../../hooks/useLogin';

import IconShare from '../../assets/icons/share.svg';
import IconEmail from '../../assets/icons/email.svg';
import IconHelp from '../../assets/icons/help.svg';
import IconPlug from '../../assets/icons/plug.svg';

interface Props {
  children?: React.ReactNode;
}

const UserDropdown: React.FC<Props> = ({ children }) => {
  const wallet = useWallet();
  const router = useRouter();
  const { userDataByWallet } = useLogin();

  const disconnect = () => {
    removeCookie('token');
    wallet.reset();
  };

  const menu = () => {
    return (
      <Menu>
        <Menu.Item>
          <Link href={`/${userDataByWallet?.username}`}>
            <a>
              <StyledItem>
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  src={userDataByWallet?.avatar}
                />
                <StyledItemUser>
                  <div>{userDataByWallet?.username}</div>
                  <div>See Profile</div>
                </StyledItemUser>
              </StyledItem>
            </a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href={`${process.env.NEXT_PUBLIC_SCAN_PREFIX}/address/${wallet.account}`}>
            <StyledItem>
              <ReactSVG className='icon' src={IconShare} />
              View on Etherscan
            </StyledItem>
          </a>
        </Menu.Item>
        <Menu.Item>
          <CopyToClipboard
            text={`Invite a Creator：${window.location.href}`}
            onCopy={() => message.info('复制成功，立即分享！')}>
            <StyledItem>
              <ReactSVG className='icon' src={IconEmail} />
              Invite a Creator
            </StyledItem>
          </CopyToClipboard>
        </Menu.Item>
        <Menu.Item>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://matataki.io'>
            <StyledItem>
              <ReactSVG className='icon' src={IconHelp} />
              Help & Support
            </StyledItem>
          </a>
        </Menu.Item>
        {wallet.status === 'connected' ? (
          <Menu.Item>
            <StyledItem onClick={() => disconnect()}>
              <ReactSVG className='icon' src={IconPlug} />
              Disconnect Wallet
            </StyledItem>
          </Menu.Item>
        ) : null}
      </Menu>
    );
  };

  return (
    <Dropdown
      overlay={menu}
      overlayClassName={styles['user-dropdown']}
      trigger={['click']}>
      {children ? (
        children
      ) : (
        <a className='ant-dropdown-link' onClick={e => e.preventDefault()}>
          Hover me <DownOutlined />
        </a>
      )}
    </Dropdown>
  );
};

const StyledItem = styled.div`
  display: flex !important;
  align-items: center;
  color: #000 !important;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  padding: 20px 15px !important;
  margin: 0 !important;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  &:hover {
    background-color: rgb(230, 230, 230);
    border-top: 2px solid rgb(230, 230, 230);
  }
  .icon {
    width: 14px;
    height: 14px;
    margin-right: 10px;
    svg {
      font-size: 14px;
      color: #333333;
    }
  }
`;
const StyledItemUser = styled.div`
  margin-left: 15px;
  font-size: 14px;
  color: #000;
  line-height: 20px;
  & > div:last-child {
    color: rgba(0, 0, 0, 0.5);
  }
`;

export default UserDropdown;
