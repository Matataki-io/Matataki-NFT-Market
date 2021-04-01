import React from 'react'
import styled from 'styled-components'

export interface AccountWebsiteProps {
  href: string
}

const AccountWebsite: React.FC<AccountWebsiteProps> = ({ href }) => (
  <StyledLink href={href} target='_blank' rel='noopener noreferrer'>
    {href.replace(/(^\w+:|^)\/\//, '')}
  </StyledLink>
)

const StyledLink = styled.a`
  text-align: center;
  font-weight: 500;
  color: rgb(0, 0, 0);
  text-decoration: none;
  margin-bottom: 10px;
`

export default AccountWebsite
