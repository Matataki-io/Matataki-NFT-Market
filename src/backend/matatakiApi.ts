import { MatatakiUserProfile } from '../types/MatatakiType';
import { matatakiApiClient } from './client';

export class MatatakiApi {
  static async getProfileByWallet(
    wallet: string
  ): Promise<MatatakiUserProfile> {
    const { data } = await matatakiApiClient.get<{
      code: number;
      message: string;
      data: MatatakiUserProfile;
    }>(`/api/user/getProfileByWallet/${wallet}`);
    return data.data;
  }
}
