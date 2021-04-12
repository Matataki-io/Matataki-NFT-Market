import { ChainId, currentChainId } from '.';

export const CONTRACTS: {
  [chainId in ChainId]?: {
    [contractName: string]: string;
    MARKET: string;
    MEDIA: string;
  };
} = {
  [ChainId.BSC_TESTNET]: {
    MARKET: '0xE9a43f504eDE103528a51d81163580fA2fAA37f2',
    MEDIA: '0x7f94cFfC1477D135CB01972c3Fc21CD61606D4f6',
  },
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
