import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Avatar, Button, Modal, Input, Radio, message } from 'antd';
import { UserOutlined, CopyOutlined } from '@ant-design/icons';
import { utils } from 'ethers';

import useTokenList from '../../hooks/useTokenList';
import { StandardTokenProfile } from '../../types/TokenList';
import { isEmpty } from 'lodash';
import { shortedWalletAccount, balanceDecimal } from '../../utils/index';
import { useBalances } from '../../hooks/useBalances';

interface Props {
  setCurrentToken: (token: StandardTokenProfile) => void;
  isModalVisible: boolean;
  setIsModalVisible: (val: boolean) => void;
}

const TokenListSelectComponents = ({
  setCurrentToken,
  isModalVisible,
  setIsModalVisible,
}: Props) => {
  const [valueSelect, setValueSelect] = useState<'Unisave' | 'MatatakiBsc'>(
    'Unisave'
  ); // 同步于 TokenListURL key
  const {
    tokenListCurrent,
    tokenListType,
    toggleTokenList,
    setSearchInputFn,
    isContractAddress,
  } = useTokenList();

  // token 列表 纯地址
  const tokenListAddress = useMemo(() => {
    return tokenListCurrent.map(i => i.address);
  }, [tokenListCurrent]);

  const { balanceOf } = useBalances(tokenListAddress);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // token 列表选择
  const onChangeSelect = async (e: any) => {
    await setValueSelect(e.target.value);
    await toggleTokenList(e.target.value);
  };

  // token search input
  const onChangeSearchInput = async (e: any) => {
    console.log('e', e.target.value);
    await setSearchInputFn(e.target.value);
  };

  const handleItemClick = (token: StandardTokenProfile) => {
    setCurrentToken(token);
    setIsModalVisible(false);
  };

  // token list
  const Item = () => {
    return (
      <StyledItem>
        {isEmpty(tokenListCurrent) && isContractAddress ? (
          <>
            <StyledItemSearchText>Searching...</StyledItemSearchText>
            <StyledItemSearchText>
              If you wait too long, please make sure that address is right, or
              check your network.
            </StyledItemSearchText>
          </>
        ) : (
          ''
        )}
        {tokenListCurrent.map((i, idx: number) => (
          <StyledItemLi
            key={`${i.address}`}
            onClick={() => {
              handleItemClick(i);
            }}>
            <Avatar
              size={24}
              icon={<UserOutlined />}
              src={
                i.logoURI ||
                'https://raw.githubusercontent.com/ant-design/ant-design-icons/master/packages/icons-svg/svg/outlined/question-circle.svg'
              }
            />
            <StyledItemLiInfo>
              <StyledItemSymbol>{i.name}</StyledItemSymbol>
              <StyledItemAddress>
                {shortedWalletAccount(i.address)}

                <StyledItemCopy onClick={e => e.stopPropagation()}>
                  <CopyToClipboard
                    text={i.address}
                    onCopy={() => {
                      message.info('复制成功');
                    }}>
                    <CopyOutlined />
                  </CopyToClipboard>
                </StyledItemCopy>
              </StyledItemAddress>
            </StyledItemLiInfo>
            <StyledItemBalance>
              {balanceDecimal(
                utils.formatUnits(balanceOf(i.address), i.decimals),
                3
              )}
            </StyledItemBalance>
          </StyledItemLi>
        ))}
      </StyledItem>
    );
  };

  // token list select
  const tokenListSelect = () => {
    return (
      <StyledSelect>
        <Radio.Group onChange={onChangeSelect} value={valueSelect}>
          {tokenListType.map((i, idx: number) => (
            <Radio value={i.key} key={idx}>
              <Avatar size={24} icon={<UserOutlined />} src={i.logoURI} />
              <StyledSelectName>{i.name}</StyledSelectName>
            </Radio>
          ))}
        </Radio.Group>
      </StyledSelect>
    );
  };

  return (
    <Modal
      title='Select Token'
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}>
      <Input
        placeholder='Search name or paste address'
        onChange={onChangeSearchInput}
        allowClear
      />
      {Item()}
      {tokenListSelect()}
    </Modal>
  );
};

// item start
const StyledItem = styled.ul`
  padding: 0;
  margin: 20px 10px;
  list-style: none;
  max-height: 420px;
  overflow: auto;
`;

const StyledItemLi = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f3f3f3;
    border-radius: 3px;
  }
`;
const StyledItemLiInfo = styled.div`
  margin-left: 10px;
`;

const StyledItemBalance = styled.div`
  margin-left: auto;
  font-size: 14px;
  color: #222;
`;

const StyledItemSymbol = styled.div`
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  line-height: 1.6;
`;

const StyledItemAddress = styled.div`
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-size: 12px;
  color: #757575;
`;
const StyledItemCopy = styled.span`
  margin-left: 4px;
`;
const StyledItemSearchText = styled.p`
  font-size: 14px;
  color: #333;
  margin: 6px 0;
`;
// item end

// token list select start
const StyledSelect = styled.div`
  margin: 40px 0 10px 0;
  padding: 20px 10px 10px;
  border-top: 1px solid #dfdfdf;
`;

const StyledSelectName = styled.span`
  margin-left: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #323232;
`;

// token list select end

export default TokenListSelectComponents;
