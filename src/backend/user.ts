import { default as BACKEND_CLIENT } from './client';
import { PaginationResult } from '../types/PaginationResult';
import { User } from '../types/User.types';
import { setCookie } from '../utils/cookie';

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
  profile: { nickname: string; bio: string; username: string },
  permit: { signature: string; message: string }
) {
  const payload = {
    nickname: profile.nickname,
    bio: profile.bio,
    username: profile.username,
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
    nickname: string;
    bio: string;
    username: string;
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

export async function getUser(username: string) {
  const { data } = await BACKEND_CLIENT.get<User>(`/user/@${username}`);
  return data;
}
