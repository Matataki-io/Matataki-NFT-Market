import { ChainId, currentChainId } from '.';

export const CONTRACTS: {
  [chainId in ChainId]?: {
    [contractName: string]: string;
    MARKET: string;
    MEDIA: string;
  };
} = {
  [ChainId.BSC_TESTNET]: {
    MARKET: '0x9311aA18cb44142Cf518396B1c309d8bE76f1e78',
    MEDIA: '0xED8DDe4c423e7aF2FBd1aA604D97a5FdD8d8a1d7',
  },
};

export const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  [ChainId.BSC_MAINNET]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
  [ChainId.BSC_TESTNET]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
};

export const TOKENS: {
  [chainId in ChainId]?: {
    [contractName: string]: string;
  };
} = {
  [ChainId.BSC_TESTNET]: {
    USDT: '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd',
    DAI: '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867',
  },
};

export const currentContracts = CONTRACTS[currentChainId];
export const currentSupportedTokens = TOKENS[currentChainId];
export const currentMulticallAddress = MULTICALL_NETWORKS[currentChainId];
