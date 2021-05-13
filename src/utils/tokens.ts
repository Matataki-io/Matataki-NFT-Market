import { utils } from 'ethers';
import { ChainId } from '../constant';
import { currentSupportedTokens, TOKENS } from '../constant/contracts';

/**
 * 静态获取 Token 小数点数据
 * @param address token地址
 * @returns
 */
export const getDecimalOf = (address: string) => {
  if (!address) return 18;
  const checksumedAddress = utils.getAddress(address);
  switch (checksumedAddress) {
    case TOKENS[ChainId.MAINNET]?.USDT:
      return 6;
    case TOKENS[ChainId.MAINNET]?.USDC:
      return 6;
    case TOKENS[ChainId.MAINNET]?.WBTC:
      return 8;
    case TOKENS[ChainId.RINKEBY]?.USDT:
      return 6;
    case TOKENS[ChainId.RINKEBY]?.USDC:
      return 6;
    case TOKENS[ChainId.RINKEBY]?.WBTC:
      return 8;
    //     break;

    default:
      return 18;
  }
};

export const getSymbolOf = (address: string) => {
  const list = currentSupportedTokens;
  if (!list || !address) return 'Bad Token';
  const [addresses, symbols] = [Object.values(list), Object.keys(list)];
  const checkSumed = addresses.map(addr => utils.getAddress(addr));
  const idx = checkSumed.indexOf(utils.getAddress(address));
  return idx > -1 ? symbols[idx] : 'Bad Token';
};
