import { BigNumber, ethers, utils } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { BaseErc20Factory } from '../blockchain/contracts/BaseErc20Factory';
import { ERC20Profile, getProfileOfERC20 } from '../blockchain/erc20Helper';
import { ZERO_ADDRESS } from '../constant';
import { currentProvider } from '../constant/providers';
import { useSigner } from './useSigner';

const profileWhileLoading: ERC20Profile = {
  tokenAddress: ZERO_ADDRESS,
  name: 'Loading Token Profile',
  symbol: 'Please wait',
  decimals: 18, // most the token use 18 decimals
  balance: BigNumber.from(0),
  updatedAtBlock: 0,
};

// no loop
export function useERC20Single(tokenAddress: string) {
  const { account } = useWallet();
  const { signer, isSignerReady } = useSigner();

  const token = useMemo(() => {
    const readonlyProvider = currentProvider as ethers.providers.Provider;
    if (!tokenAddress)
      return BaseErc20Factory.connect(ZERO_ADDRESS, readonlyProvider);
    if (isSignerReady(signer)) {
      return BaseErc20Factory.connect(tokenAddress, signer);
    } else {
      return BaseErc20Factory.connect(tokenAddress, readonlyProvider);
    }
  }, [tokenAddress, isSignerReady, signer]);

  const [tokenProfile, setTokenProfile] = useState<ERC20Profile>(
    profileWhileLoading
  );

  const isProfileLoading = useMemo(() => tokenProfile.updatedAtBlock === 0, [
    tokenProfile,
  ]);

  const formattedBalance = useMemo(
    () => utils.formatUnits(tokenProfile.balance, tokenProfile.decimals),
    [tokenProfile]
  );

  const getProfile = useCallback(async () => {
    if (token.address === ZERO_ADDRESS) return;

    setTokenProfile(profileWhileLoading);
    const profile = await getProfileOfERC20(token, account);
    console.log('getProfileOfERC20 res', profile);
    setTokenProfile(profile);
  }, [token, account]);

  /**
   * use Dan's example
   * https://github.com/facebook/react/issues/14326#issuecomment-441680293
   */
  useEffect(() => {
    if (tokenAddress === ZERO_ADDRESS) return;
    if (tokenAddress) {
      getProfile();
    }
  }, [tokenAddress]); // 只需要执行一次，tokenAddress 变更调用

  return { token, isProfileLoading, tokenProfile, formattedBalance };
}
