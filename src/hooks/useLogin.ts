import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ethers, utils } from 'ethers';
import { BACKEND_CLIENT, MessageForLogin } from '../constant';
import { checkIsWalletRegistered, registerUser } from '../backend/user';
import { User } from '../types/user.types';

interface SignInPermit {
  signature: string;
  message: string;
  from: string;
}

export function useLogin() {
  const wallet = useWallet();
  const [permit, updatePermit] = useState<SignInPermit | null>(null);
  const [error, updateError] = useState<any>(null);
  const [accessToken, updateAccessToken] = useState<string | null>(null);
  const [userDataByWallet, updateUserData] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!wallet.account) return;
      const { isUserExist, user } = await checkIsWalletRegistered(
        wallet.account
      );
      if (isUserExist) updateUserData(user);
      else updateUserData(null);
    }
    // 有钱包地址就查是不是已经注册过
    fetchData();
  }, [wallet.account]);

  const isRegistered = useMemo(() => Boolean(userDataByWallet), [
    userDataByWallet,
  ]);

  async function requestToSign() {
    if (wallet.status !== 'connected') {
      return;
    }
    if (!wallet.account) return;
    // const provider = new ethers.providers.Web3Provider(wallet.ethereum as any);
    // const signer = provider.getSigner();
    // signer.send

    const msgAboutToSign = `${MessageForLogin} — ${Date.now()}`;
    const signature: string = await (wallet.ethereum as any).request({
      method: 'personal_sign',
      params: [
        utils.hexlify(ethers.utils.toUtf8Bytes(msgAboutToSign)),
        wallet.account,
      ],
    });
    return {
      signature,
      message: msgAboutToSign,
      from: wallet.account,
    };
  }

  async function register(profile: any) {
    const permit = await requestToSign();
    const token = await registerUser(profile, permit);
    updateAccessToken(token);
  }

  async function loginWithSignature() {
    const permit = await requestToSign();
    try {
      const { data } = await BACKEND_CLIENT.post<{ data: string }>(
        '/auth/login',
        permit
      );
      if (data.data) updateAccessToken(data.data);
    } catch (error) {
      updateError(error);
    }
  }

  return {
    requestToSign,
    loginWithSignature,
    register,
    isRegistered,
    userDataByWallet,
    accessToken,
    walletError: wallet.error,
    caughtError: error,
    permit: permit,
  };
}
