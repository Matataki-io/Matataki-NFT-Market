import React, { useState, useMemo, Fragment, useEffect } from 'react';
import { useMount } from 'ahooks';
import { Input } from '@geist-ui/react';
import Link from 'next/link';
import styled from 'styled-components';
import Logo from '../../assets/images/logo.png';
import Button from '../Button/index';
import { useWallet } from 'use-wallet';
import UserDropdown from '../UserDropdown';
import { useLogin } from '../../hooks/useLogin';
import { currentChainId } from '../../constant';

interface HeaderProps {
  isCreate: boolean;
  setIsCreate: (value: boolean) => void;
  setIsProfile: (value: boolean) => void;
}

const HeaderComponents: React.FC<HeaderProps> = ({
  isCreate,
  setIsCreate,
  setIsProfile,
}) => {
  const wallet = useWallet();
  const shortedWalletAccount = useMemo(() => {
    if (wallet.status !== 'connected') return 'Not Connected';
    return wallet.account?.slice(0, 6) + '...' + wallet.account?.slice(-4);
  }, [wallet]);
  const {
    isRegistered,
    registeredLoading,
    userDataByWallet,
    loginWithSignature,
  } = useLogin();
  const [networkVersion, setNetworkVersion] = useState<string>('');
  const [connect, setConnect] = useState<boolean>(false);

  // TODO: 这里可能要改 暂时用来显示 network error
  useMount(() => {
    if (process.browser) {
      let network = (window as any).ethereum.networkVersion;
      console.log('network', network);
      if (network) {
        setNetworkVersion(network);
      }
    }
  });

  // 链接钱包，并且没有注册显示信息框
  useEffect(() => {
    if (connect && wallet.status === 'connected') {
      // 如果正在查询数据停止
      if (registeredLoading) return;
      // 查询完是否注册
      if (isRegistered) {
        setIsProfile(false);
        loginWithSignature();
      } else {
        setIsProfile(true);
      }
      setConnect(false);
    }
  }, [
    wallet.status,
    isRegistered,
    setIsProfile,
    loginWithSignature,
    registeredLoading,
    connect,
  ]);

  // 链接钱包
  const connectWallet = () => {
    wallet.connect('injected');
    setConnect(true);
  };

  return (
    <StyledHeader>
      <StyledHeaderWrapper>
        {isCreate ? (
          <Fragment>
            <Button color='gray' onClick={() => setIsCreate(false)}>
              Back
            </Button>
            <div>
              <a href='https://matataki.io/'>
                <Button className='hover-underline'>Learn</Button>
              </a>
              <Button color='gray'>{shortedWalletAccount}</Button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <StyledHeaderLeft>
              <Link href='/'>
                <StyledHeaderLogo>
                  <img src={Logo} alt='NFT Logo' />
                  <h1>NFT Market</h1>
                </StyledHeaderLogo>
              </Link>
              {/* <StyledHeaderNav>
									<Link href="/">
										<a>NFTS</a>
									</Link>
									<Link href="/">
										<a>CREATE NFT</a>
									</Link>
								</StyledHeaderNav> */}
            </StyledHeaderLeft>
            <StyledHeaderContainer>
              <StyledHeaderSearch placeholder='Search NFTs' />
              <div>
                <a href='https://matataki.io/' target='_blank' rel='noreferrer'>
                  <Button className='hover-underline'>Learn</Button>
                </a>
                {wallet.status === 'connected' ? (
                  <>
                    {isRegistered ? (
                      <UserDropdown>
                        <StyledHeaderUserdorpdownContainer>
                          <Button color='gray'>{`@${userDataByWallet?.username}`}</Button>
                        </StyledHeaderUserdorpdownContainer>
                      </UserDropdown>
                    ) : (
                      <Button color='gray'>{shortedWalletAccount}</Button>
                    )}
                  </>
                ) : (
                  <Button color='dark' onClick={connectWallet}>
                    Connect Wallet
                  </Button>
                )}
                {wallet.status === 'connected' && isRegistered ? (
                  <Button color='dark' onClick={() => setIsCreate(true)}>
                    Create
                  </Button>
                ) : null}
                {Number(networkVersion) !== Number(currentChainId) &&
                networkVersion !== '' ? (
                  <Button color='error'>Wrong Network</Button>
                ) : null}
              </div>
            </StyledHeaderContainer>
          </Fragment>
        )}
      </StyledHeaderWrapper>
    </StyledHeader>
  );
};

export default HeaderComponents;

const StyledHeader = styled.div`
  color: #fff;
  /* position: fixed; */
  /* top: 0; */
  /* left: 0; */
  /* right: 0; */
  /* background: transparent; */
  /* box-shadow: 0 2px 10px rgb(0 0 0 / 10%); */
  box-shadow: 0px 1px 0px 0px #dbdbdb;
  transition: all 0.3s;
  position: sticky;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 3;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  transform: translateZ(0px);
  will-change: transform;
  &.active {
    background-color: #fff;
    color: #542de0;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
  }
`;
const StyledHeaderWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /* max-width: 1480px; */
  padding: 0px 25px;
  min-height: 80px;
  /* padding: 0 20px; */
  box-sizing: border-box;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    padding: 0 10px;
  }
`;
const StyledHeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;
const StyledHeaderLogo = styled.a`
  display: flex;
  align-items: center;
  img {
    height: 36px;
  }
  h1 {
    font-size: 32px;
    font-weight: 500;
    color: #000000;
    line-height: 39px;
    padding: 0;
    margin: 0 0 0 4px;
    font-family: BigCaslon-Medium, BigCaslon;
  }
`;
const StyledHeaderNav = styled.nav`
  margin-left: 50px;
  a {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    padding: 0;
    margin: 0 30px;
  }
`;

const StyledHeaderSearch = styled(Input)`
  width: 320px !important;
  margin-right: 16px;
`;
const StyledHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;
const StyledHeaderUserdorpdownContainer = styled.div`
  display: inline-block;
`;
