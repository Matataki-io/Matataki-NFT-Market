import { useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ethers, utils } from 'ethers';
import { default as BACKEND_CLIENT } from '../backend/client';
import { MessageForLogin } from '../constant';
import {
  checkIsWalletRegistered,
  registerUser,
  loginWithPermit,
} from '../backend/user';
import { User } from '../types/User.types';

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
  const [registeredLoading, setRegisteredLoading] = useState<boolean>(false); // 查询注册 Loading

  useEffect(() => {
    async function fetchData() {
      if (!wallet.account) return;
      setRegisteredLoading(true);
      try {
        const { isUserExist, user } = await checkIsWalletRegistered(
          wallet.account
        );
        if (isUserExist) updateUserData(user);
        else updateUserData(null);
      } catch (e) {
        console.error('e', e);
        updateUserData(null);
      } finally {
        setRegisteredLoading(false);
      }
    }
    // 有钱包地址就查是不是已经注册过
    fetchData();
    console.log('wallet.account', wallet.account);
  }, [wallet]);

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
    const token = await registerUser(profile, permit!);
    updateAccessToken(token);
  }

  async function loginWithSignature() {
    try {
      const permit: SignInPermit | undefined = await requestToSign();
      if (permit) {
        const data = await loginWithPermit(permit);
        if (data) updateAccessToken(data);
      } else {
        throw new Error('not permit');
      }
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
    registeredLoading,
  };
}
