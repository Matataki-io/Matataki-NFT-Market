import React from 'react';
import styled from 'styled-components';
import { IconRespondArrow } from '../Icons';

const MediaTradeActions: React.FC = () => (
  <Container>
    <TradeButton colorType='default'>Buy now</TradeButton>
    <TradeButton colorType='secondary'>Place a bid</TradeButton>
    <SocialButton>
      <IconRespondArrow />
    </SocialButton>
  </Container>
);

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 30px;
`;

type TradeButtonProps = {
  colorType?: 'default' | 'secondary';
};
const TradeButton = styled.button<TradeButtonProps>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 20px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  appearance: none;
  color: ${({ colorType = 'default' }) => {
    if (colorType === 'default') return 'rgb(255, 255, 255)';
    if (colorType === 'secondary') return 'rgb(0, 0, 0)';
  }};
  background-color: ${({ colorType = 'default' }) => {
    if (colorType === 'default') return 'rgb(0, 0, 0)';
    if (colorType === 'secondary') return 'rgb(255, 255, 255)';
  }};
  border: ${({ colorType = 'default' }) => {
    if (colorType === 'default') return '2px solid transparent';
    if (colorType === 'secondary') return '2px solid rgb(0, 0, 0)';
  }};
  height: 60px;
  width: 100%;
  max-width: 190px;
  margin: 0px 15px 0px 0px;
  &[disabled] {
    cursor: not-allowed;
    background-color: ${({ colorType = 'default' }) => {
      if (colorType === 'default') return 'rgb(128, 128, 128)';
      if (colorType === 'secondary') return 'rgb(255, 255, 255)';
    }};
    color: ${({ colorType = 'default' }) => {
      if (colorType === 'default') return 'rgb(255, 255, 255)';
      if (colorType === 'secondary') return 'rgb(128, 128, 128)';
    }};
    ${({ colorType = 'default' }) => {
      if (colorType === 'secondary') return 'border-color: rgb(128, 128, 128);';
    }}
  }
  &:hover {
    ${({ colorType = 'default', disabled }) => {
      if (disabled) return '';
      if (colorType === 'default') return 'background-color: rgb(64, 64, 64);';
      if (colorType === 'secondary') return 'border-color: rgb(128, 128, 128);';
    }}
  }
  &:first-child {
    margin-left: 0px;
  }
`;

const SocialButton = styled.button`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 20px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  appearance: none;
  color: rgb(255, 255, 255);
  background-color: rgb(0, 0, 0);
  border: 2px solid transparent;
  height: 60px;
  width: 60px;
  &:last-child {
    margin-right: 0px;
  }
  &:hover {
    background: rgb(64, 64, 64);
  }
`;

export default MediaTradeActions;
