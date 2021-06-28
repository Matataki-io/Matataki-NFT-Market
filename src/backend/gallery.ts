import backendClient, { default as BACKEND_CLIENT } from './client';
import { GeneralResponse, PaginationProps } from '../types/Backend.types';
import { Gallery } from '../types/Gallery';
import {
  GalleryJoinRequest,
  GalleryJoinRequestStatus,
} from '../types/GalleryJoinRequest';
import { User } from '../types/User.types';

/**
 * 通过 ID 获取画廊信息
 * @param id
 * @returns
 */
export async function getGalleryId(id: number) {
  return await BACKEND_CLIENT.get(`/gallery/${id}`);
}

/**
 * 获取画廊
 * @param params
 * @returns
 */
export async function getGallery(params: PaginationProps): Promise<Gallery[]> {
  const { data } = await BACKEND_CLIENT.get<GeneralResponse<Gallery[]>>(
    `/gallery`,
    { params }
  );
  return data as any;
}

/**
 * 获取画廊艺术家
 * @param username
 * @returns
 */
export async function getGallerySubordinateArtists(
  username: string
): Promise<Gallery> {
  const { data } = await BACKEND_CLIENT.get<GeneralResponse<Gallery>>(
    `/user/@${username}/subordinateArtists`
  );
  return data as any;
}

/**
 * 创建画廊
 * @param gallery
 * @returns
 */
export async function createGallery(gallery: {
  name: string;
  cover: string;
  intro: string;
  artists: User[];
  owner: User;
}) {
  const { data } = await BACKEND_CLIENT.post<GeneralResponse<Gallery>>(
    `/gallery`,
    gallery
  );
  return data;
}

/**
 * 更新画廊
 * @param id
 * @param gallery
 * @returns
 */
export async function updateGallery(id: number, gallery: Gallery) {
  const { data } = await BACKEND_CLIENT.patch<GeneralResponse<Gallery>>(
    `/gallery/${id}`,
    gallery
  );
  return data;
}

/**
 * 创建画廊申请请求
 * @param gid
 * @returns
 */
export async function createGalleryJoinRequest(gid: number) {
  const data = await BACKEND_CLIENT.post(`/gallery/${gid}/request`);
  return data;
}

/**
 * 查询画廊申请请求
 * @param condition
 * @returns
 */
export async function findGalleryJoinRequest(
  condition: Partial<{
    id: number;
    artist: Partial<User>;
    gallery: Partial<Gallery>;
    status: Partial<GalleryJoinRequestStatus>;
  }>
) {
  const data = await BACKEND_CLIENT.post<GalleryJoinRequest[]>(
    '/gallery/request/find',
    condition
  );
  return data;
}

/**
 * 画廊申请请求
 * @param id
 * @param accept
 * @returns
 */
export async function updateGalleryJoinRequest(id: number, accept: boolean) {
  const data = await BACKEND_CLIENT.patch<GalleryJoinRequest[]>(
    `/gallery/request/${id}`,
    { accept }
  );
  return data;
}
