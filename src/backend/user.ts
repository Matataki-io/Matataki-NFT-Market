import { default as BACKEND_CLIENT } from './client';
import { PaginationResult } from '../types/PaginationResult';
import { User, BindMatataki, UpgradeToArtist } from '../types/User.types';
import { BidLog } from '../types/Bid.d';
import { setCookie } from '../utils/cookie';
import { GeneralResponse } from '../types/Backend.types';

interface SignInPermit {
  signature: string;
  message: string;
  from?: string;
}

export async function loginWithPermit(permit: SignInPermit) {
  const { data } = await BACKEND_CLIENT.post<{ data: string }>(
    '/auth/login',
    permit
  );
  let token = data.data;
  setCookie('token', token, 1);
  return token;
}

/**
 * 检查钱包注册
 * @param wallet
 * @returns
 */
export async function checkIsWalletRegistered(wallet: string) {
  const { data } = await BACKEND_CLIENT.get<{
    isUserExist: boolean;
    user: User;
  }>(`/user/findByAddress/${wallet}`);
  return data;
}

/**
 * 注册用户
 * @param profile 注册的用户资料
 * @param permit 签名和信息
 * @returns 用户访问令牌
 */
export async function registerUser(
  profile: { nickname: string; bio: string; username: string; avatar: string },
  permit: { signature: string; message: string }
) {
  const payload = {
    nickname: profile.nickname,
    bio: profile.bio,
    username: profile.username,
    avatar: profile.avatar,
    signature: permit.signature,
    signingMessage: permit.message,
  };
  await BACKEND_CLIENT.post<{ isGood: boolean }>('/user', payload);
  const accessToken = await loginWithPermit(permit);
  return accessToken;
}
/**
 * 更新用户资料
 * @param payload 注册的用户资料
 * @returns 请求结果
 */
export async function updateUser(
  id: number,
  payload: {
    nickname?: string;
    bio?: string;
    username?: string;
    avatar?: string;
  }
) {
  return await BACKEND_CLIENT({
    method: 'patch',
    url: `/user/${id}`,
    data: payload,
  });
}

export async function listUsers({ page = 1, limit = 9 }) {
  const { data } = await BACKEND_CLIENT.get<PaginationResult<User>>('/user', {
    params: { page, limit },
  });
  return data;
}
// 用户 收藏家
export async function listUsersCollector() {
  const { data } = await BACKEND_CLIENT.get<GeneralResponse<User>>(
    '/user/collector'
  );
  return data.data;
}
// 用户 艺术家
export async function listUsersArtist() {
  const { data } = await BACKEND_CLIENT.get<GeneralResponse<User[]>>(
    '/user/artist'
  );
  return data.data;
}

/**
 * 获取用户信息
 * @param username
 * @returns
 */
export async function getUser(username: string) {
  const { data } = await BACKEND_CLIENT.get<User>(`/user/@${username}`);
  return data;
}

export async function getUserBids(username: string) {
  const { data } = await BACKEND_CLIENT.get<Array<BidLog>>(
    `/user/@${username}/bids`
  );
  return data;
}

/**
 * 获取用户的Tags
 * @param username
 * @returns
 */
export async function getUserTags(username: string) {
  const { data } = await BACKEND_CLIENT.get<User>(`/user/@${username}/tags`);
  return data;
}

/**
 * 获取用户关系
 * @param username
 * @param relation
 * @returns
 */
export async function getUserRelation(username: string, relation: string) {
  const { data } = await BACKEND_CLIENT.get<User>(
    `/user/@${username}/${relation}`
  );
  return data;
}
/**
 * top artist
 * @returns
 */
export async function userTopArtist() {
  return await BACKEND_CLIENT.get<GeneralResponse<User[]>>('/user/topArtist', {
    cache: true,
  });
}
/**
 * 推荐艺术家 Banner
 * @returns
 */
export async function userFeaturedArtistInBanner() {
  return await BACKEND_CLIENT.get<GeneralResponse<User[]>>(
    '/user/featuredArtistInBanner',
    { cache: true }
  );
}
/**
 * 推荐艺术家
 * @returns
 */
export async function userFeaturedArtist() {
  return await BACKEND_CLIENT.get<GeneralResponse<User[]>>(
    '/user/featuredArtist',
    { cache: true }
  );
}

/**
 * 查询 MTK 状态 Bind issued
 * @param address
 * @returns
 */
export async function userIsBindMatataki(address: string) {
  return await BACKEND_CLIENT.get<GeneralResponse<BindMatataki>>(
    `/user/isBindMatataki/${address}`
  );
}

/**
 * 请求升级为 artist
 * @returns
 */
export async function userUpgradeToArtist() {
  return await BACKEND_CLIENT.post<GeneralResponse<UpgradeToArtist>>(
    'user/matataki/upgradeToArtist'
  );
}
