import { useCallback, useEffect, useMemo, useState } from 'react';

import { apiClient } from '../backend/client';
import {
  StandardTokenList,
  StandardTokenProfile,
  tokenListTypeProps,
} from '../types/TokenList';
import { utils } from 'ethers';
import { currentChainId, ZERO_ADDRESS } from '../constant/index';
import { useERC20Single } from './useERC20Single';

export enum TokenListURL {
  Unisave = 'https://unpkg.com/@lychees/default-token-list@1.1.10/build/uniscam-default.tokenlist.json',
  MatatakiBsc = 'https://unpkg.com/@lychees/matataki-token-list@1.0.5/build/unisave-matataki.tokenlist.json',
}

// token 列表类型 用户用户选择
const tokenListType: tokenListTypeProps[] = [
  {
    logoURI:
      'https://ipfs.io/ipfs/QmNa8mQkrNKp1WEEeGjFezDmDeodkWRevGFN8JCV7b4Xir',
    name: 'Unisave Default List',
    key: 'Unisave',
    value: 'unisave',
  },
  {
    logoURI:
      'https://raw.githubusercontent.com/Matataki-io/Matataki-FE/master/assets/img/matataki_logo_small.png',
    name: 'Unisave Matataki List',
    key: 'MatatakiBsc',
    value: 'matataki',
  },
];

export default function useTokenList() {
  // token 列表
  const [tokenList, setTokenList] = useState<StandardTokenProfile[]>([]);
  // token all 信息
  const [tokens, setTokens] = useState<StandardTokenList>(
    {} as StandardTokenList
  );
  const [searchInput, setSearchInput] = useState<string>('');
  // 是否为合约地址
  const isContractAddress = useMemo(() => utils.isAddress(searchInput), [
    searchInput,
  ]);
  const { tokenProfile } = useERC20Single(isContractAddress ? searchInput : '');

  // 请求 token 列表
  const tokenListFetch = useCallback(async ({ url }: { url: string }) => {
    try {
      const res = await apiClient.get<StandardTokenList>(url, {
        cache: true,
      });

      if (res.status === 200) {
        const selectedChainId: number = currentChainId;

        const list = res.data.tokens.filter(
          i => Number(i.chainId) === Number(selectedChainId)
        );

        setTokenList(list);
        if (!list.length) {
          // 临时 mock 数据 97
          if (res.data.name === 'Unisave Matataki List') {
            setTokenList([
              {
                name: 'Bestswap Token',
                symbol: 'BEST',
                address: '0x36eb1b02cb7be3ffa1ee7bd2a3c7d036002730f7',
                decimals: 18,
                chainId: 97,
                logoURI:
                  'https://raw.githubusercontent.com/ant-design/ant-design-icons/master/packages/icons-svg/svg/outlined/question-circle.svg',
              },
            ]);
          }
        }
        setTokens(res.data);
      } else {
        throw new Error('status is not 200');
      }
    } catch (error) {
      setTokenList([]);
      setTokens({} as StandardTokenList);
    }
  }, []);

  // 切换 token 列表
  const toggleTokenList = async (key: 'Unisave' | 'MatatakiBsc') => {
    await tokenListFetch({ url: TokenListURL[key] });
  };

  // 设置搜索内容
  const setSearchInputFn = (val: string) => setSearchInput(val);

  // 执行一次 默认获取一次 token 列表
  useEffect(() => {
    tokenListFetch({ url: TokenListURL.Unisave });
  }, []);

  // 当前 token 列表，筛选后
  const tokenListCurrent = useMemo(() => {
    if (searchInput === '') {
      return tokenList;
    } else if (isContractAddress) {
      // 如果地址在 列表里面
      const findInList = tokenList.find(
        t => utils.getAddress(t.address) === utils.getAddress(searchInput)
      );
      if (findInList) return [findInList];

      // 如果是 ZERO_ADDRESS
      if (tokenProfile.tokenAddress === ZERO_ADDRESS) return [];

      // other token address
      return [
        {
          chainId: currentChainId,
          address: searchInput,
          logoURI:
            'https://raw.githubusercontent.com/ant-design/ant-design-icons/master/packages/icons-svg/svg/outlined/question-circle.svg',
          name: tokenProfile.name,
          symbol: tokenProfile.symbol,
          decimals: tokenProfile.decimals,
        },
      ] as StandardTokenProfile[];
    } else {
      // name search
      return tokenList.filter(i =>
        i.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
      );
    }
  }, [tokenList, searchInput, tokenProfile, isContractAddress]);

  return {
    tokens,
    tokenListCurrent,
    tokenListType,
    toggleTokenList,
    setSearchInputFn,
    isContractAddress,
  };
}
