import React, {
  useState,
  useMemo,
  Fragment,
  useEffect,
  useCallback,
} from 'react';
import { useMount } from 'ahooks';
import Link from 'next/link';
import styled from 'styled-components';
// import Logo from '../../assets/images/logo.png';
import Button from '../Button/index';
import { useWallet } from 'use-wallet';
import UserDropdown from '../UserDropdown';
import { useLogin } from '../../hooks/useLogin';
import { currentChainId } from '../../constant';
import { getCookie } from '../../utils/cookie';
import { shortedWalletAccount } from '../../utils/index';
import { message } from 'antd';
import { isEmpty } from 'lodash';
// import Search from '../Search';

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
  const shortedccount = useMemo(() => {
    if (wallet.status !== 'connected') return 'Not Connected';
    return wallet.account ? shortedWalletAccount(wallet.account) : '';
  }, [wallet]);
  const {
    isRegistered,
    registeredLoading,
    userDataByWallet,
    loginWithSignature,
    caughtError,
  } = useLogin();
  const [networkVersion, setNetworkVersion] = useState<string>('');
  const [connect, setConnect] = useState<boolean>(false);

  // TODO: 这里可能要改 暂时用来显示 network error
  useMount(() => {
    if (process.browser && (window as any).ethereum) {
      let network = (window as any).ethereum.networkVersion;
      console.log('network', network);
      if (network) {
        setNetworkVersion(network);
      }
    }
  });

  useEffect(() => {
    if (!isEmpty(caughtError)) {
      message.error(`caughtError ${caughtError}`);
      console.error('caughtError', caughtError);
    }
  }, [caughtError]);

  useEffect(() => {
    // 如果登录过了
    if (
      wallet &&
      (window as any).ethereum &&
      getCookie('token') &&
      wallet.status !== 'connected'
    ) {
      wallet.connect('injected'); // 自动链接 不用签名
    }
  }, [wallet]);
  // 链接钱包
  const connectWallet = useCallback(async () => {
    await wallet.connect('injected');
    setConnect(true);
  }, [wallet]);

  useMount(() => {
    // 当 MetaMask 已经链接时，window.ethereum.selectedAddress 不是 null
    // if ((window as any).ethereum.selectedAddress) connectWallet();
    // 新开页面有点问题 我先还原
  });

  // 链接钱包，并且没有注册显示信息框
  useEffect(() => {
    if (connect && wallet.status === 'connected') {
      // 如果正在查询数据停止
      if (registeredLoading) return;
      // 查询完是否注册
      if (isRegistered) {
        setIsProfile(false);
        if (!getCookie('token')) loginWithSignature();
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
              <Button color='gray'>{shortedccount}</Button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <StyledHeaderLeft>
              <Link href='/'>
                <StyledHeaderLogo>
                  <h1>Maven NFT</h1>
                </StyledHeaderLogo>
              </Link>
              <StyledHeaderNav>
                <Link href='/'>
                  <a>New Release</a>
                </Link>
                <Link href='/'>
                  <a>Featured Artists</a>
                </Link>
                <Link href='/'>
                  <a>Gallery List</a>
                </Link>
                <Link href='/'>
                  <a>Market Place</a>
                </Link>
                <Link href='/'>
                  <a>Community</a>
                </Link>
              </StyledHeaderNav>
            </StyledHeaderLeft>
            {/* <Search></Search> */}

            <StyledHeaderContainer>
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
                      <Button color='gray'>{shortedccount}</Button>
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
                networkVersion !== ''
                  ? // <Button color='error'>Wrong Network</Button>
                    null
                  : null}
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
  max-width: 1480px;
  padding: 0px 25px;
  min-height: 80px;
  padding: 0 20px;
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
    padding: 0;
    margin: 0;
    font-size: 32px;
    font-family: BigCaslon-Medium, BigCaslon;
    font-weight: 500;
    color: #000000;
  }
`;
const StyledHeaderNav = styled.nav`
  margin-left: 40px;
  a {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    padding: 0;
    margin: 0 24px;
    font-family: PingFangSC-Medium, PingFang SC;
  }
`;

const StyledHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;
const StyledHeaderUserdorpdownContainer = styled.div`
  display: inline-block;
`;
