import type { MediaToScreen } from './MediaToScreen';
import { UserRole } from '../constant';
import { Tag } from './Tag';
import { Gallery } from './Gallery';
import { GalleryJoinRequest } from './GalleryJoinRequest';
import { Media } from './Media.entity';

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
  // topArtist 使用 Media[]， 其他用 number[]
  createdMedia: number[] | Media[];
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

  about: About;

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
  about: {
    description: string;
    banner: string;
    bannerDescription: string;
    telegram: string;
    twitter: string;
    medium: string;
    facebook: string;
    discord: string;
    email: string;
  };
  presentations?: string[];
  artworks?: string[];
}

export type MintAndTransferParameters = {
  creator: string;
  data: {
    tokenURI: string;
    metadataURI: string;
    contentHash: string;
    metadataHash: string;
  };
  bidShares: {
    prevOwner: { value: BigNumberish };
    creator: { value: BigNumberish };
    owner: { value: BigNumberish };
  };
  to: string;
  sig: {
    deadline: BigNumberish;
    v: BigNumberish;
    r: string;
    s: string;
  };
};

export interface MediaToScreen {
  id: number;
  creator: User;
  publisher: User;
  title: string;
  description: string;
  tokenURI: string;
  permitData: MintAndTransferParameters;
  tags: Tag[];
  isPublished: Boolean;
}

export interface BindMatataki {
  isMatatakiBinded: boolean;
  isFanPiaoIssued: boolean;
}

export interface UpgradeToArtist {
  isAccountUpgraded: boolean;
}
