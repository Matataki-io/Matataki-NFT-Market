import { BigNumber, ethers, utils } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { BaseErc20Factory } from '../blockchain/contracts/BaseErc20Factory';
import { ERC20Profile, getProfileOfERC20 } from '../blockchain/erc20Helper';
import { ZERO_ADDRESS } from '../constant';
import { currentProvider } from '../constant/providers';
import { useSigner } from './useSigner';

export function useERC20(tokenAddress: string) {
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
  }, [tokenAddress, signer]);

  const profileWhileLoading: ERC20Profile = {
    tokenAddress: ZERO_ADDRESS,
    name: 'Loading Token Profile',
    symbol: 'Please wait',
    decimals: 18, // most the token use 18 decimals
    balance: BigNumber.from(0),
    updatedAtBlock: 0,
  };

  const [tokenProfile, setTokenProfile] = useState<ERC20Profile>(
    profileWhileLoading
  );
  const resetProfileToLoading = () => setTokenProfile(profileWhileLoading);
  const isProfileLoading = useMemo(() => tokenProfile.updatedAtBlock === 0, [
    tokenProfile,
  ]);
  const formattedBalance = useMemo(
    () => utils.formatUnits(tokenProfile.balance, tokenProfile.decimals),
    [tokenProfile]
  );

  const getProfile = useCallback(async () => {
    if (token.address === ZERO_ADDRESS) return;
    resetProfileToLoading();
    const profile = await getProfileOfERC20(token, account);
    setTokenProfile(profile);
  }, [token, account]);

  /**
   * use Dan's example
   * https://github.com/facebook/react/issues/14326#issuecomment-441680293
   */
  useEffect(() => {
    if (token.address === ZERO_ADDRESS) return;
    getProfile();
    let refreshInterval = setInterval(getProfile, 1000 * 10);
    return () => clearInterval(refreshInterval);
  }, [getProfile, token]);

  return { token, isProfileLoading, tokenProfile, formattedBalance };
}
