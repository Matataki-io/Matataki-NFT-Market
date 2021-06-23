import { MatatakiUserProfile } from '../types/MatatakiType';
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
