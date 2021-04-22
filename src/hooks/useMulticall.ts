import { FunctionFragment } from '@ethersproject/abi';
import { BytesLike, ethers, utils } from 'ethers';
import { useCallback, useMemo } from 'react';
import { Multicall__factory } from '../blockchain/contracts/MulticallFactory';
import { currentMulticallAddress } from '../constant/contracts';
import { currentProvider } from '../constant/providers';
import { useSigner } from './useSigner';

export const staticMulticall = Multicall__factory.connect(
  currentMulticallAddress,
  currentProvider as ethers.providers.Provider
);

export function useMulticall() {
  const { signer, isSignerReady } = useSigner();
  const Multicall = useMemo(() => {
    if (isSignerReady(signer)) {
      return Multicall__factory.connect(currentMulticallAddress, signer);
    } else {
      return staticMulticall;
    }
  }, [signer]);

  const aggerateQuery = useCallback(
    async (
      _calls: Array<{
        target: string;
        iface: utils.Interface;
        funcFrag: FunctionFragment;
        data: any[];
      }>
    ) => {
      const calls: Array<{ target: string; callData: BytesLike }> = _calls.map(
        c => {
          return {
            target: c.target,
            callData: c.iface.encodeFunctionData(c.funcFrag, c.data),
          };
        }
      );
      const { returnData, blockNumber } = await Multicall.callStatic.aggregate(
        calls
      );
      const returns = returnData.map((result, idx) => {
        const _ = _calls[idx];
        return _.iface.decodeFunctionResult(_.funcFrag, result);
      });
      return { returns, blockNumber };
    },
    [Multicall]
  );

  return { Multicall, aggerateQuery };
}
