import { Media, MediaMetadata } from '../types/Media.entity';
import { backendClient } from './client';
import { PaginationResult } from '../types/PaginationResult';
import axios from 'axios';

/**
 * 主要是为了 SSG 预先渲染
 */
export async function getHotMediaList(): Promise<Array<Media>> {
  const { data } = await backendClient.get<Array<Media>>('/media/hot');
  return data;
}

export async function getMediaList(
  page = 1,
  limit = 9
): Promise<PaginationResult<Media>> {
  const { data } = await backendClient.get<PaginationResult<Media>>('/media', {
    params: {
      page,
      limit,
    },
  });
  return data;
}

export async function getMediaById(id: string | number): Promise<Media> {
  const { data } = await backendClient.get<Media>(`/media/${id}`);
  return data;
}

export async function getMediaMetadata(url: string): Promise<MediaMetadata> {
  const { data } = await axios.get<MediaMetadata>(url);
  return data;
}
// 提交 media
export async function PostMedia({ txHash }: { txHash: string }): Promise<any> {
  return await backendClient.post('/media', {
    txHash,
  });
}
