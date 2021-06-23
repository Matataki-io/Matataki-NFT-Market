import { Button } from '@geist-ui/react';
import React, { useCallback, useState, useEffect } from 'react';

import { useWallet } from 'use-wallet';
import { getProfileByWallet } from '../../backend/matatakiApi';
import { MatatakiUserProfile } from '../../types/MatatakiType';

export default function GetProfilePage() {
  const wallet = useWallet();
  const [profile, setProfile] = useState<null | MatatakiUserProfile>(null);

  const getProfile = useCallback(
    async (account: string) => {
      const result = await getProfileByWallet(account);
      setProfile(result);
    },
    [setProfile]
  );

  useEffect(() => {
    if (!wallet.account) return;
    getProfile(wallet.account);
  }, [wallet.account]);

  if (wallet.status !== 'connected') {
    return (
      <div>
        <Button onClick={() => wallet.connect('injected')}>
          Connect with MetaMask
        </Button>
      </div>
    );
  }

  return <div>{JSON.stringify(profile)}</div>;
}
