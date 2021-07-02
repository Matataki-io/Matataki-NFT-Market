import { useEffect, useState } from 'react';
import { getInfoByAddress } from '../backend/matatakiApi';
import { ZERO_ADDRESS } from '../constant/index';
import { MatatakiGetInfoByAddress } from '../types/MatatakiType.d';

export default function useTokenInMatataki(address: string) {
  // token info in matataki
  const [tokenMatataki, setTokenMatataki] = useState<MatatakiGetInfoByAddress>(
    {} as MatatakiGetInfoByAddress
  );

  // token 信息 in matataki
  const tokenInMatataki = async (address: string) => {
    if (!address) return;
    if (address === ZERO_ADDRESS) return;
    try {
      const res = await getInfoByAddress({ address: address, chain: 'bsc' });
      if (res.code === 0 && res.data.length) {
        setTokenMatataki(res.data[0]);
      } else {
        setTokenMatataki({} as MatatakiGetInfoByAddress);
      }
    } catch (e) {
      console.log(e);
      setTokenMatataki({} as MatatakiGetInfoByAddress);
    }
  };

  useEffect(() => {
    tokenInMatataki(address);
  }, [address]);

  return {
    tokenMatataki,
  };
}
