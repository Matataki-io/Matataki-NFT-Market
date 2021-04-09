import { Media } from '../blockchain/contracts/Media';

export type MatatakiUserStat = {
  id: number;
  username: string;
  platform: string;
  email: string;
  nickname: string;
  avatar: string;
  create_time: string;
  introduction: string;
  accept: number;
  source: string;
  reg_ip: string;
  last_login_time: string;
  is_recommend: number;
  referral_uid: number;
  last_login_ip: string;
  level: number;
  status: number;
  banner: null;
  accounts: number;
  follows: number;
  fans: number;
  articles: number;
  drafts: number;
  supports: number;
  points: number;
  referral_amount: number;
  bookmarks: number;
};

export interface User {
  id: number;
  address: string;
  username: string;
  avatar: string;
  nickname: string;
  bio: string;
  // returns the ids of media
  createdMedia: number[];
  ownedMedia: number[];
}
