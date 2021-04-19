import React from 'react';
import styled from 'styled-components';

import ButtonCustom from '../../components/Button';
const BidsCard: React.FC = () => {
  return (
    <StyledWrapper>
      <div className='nft'>
        <img
          src='https://ipfs.fleek.co/ipfs/QmVD9gjdWRVbaGDupFieEDU4K9LuN29MF5tou98PLuMSqp'
          alt=''
        />
      </div>
      <StyledInfo>
        <div className='title'>
          Cinco{"'"}s Bad Girls Only Gang #1 <b>·</b>{' '}
          <a className='user' href='#'>
            jeffcinco
          </a>
        </div>
        <div className='price'>0.01WETH</div>
        <time className='time'>April 02,2021</time>
      </StyledInfo>
      <div className='btn'>
        <ButtonCustom color='gray'>View Media</ButtonCustom>
        <ButtonCustom color='gray'>Review bid</ButtonCustom>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  padding: 20px;
  border: 2px solid #dfdfdf;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: stretch;
  .nft {
    width: 100px;
    height: 100px;
    overflow: hidden;
    border: 1px solid #dfdfdf;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .btn {
    margin-left: auto;
    display: flex;
    flex-direction: column;
  }
`;
const StyledInfo = styled.div`
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .title {
    font-size: 16px;
    color: #000;
    .user {
      color: #b8b8b8;
    }
  }
  .price {
    font-size: 18px;
    color: #000;
    font-weight: 500;
  }
  .time {
    font-size: 18px;
    color: #000;
    font-weight: 300;
  }
`;

export default BidsCard;
