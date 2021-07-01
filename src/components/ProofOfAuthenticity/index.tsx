import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export interface ProofOfAuthenticityProps {
  scanLink: string;
  ipfsLink: string;
}

const ProofOfAuthenticity: React.FC<ProofOfAuthenticityProps> = ({
  scanLink,
  ipfsLink,
}) => {
  return (
    <Root>
      <Label>Proof of Authenticity</Label>
      <Container>
        <Link href={scanLink} passHref>
          <LinkButton role='button' target='_blank' rel='noreferer noopener'>
            {process.env.NEXT_PUBLIC_SCAN}
          </LinkButton>
        </Link>
        <Link href={ipfsLink} passHref>
          <LinkButton role='button' target='_blank' rel='noreferer noopener'>
            IPFS
          </LinkButton>
        </Link>
      </Container>
    </Root>
  );
};

const Root = styled.div`
  padding: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Label = styled.div`
  font-size: 20px;
  line-height: 30px;
  margin-bottom: 20px;
  font-weight: 500;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const LinkButton = styled.a`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 20px;
  margin: 0px 5px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  appearance: none;
  color: rgb(255, 255, 255);
  background: rgb(0, 0, 0);
  border: 2px solid transparent;
  flex: 1 0 auto;
  &:first-child {
    margin-left: 0px;
  }
  &:last-child {
    margin-right: 0px;
  }
  &:hover {
    background: rgb(64, 64, 64);
  }
`;

export default ProofOfAuthenticity;
