import { Media } from '../blockchain/contracts/Media';
import { BACKEND_CLIENT } from '../constant';
import { PaginationResult } from '../types/PaginationResult';

export async function listMedias({ page = 1, limit = 9 }) {
  const { data } = await BACKEND_CLIENT.get<PaginationResult<Media>>('/media', {
    params: { page, limit },
  });
  return data;
}

/**
 * 主要是为了 SSG 预先渲染
 */
export async function listHotMedia() {
  const { data } = await BACKEND_CLIENT.get<Media[]>('/media/hot');
  return data;
}

export async function getMedia(id: number) {
  const { data } = await BACKEND_CLIENT.get<Media>(`/media/${id}`);
  return data;
}
