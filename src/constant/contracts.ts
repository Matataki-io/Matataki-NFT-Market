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

export const currentContracts = CONTRACTS[currentChainId];
