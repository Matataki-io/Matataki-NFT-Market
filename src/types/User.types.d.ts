import type { MediaToScreen } from './MediaToScreen';
import { UserRole } from '../constant';
import { Tag } from './Tag';
import { Gallery } from './Gallery';
import { GalleryJoinRequest } from './GalleryJoinRequest';

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
  createdMedia: number[];
  ownedMedia: number[];
  /**
   * 是否为推荐的艺术家 (Featured artist)
   * 为 true 时会显示在艺术家字母排序列表里
   */
  isRecommendArtist: boolean;
  /**
   * 是否为艺术家页面 banner 推荐的艺术家
   */
  isFeaturedInBanner: boolean;

  /**
   * 是否为首页里推荐的艺术家
   */
  isTopArtist: boolean;
  verified: boolean;
  role: UserRole;
  waitingForScreen: MediaToScreen[];
  belongsTo: Gallery[];
  ownedGalleries: Gallery[];
  requestedJoinGallery: GalleryJoinRequest[];
  telegram: string;
  twitter: string;
  email: string;
  medium: string;
  facebook: string;
  tags: Array<Tag>;
}
