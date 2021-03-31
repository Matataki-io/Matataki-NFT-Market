import { Button, Tooltip } from '@geist-ui/react'
import styled from 'styled-components';
import Link from "next/link";
import { ReactSVG } from 'react-svg'

import IconGithub from "../../assets/icons/github.svg";
import IconTelegram from "../../assets/icons/telegram.svg";
import IconDiscord from "../../assets/icons/discord.svg";
import IconTwitter from "../../assets/icons/twitter.svg";

// const MockItem = () => <div className="footer-nav-bar">
//   <Text h4>Support</Text>
//   <a href="#">About</a>
//   <a href="#">Suggestion</a>
//   <a href="#">FAQ</a>
// </div>

const StyledFooter = styled.div`
  background: #F1F1F1;
`
const StyledFooterWrapper = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 48px 20px 24px;
  box-sizing: border-box;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`
const StyledFooterItem = styled.div`
&.item-social {
  display: flex;
  flex-wrap:wrap;
  justify-content: space-between;
  align-items: flex-start;
}
&.item-rights {
  display: flex;
  flex-wrap:wrap;
  justify-content: space-between;
  margin-top: 56px;
  .rights {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    line-height: 20px;
  }
  .language {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    line-height: 20px;
  }
}
`
const StyledFooterNav = styled.div`
  display: flex;
  flex-wrap:wrap;
  ul {
    padding: 0;
    margin: 0 160px 0 0;
    list-style: none;
    &:nth-last-of-type(1) {
      margin-right: 0;
    }
    li {
      font-family: PingFangSC-Regular, PingFang SC;
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
`

const StyledFooterSocial = styled.div`
  display: flex;
  align-items: center;
  .icon {
    width: 32px;
    height: 32px;
    margin-left: 48px;
    &:nth-of-type(1) {
      margin-left: 0;
    }
    svg {
      font-size: 32px;
      color: #333333;
    }
  }
`

export default function Footer() {
  return (
    <StyledFooter>
      <StyledFooterWrapper>
        <StyledFooterItem className="item-social">
          <StyledFooterNav>
            <ul>
              <li><h3>SUPPORT</h3></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Suggestions</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
            <ul>
              <li><h3>MORE</h3></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </StyledFooterNav>
          <StyledFooterSocial>
            <ReactSVG className="icon" src={ IconGithub } />
            <ReactSVG className="icon" src={ IconTelegram } />
            <ReactSVG className="icon" src={ IconDiscord } />
            <ReactSVG className="icon" src={ IconTwitter } />
          </StyledFooterSocial>
        </StyledFooterItem>
        <StyledFooterItem className="item-rights">
          <span className="rights">© 2021 MetaNetwork All Rights Reserved </span>
          <div className="i18n-switch">
            <Tooltip text={<>
              <div style={{ display: 'flex' }}>
                <Button auto size="small">中文</Button>
                <Button auto size="small">日本语</Button>
                <Button auto size="small">English</Button>
              </div>
            </>}>
              <span className="language">English</span>
            </Tooltip>
          </div>
        </StyledFooterItem>
      </StyledFooterWrapper>
    </StyledFooter>
  )
}