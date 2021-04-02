import React, { useState, useMemo, Fragment } from "react";
import { Input, } from "@geist-ui/react";
import Link from "next/link";
import styled from 'styled-components';
import Logo from "../../assets/images/logo.png";
import Button from '../Button/index';
import { useWallet } from 'use-wallet';

interface HeaderProps {
  isCreate: Boolean
  setIsCreate: (value: boolean) => void
}

const HeaderComponents: React.FC<HeaderProps> = ({
  isCreate,
  setIsCreate
}) => {

  const wallet = useWallet();
  const shortedWalletAccount = useMemo(() => {
    if (wallet.status !== 'connected') return 'Not Connected';
    return wallet.account?.slice(0, 6) + '...' + wallet.account?.slice(-4);
  }, [wallet]);

  return (
    <StyledHeader>
      <StyledHeaderWrapper>
        {
          isCreate ?
            <Fragment>
              <Button color="gray" onClick={() => setIsCreate(false)}>Back</Button>
              <div>
                <a href="https://matataki.io/">
                  <Button className="hover-underline">Learn</Button>
                </a>
                <Button color="gray">@xiaotian</Button>
              </div>
            </Fragment> :
            <Fragment>
              <StyledHeaderLeft>
                <Link href="/">
                  <StyledHeaderLogo>
                    <img src={Logo} alt="NFT Logo" />
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
                <StyledHeaderSearch placeholder="Search NFTs" />
                <div>
                  <a href="https://matataki.io/">
                    <Button className="hover-underline">Learn</Button>
                  </a>
                  <Button color="gray">@xiaotian</Button>
                  {wallet.status === 'connected' ? (
                    <>
                      <StyledHeaderUsername>
                        {shortedWalletAccount}
                      </StyledHeaderUsername>
                      <Button color="dark" onClick={() => wallet.reset()}>
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button color="dark" onClick={() => wallet.connect('injected')}>
                      Connect Wallet
                    </Button>
                  )}
                  <Button color="dark" onClick={() => setIsCreate(true)}>Create</Button>
                </div>
              </StyledHeaderContainer>
            </Fragment>
        }
      </StyledHeaderWrapper>
    </StyledHeader>
  )
}

export default HeaderComponents

const StyledHeader = styled.div`
  color: #fff;
  /* position: fixed; */
  /* top: 0; */
  /* left: 0; */
  /* right: 0; */
  /* background: transparent; */
	/* box-shadow: 0 2px 10px rgb(0 0 0 / 10%); */
	box-shadow: 0px 1px 0px 0px #DBDBDB;
  transition: all .3s;
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
`
const StyledHeaderContainer = styled.div`
	display: flex;
	align-items: center;
`
const StyledHeaderButtonLink = styled.a`
  display: inline-block;
`;
const StyledHeaderButton = styled.button`
  background-color: #333333;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 20px;
  border: none;
  outline: none;
  padding: 10px 38px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #222;
  }
`;

const StyledHeaderUsername = styled.button`
  color: rgb(0, 0, 0);
  background: rgb(230, 230, 230);
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  line-height: 20px;
  border: none;
  outline: none;
  padding: 10px 8px;
  cursor: pointer;
  transition: all 0.2s;
`;