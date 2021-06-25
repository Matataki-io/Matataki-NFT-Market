export type StandardTokenProfile = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

export type StandardTokenList = {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tags: Record<string, any>;
  logoURI: string;
  keywords: string;
  tokens: Array<StandardTokenProfile>;
};

export interface tokenListTypeProps {
  logoURI: string;
  name: string;
  key: string;
  value: string;
}
