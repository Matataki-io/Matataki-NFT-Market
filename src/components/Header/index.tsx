import { Input, } from "@geist-ui/react";
import Link from "next/link";
import styled, { css } from 'styled-components';
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
  max-width: 1480px;
	min-height: 80px;
  padding: 0 20px;
  box-sizing: border-box;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    padding: 0 10px;
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
const StyledHeaderContainer = styled.div`
	display: flex;
	align-items: center;
`

const StyledHeaderButton = styled.button<{ color?: string }>`
	line-height: 20px;
	border: none;
	outline: none;
	cursor: pointer;
	transition: all .2s;
	padding: 10px 15px;
	font-weight: 500;
	font-size: 14px;
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	cursor: pointer;
	text-decoration: none;
	white-space: nowrap;
	appearance: none;
	margin-left: 5px;
	color: #000;
  background: transparent;
	/* &:hover {
		background: transparent;
	} */
	${ props => props.color === 'dark' && css`
		color: #FFFFFF;
		background: rgb(0, 0, 0);
		&:hover {
			background: rgb(64, 64, 64);
		}
	`}
	${ props =>props.color === 'gray' && css`
		color: rgb(0, 0, 0);
    background: rgb(230, 230, 230);
		&:hover {
      border-color: rgb(0, 0, 0);
		}
	`}

	&.hover-underline {
		&:hover {
			text-decoration: underline;
		}
	}
`

export default function HeaderComponents() {
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
				<StyledHeaderContainer>
					<StyledHeaderSearch placeholder="Search NFTs" />
					<div>
						<a href="https://matataki.io/">
							<StyledHeaderButton className="hover-underline">Learn</StyledHeaderButton>
						</a>
						<StyledHeaderButton color="gray">@xiaotian</StyledHeaderButton>
						<a href={process.env.NEXT_PUBLIC_MATATAKI_OAUTH_URL}>
							<StyledHeaderButton color="dark">Connect Wallet</StyledHeaderButton>
						</a>
						<StyledHeaderButton color="dark">Create</StyledHeaderButton>
					</div>
				</StyledHeaderContainer>
			</StyledHeaderWrapper>
		</StyledHeader>
	)
}