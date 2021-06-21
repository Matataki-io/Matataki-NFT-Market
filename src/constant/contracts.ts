import { ChainId, currentChainId } from '.';

export type AddressBookForNetwork = {
  [chainId in ChainId]: string;
};

export type OptionalAddressBookForNetwork = Partial<AddressBookForNetwork>;

export type ServiceAddressBook = {
  [chainId in ChainId]?: {
    [contractName: string]: string;
    MARKET: string;
    MEDIA: string;
  };
};

export const CONTRACTS: ServiceAddressBook = {
  [ChainId.BSC_TESTNET]: {
    MARKET: '0xAa9a113D8a8a62962578BFf1Be9dAB70336971B5',
    MEDIA: '0x520B66a0fEC5335Aba9f34774AAE8bfc2C27d234',
  },
  [ChainId.BSC_MAINNET]: {
    MARKET: '0x456bd9F5e006A27ec446DC2978e025590703823C',
    MEDIA: '0x75CB5AB6778454644cB6b0149c59dE99303fcaDf',
  },
};

export const MULTICALL_NETWORKS: AddressBookForNetwork = {
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
  // @notice: must be checksumed address, if not so sure, wrap it with `utils.getAddress()`
  [ChainId.MAINNET]: {
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    BUSD: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    YFI: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    OKB: '0x75231F58b43240C9718Dd58B4967c5114342a86c',
    HT: '0x6f259637dcD74C767781E37Bc6133cd6A68aa161',
    AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  },
  [ChainId.ROPSTEN]: { WETH: '0xc778417E063141139Fce010982780140Aa0cD5Ab' },
  [ChainId.RINKEBY]: {
    WETH: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    USDT: '0x3410Fddb1b0e8Afda6A28DD1Ab5fDaDC65baA409',
    USDC: '0xe776781470d1C6550e2346d72579f79cEbAd01a8',
  },
  [ChainId.GÖRLI]: { WETH: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6' },
  [ChainId.KOVAN]: { WETH: '0xd0A1E359811322d97991E03f863a0C30C2cF029C' },
  [ChainId.BSC_MAINNET]: { WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c' },
  [ChainId.BSC_TESTNET]: {
    WBNB: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    USDT: '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd',
    DAI: '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867',
  },
};

export const WETH: AddressBookForNetwork = {
  [ChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.ROPSTEN]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  [ChainId.RINKEBY]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  [ChainId.GÖRLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  [ChainId.KOVAN]: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  [ChainId.BSC_MAINNET]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  [ChainId.BSC_TESTNET]: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
};

export const currentContracts = CONTRACTS[currentChainId];
export const currentSupportedTokens = TOKENS[currentChainId];
export const currentMulticallAddress = MULTICALL_NETWORKS[currentChainId];
export const currentWETH = WETH[currentChainId];
