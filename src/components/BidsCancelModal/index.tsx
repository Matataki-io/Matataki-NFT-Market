import React, { useState } from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { utils } from 'ethers';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import ButtonCustom from '../Button';
import NFTPreview from '../NFTPreview';
import { BidLog } from '../../types/Bid.d';
import { getDecimalOf, getSymbolOf } from '../../utils/tokens';

interface Props {
  currentBids: BidLog;
  isModalVisibleBidsCancel: boolean;
  setIsModalVisibleBidsCancel: (val: boolean) => void;
}

const BidsCancelModal: React.FC<Props> = ({
  currentBids,
  isModalVisibleBidsCancel,
  setIsModalVisibleBidsCancel,
}) => {
  const handleOk = () => {
    setIsModalVisibleBidsCancel(false);
  };

  const handleCancel = () => {
    setIsModalVisibleBidsCancel(false);
  };

  const date = (timestamp: number) => {
    dayjs.extend(relativeTime);
    const date = dayjs(timestamp * 1000).fromNow();
    return date;
  };
  const price = (amount: string, currency: string) => {
    // TODO 如果组件使用 需要修改
    return `${utils.formatUnits(amount, getDecimalOf(currency))} ${getSymbolOf(
      currency
    )}`;
  };

  return (
    <Modal
      title='Review Bid'
      visible={isModalVisibleBidsCancel}
      width={460}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}>
      {!isEmpty(currentBids) ? (
        <>
          <StyledWrapperNFT>
            <NFTPreview
              src={currentBids?.media.tokenURI}
              type={'image'}></NFTPreview>
          </StyledWrapperNFT>
          <StyledLine></StyledLine>
          <StyledTitle>YOUR BID</StyledTitle>
          <StyledPrice>
            {price(currentBids?.amount, currentBids?.currency)}
          </StyledPrice>
          <StyledDescription>
            If you cancel this bid the funds will be returned to wallet you used
            to make this bid.
          </StyledDescription>
          <StyledFooter>
            <ButtonCustom onClick={() => alert('正在开发中...')} color='error'>
              Cancel Bid
            </ButtonCustom>
          </StyledFooter>
        </>
      ) : null}
    </Modal>
  );
};

const StyledWrapperNFT = styled.div`
  width: 400px;
  height: 400px;
  border: 1px solid #dfdfdf;
  margin: 0 auto;
`;
const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  background: #bbbbbb;
  margin: 20px 0;
`;
const StyledTitle = styled.h3`
  margin: 6px 0;
  padding: 0;
  font-size: 14px;
  color: #bbb;
  line-height: 1;
  font-weight: 400;
`;
const StyledPrice = styled.p`
  margin: 10px 0;
  padding: 0;
  font-size: 16px;
  color: #000;
  line-height: 1;
  font-weight: 500;
`;
const StyledDescription = styled.div`
  margin: 20px 0 10px;
  padding: 10px;
  font-size: 14px;
  color: #333;
  background-color: #e6e6e6;
  line-height: 1.6;
  font-weight: 400;
`;
const StyledFooter = styled.div`
  text-align: right;
`;
export default BidsCancelModal;
