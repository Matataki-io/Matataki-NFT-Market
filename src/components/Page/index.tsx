import React from 'react'
import styled from 'styled-components'

const Page: React.FC = ({ children }) => (
  <StyledWrapper>
    {children}
  </StyledWrapper>
)

const StyledWrapper = styled.div`
  width: 100%;
  max-width: 1480px;
  padding: 0 20px 200px;
  box-sizing: border-box;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`

export default Page
