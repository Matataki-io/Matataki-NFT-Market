import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMount } from 'ahooks';
import Link from 'next/link';
import styled from 'styled-components';
// import Logo from '../../assets/images/logo.png';
import Button from '../Button/index';
import { useWallet } from 'use-wallet';
import UserDropdown from '../UserDropdown';
import { useLogin } from '../../hooks/useLogin';
import { currentChainId, UserRole } from '../../constant';
import { getCookie } from '../../utils/cookie';
import { shortedWalletAccount } from '../../utils';
import { message, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
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
  const router = useRouter();

  const shortedAccount = useMemo(() => {
    if (wallet.status !== 'connected') return 'Not Connected';
    return wallet.account ? shortedWalletAccount(wallet.account) : '';
  }, [wallet]);
  const {
    isRegistered,
    registeredLoading,
    userDataByWallet,
    loginWithSignature,
    caughtError,
    accessToken,
  } = useLogin();
  const [networkVersion, setNetworkVersion] = useState<string>('');
  const [connect, setConnect] = useState<boolean>(false);

  const [visible, setVisible] = useState(false);

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
    console.log(userDataByWallet);
  }, [wallet]);
  // 链接钱包
  const connectWallet = useCallback(async () => {
    await wallet.connect('injected');
  }, [wallet]);

  useMount(() => {
    // 当 MetaMask 已经链接时，window.ethereum.selectedAddress 不是 null
    // if ((window as any).ethereum.selectedAddress) connectWallet();
    // 新开页面有点问题 我先还原
  });

  // 链接钱包，并且没有注册显示信息框
  useEffect(() => {
    if (connect && wallet.status === 'connected') {
      //
    }
  }, [
    wallet.status,
    isRegistered,
    loginWithSignature,
    registeredLoading,
    connect,
    router,
  ]);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const NavComponents = () => {
    return (
      <StyledHeaderNav>
        <Link href='/artist'>
          <a>Featured Artists</a>
        </Link>
        <Link href='/gallery'>
          <a>Gallery List</a>
        </Link>
        <Link href='/market'>
          <a>Market Place</a>
        </Link>
        <Link href='/community'>
          <a>Community</a>
        </Link>
        {/* {
          // do not just `ts-ignore`, use expression to do typesafe check~
          // need to have user data
          // if user is super admin
          userDataByWallet && userDataByWallet.role === UserRole.SuperAdmin && (
            <Link
              href={`${process.env.NEXT_PUBLIC_MANAGEMENT_LOCATION}/auth?token=${accessToken}`}>
              Management
            </Link>
          )
        } */}
      </StyledHeaderNav>
    );
  };

  const ContainerComponents = () => {
    return (
      <div>
        <a href='https://matataki.io/' target='_blank' rel='noreferrer'>
          <Button className='hover-underline'>Learn</Button>
        </a>
        {wallet.status === 'connected' ? (
          <>
            {isRegistered ? (
              <UserDropdown>
                <StyledHeaderUserdorpdownContainer>
                  <Button color='gray'>{`@${
                    userDataByWallet?.nickname ||
                    userDataByWallet?.username ||
                    shortedAccount
                  }`}</Button>
                </StyledHeaderUserdorpdownContainer>
              </UserDropdown>
            ) : (
              <Button color='gray'>{shortedAccount}</Button>
            )}
          </>
        ) : (
          <Button color='dark' onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
        {wallet.status === 'connected' ? (
          <Button color='dark' onClick={() => setIsCreate(true)}>
            Create
          </Button>
        ) : null}

        {/* {userDataByWallet?.role === UserRole.SuperAdmin && (
          <Link href='/gallery/create'>
            <Button color='dark'>Create Gallery</Button>
          </Link>
        )} */}

        {Number(networkVersion) !== Number(currentChainId) &&
        networkVersion !== ''
          ? // <Button color='error'>Wrong Network</Button>
            null
          : null}
      </div>
    );
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
              <Button color='gray'>{shortedAccount}</Button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <StyledHeaderLeft>
              <Link href='/'>
                <StyledHeaderLogo>
                  <h1>MTTK NFT</h1>
                </StyledHeaderLogo>
              </Link>
              {isMobile ? null : (
                <StyledHeaderNav>{NavComponents()}</StyledHeaderNav>
              )}
            </StyledHeaderLeft>
            {/* <Search></Search> */}

            <StyledHeaderContainer>
              {isMobile ? (
                <StyledMoreIcon onClick={showDrawer} />
              ) : (
                ContainerComponents()
              )}
            </StyledHeaderContainer>
          </Fragment>
        )}
      </StyledHeaderWrapper>
      <Drawer
        title='Basic Drawer'
        placement='right'
        closable={false}
        onClose={onClose}
        visible={visible}>
        {<StyledHeaderNavMobile>{NavComponents()}</StyledHeaderNavMobile>}
        {ContainerComponents()}
      </Drawer>
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
  flex-wrap: wrap;
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
    font-family: 'Playfair Display', serif;
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
  }
`;
const StyledHeaderNavMobile = styled.nav`
  a {
    color: #333333;
    padding: 0;
    display: block;
    margin: 10px 0;
    font-weight: 400;
    font-size: 14px;
  }
`;

const StyledHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;
const StyledHeaderUserdorpdownContainer = styled.div`
  display: inline-block;
`;
const StyledMoreIcon = styled(MenuOutlined)`
  color: #000;
  font-size: 20px;
  cursor: pointer;
`;
