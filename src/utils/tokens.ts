import { utils } from 'ethers';
import { currentSupportedTokens } from '../constant/contracts';

export const getDecimalOf = (address: string) => {
  switch (address) {
    // case value:

    //     break;

    default:
      return 18;
  }
};

export const getSymbolOf = (address: string) => {
  const list = currentSupportedTokens;
  if (!list || !address) return 'Unknown';
  const [addresses, symbols] = [Object.values(list), Object.keys(list)];
  const checkSumed = addresses.map(addr => utils.getAddress(addr));
  const idx = checkSumed.indexOf(utils.getAddress(address));
  return idx > -1 ? symbols[idx] : 'Unknown';
};
