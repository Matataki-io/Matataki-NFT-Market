import { Media, MediaMetadata } from '../types/Media.entity';
import { backendClient } from './client';
import { PaginationResult } from '../types/PaginationResult';
import axios from 'axios';
import { Ask } from '../types/Ask';
import { MediaLog } from '../types/MediaLog';
import { BidLog } from '../types/Bid';
import { GeneralResponse } from '../types/Backend.types';
import { MintAndTransferParameters } from '../types/MintAndTransfer';
import { Tag } from '../types/Tag';

export const backendSWRFetcher = (url: string) =>
  backendClient.get(url).then(res => res.data);

/**
 * 主要是为了 SSG 预先渲染
 */
export async function getHotMediaList(take = 10): Promise<Array<Media>> {
  const { data } = await backendClient.get<Array<Media>>('/media/hot', {
    params: { take },
  });
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
export async function PostMedia({
  txHash,
  tags,
}: {
  txHash: string;
  tags: string[];
}): Promise<any> {
  // bad habit to `any` bro
  return await backendClient.post('/media', {
    txHash,
    tags,
  });
}

export function sendToPublisherForPreview(
  GalleryId: number,
  data: {
    title: string;
    description: string;
    tokenURI: string;
    permitData: MintAndTransferParameters;
    tags: string[];
  }
) {
  return backendClient.post<GeneralResponse<{ msg: string }>>(
    `/media/gasfreeCreate/${GalleryId}`,
    data
  );
}
