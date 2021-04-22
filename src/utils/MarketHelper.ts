import { BigNumberish } from 'ethers';
import { IMarket } from '../blockchain/contracts/MarketFactory';
import { ZERO_ADDRESS } from '../constant';
import { currentContracts } from '../constant/contracts';
import { staticMulticall } from '../hooks/useMulticall';
import { Bid } from '../types/ContractTypes';

export async function getBidFor(tokenId: BigNumberish, addresses: string[]) {
  const calls = addresses.map(who => ({
    target: currentContracts?.MARKET as string,
    callData: IMarket.encodeFunctionData('bidForTokenBidder', [tokenId, who]),
  }));
  const {
    returnData,
    blockNumber,
  } = await staticMulticall.callStatic.aggregate(calls);
  const decoded = returnData
    .map(rawData => IMarket.decodeFunctionResult('bidForTokenBidder', rawData))
    // treat currency 0x0...0 as removed bid
    .map(el =>
      el[0].currency === ZERO_ADDRESS
        ? null
        : ({
            currency: el[0].currency,
            amount: el[0].amount,
            bidder: el[0].bidder,
            recipient: el[0].recipient,
            sellOnShare: el[0].sellOnShare,
          } as Bid)
    );
  console.info('decoded', decoded);
  const list: Record<string, Bid | null> = {};
  decoded.forEach((bid, idx) => {
    const addr = addresses[idx];
    list[addr] = bid;
  });
  return list;
}
