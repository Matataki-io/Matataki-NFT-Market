import React from 'react'
import styled from 'styled-components'

const AccountName: React.FC = ({ children }) => (
  <StyledAccountName>
    {children}
  </StyledAccountName>
)

const StyledAccountName = styled.h4`
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 20px;
`

export default AccountName
