import { Input, } from "@geist-ui/react";
import Link from "next/link";
import styled from 'styled-components';
import Logo from "../../assets/images/logo.png";

const StyledHeader = styled.div`
  color: #fff;
  /* position: fixed; */
  /* top: 0; */
  /* left: 0; */
  /* right: 0; */
  /* background: transparent; */
	background-color: #fff;
	/* box-shadow: 0 2px 10px rgb(0 0 0 / 10%); */
	box-shadow: 0px 1px 0px 0px #DBDBDB;
  transition: all .3s;
  z-index: 10;
  &.active {
    background-color: #fff;
    color: #542DE0;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
  }
`
const StyledHeaderWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1440px;
	min-height: 80px;
  padding: 0 20px;
  box-sizing: border-box;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    padding: 10px;
  }
`
const StyledHeaderLeft = styled.div`
	display: flex;
	align-items: center;
`
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
`
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
`

const StyledHeaderSearch = styled(Input)`
	width: 320px !important;
	margin-right: 16px;
`
const StyledHeaderButtonLink = styled.a`
	display: inline-block;
`
const StyledHeaderButton = styled.button`
	background-color: #333333;
	font-size: 14px;
	font-family: PingFangSC-Medium,PingFang SC;
	font-weight: 500;
	color: #FFFFFF;
	line-height: 20px;
	border: none;
	outline: none;
	padding: 10px 38px;
	cursor: pointer;
	transition: all .2s;
	&:hover {
		background-color: #222;
	}
`


export default function Header() {
	return (
		<StyledHeader>
			<StyledHeaderWrapper>
				<StyledHeaderLeft>
					<Link href="/">
						<StyledHeaderLogo>
							<img src={Logo} alt="NFT Logo" />
							<h1>NFT Market</h1>
						</StyledHeaderLogo>
					</Link>
					<StyledHeaderNav>
						<Link href="/">
							<a>NFTS</a>
						</Link>
						<Link href="/">
							<a>CREATE NFT</a>
						</Link>
					</StyledHeaderNav>
				</StyledHeaderLeft>
				<div>
					<StyledHeaderSearch placeholder="Search NFTs" />
					<StyledHeaderButtonLink href={process.env.NEXT_PUBLIC_MATATAKI_OAUTH_URL}>
						<StyledHeaderButton>Sign In</StyledHeaderButton>
					</StyledHeaderButtonLink>
				</div>
			</StyledHeaderWrapper>
		</StyledHeader>
	)
}