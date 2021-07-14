import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ethers, utils } from 'ethers';
import { default as BACKEND_CLIENT } from '../backend/client';
import { MessageForLogin } from '../constant';
import {
  checkIsWalletRegistered,
  registerUser,
  loginWithPermit,
  updateUser,
} from '../backend/user';
import { User } from '../types/User.types';
import { getCookie } from '../utils/cookie';

interface SignInPermit {
  signature: string;
  message: string;
  from: string;
}

export function useLogin() {
  const wallet = useWallet();
  const [caughtError, updateError] = useState<any>(null);
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
        if (isUserExist) {
          updateUserData(user);
          const token = getCookie('token');
          if (token) {
            updateAccessToken(token);
          }
        } else updateUserData(null);
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

  const requestToSign = useCallback(async () => {
    if (wallet.status !== 'connected') {
      throw new Error('Please connect to wallet');
    }

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
      from: wallet.account as string,
    };
  }, [wallet]);

  async function register(profile: any) {
    const signedLoginPermit = await requestToSign();
    const token = await registerUser(profile, signedLoginPermit);
    updateAccessToken(token);
    return token;
  }

  const loginWithSignature = useCallback(async () => {
    try {
      if (wallet.status !== 'connected') {
        await wallet.connect('injected');
      }
      const signedLoginPermit = await requestToSign();
      const data = await loginWithPermit(signedLoginPermit);
      if (data) updateAccessToken(data);
      return data;
    } catch (error) {
      updateError(error);
      console.log(error);
      return false;
    }
  }, [wallet, requestToSign]);

  // 查询用户最新状态
  // useEffect(() => {
  // async function fetchData() {
  //   if (!wallet.account) return;
  //   try {
  //     const { isUserExist, user } = await checkIsWalletRegistered(
  //       wallet.account
  //     );
  //     if (isUserExist) {
  //       updateUserData(user);
  //     } else updateUserData(null);
  //   } catch (e) {
  //     console.error('e', e);
  //     updateUserData(null);
  //   }
  // }

  // fetchData();
  // let time = setInterval(fetchData, 5000);
  // return () => clearInterval(time);
  // }, [wallet]);

  return {
    requestToSign,
    loginWithSignature,
    register,
    isRegistered,
    userDataByWallet,
    accessToken,
    walletError: wallet.error,
    caughtError,
    registeredLoading,
  };
}
