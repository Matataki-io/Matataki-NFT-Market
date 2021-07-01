import {
  MatatakiUserProfile,
  MatatakiGetInfoByAddress,
} from '../types/MatatakiType';
import { GeneralResponse } from '../types/Backend.types';
import { matatakiApiClient } from './client';

// use it like `MatatakiApi.getProfileByWallet(..args)`
export const getProfileByWallet = async (
  wallet: string
): Promise<MatatakiUserProfile> => {
  const { data } = await matatakiApiClient.get<{
    code: number;
    message: string;
    data: MatatakiUserProfile;
  }>(`/api/user/getProfileByWallet/${wallet}`, { cache: true });
  return data.data;
};

/**
 * 根据 address 获取 token 信息
 * @param address
 * @returns
 */
export const getInfoByAddress = async ({
  address,
  chain,
}: {
  address: string;
  chain: string;
}) => {
  const { data } = await matatakiApiClient.get<
    GeneralResponse<MatatakiGetInfoByAddress[]>
  >(`/api/token/getInfoByAddress/${address}?chain=${chain}`, {
    cache: true,
  });
  console.log('data', data);
  return data;
};
