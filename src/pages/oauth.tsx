import { Text, User } from '@geist-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { MatatakiUserStat } from '../types/user.types';
import {
  fetchUserStat,
  getFullUrlOfFileInCDN,
} from '../utils/matataki.service';

export default function HandleOAuth() {
  const router = useRouter();

  const [token, updateToken] = useState<string | null>(null);
  const [userProfile, updateProfile] = useState<MatatakiUserStat | null>(null);
  const [errorMsg, updateError] = useState<any>(null);

  useEffect(() => {
    if (router.query?.token) {
      updateToken(router.query?.token as string);
    }
  }, [router]);

  async function tryToFetchUserData(token: string) {
    if (!token) return;
    try {
      const result = await fetchUserStat(token);
      updateProfile(result);
      updateError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401)
          updateError('Server says it is a bad token');
      }
      console.error('error when tryToFetchUserData: ', error);
    }
  }

  useEffect(() => {
    tryToFetchUserData(token as string);
  }, [token]);

  if (errorMsg)
    return (
      <div className='oauth-error'>
        <Text h2>Sorry</Text>
        <Text>
          There&lsquo;s problem when connecting to Matataki. Reason:{' '}
          <code>{errorMsg}</code>. Please contact the team asap.
        </Text>
      </div>
    );
  if (userProfile)
    return (
      <div className='oauth-success' style={{ textAlign: 'center' }}>
        <Text h2>Welcome back</Text>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          You are logging as
          <User
            src={getFullUrlOfFileInCDN(userProfile.avatar)}
            name={userProfile.nickname || userProfile.username}
          />
        </div>
      </div>
    );
  return (
    <div className='handleOAuth'>
      <Text h2>Callback received</Text>
      <Text>Validating token now...</Text>
    </div>
  );
}
