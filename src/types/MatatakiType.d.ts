export type MatatakiUserProfile = {
  username: string;
  nickname: string;
  avatar: string;
  introduction: string;
  banner: string;
  follows: number;
  fans: number;
  is_follow: boolean;
  create_time: string;
  is_recommend: number;
  status: number;
  siteLink: string;
};

export interface MatatakiGetInfoByAddress {
  id: number;
  chain: string;
  tokenId: number;
  contractAddress: string;
}
