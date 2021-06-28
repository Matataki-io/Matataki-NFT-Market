import { Media, MediaMetadata } from '../types/Media.entity';
import client, { backendClient } from './client';
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

/**
 * 获取 media 列表
 * @param page
 * @param limit
 * @param order
 * @returns
 */
export async function getMediaList(
  page = 1,
  limit = 9,
  order = 'DESC'
): Promise<PaginationResult<Media>> {
  const { data } = await backendClient.get<PaginationResult<Media>>('/media', {
    params: {
      page,
      limit,
      order,
    },
    cache: true,
  });
  return data;
}

/**
 * 通过 ID 获取 Media 信息
 * @param id
 * @returns
 */
export async function getMediaById(id: string | number): Promise<Media> {
  const { data } = await backendClient.get<Media>(`/media/${id}`);
  return data;
}

/**
 * 获取 Media meta 信息
 * @param url
 * @returns
 */
export async function getMediaMetadata(url: string): Promise<MediaMetadata> {
  const { data } = await axios.get<MediaMetadata>(url);
  return data;
}
// 提交 media
export async function PostMedia({
  txHash,
  tags,
  gallery,
  id,
}: {
  txHash: string;
  tags: string[];
  gallery?: number;
  id?: number;
}): Promise<any> {
  // bad habit to `any` bro
  return await backendClient.post('/media', {
    txHash,
    tags,
    gallery,
    id,
  });
}

/**
 * 发送 NFT 到画廊
 * @param GalleryId
 * @param data
 * @returns
 */
export function sendToPublisherForPreview(
  GalleryId: number,
  data: {
    title: string;
    description: string;
    tokenURI: string;
    permitData: MintAndTransferParameters;
    tags: string[];
    gallery: number;
  }
) {
  return backendClient.post<GeneralResponse<{ msg: string }>>(
    `/media/gasfreeCreate/${GalleryId}`,
    data
  );
}

/**
 * 校验媒体是否存在
 * @param params
 * @returns
 */
export async function isMediaContentExisted(params: { contentHash: string }) {
  return await client.get<
    GeneralResponse<{
      data: { isExist: boolean };
      code: number;
    }>
  >(`/media/utils/isContentExisted`, { params });
}

/**
 * 获取画廊发布的 Media
 * @param params
 * @returns
 */
export function mediaGasfreeCreateForPublisher(params: { gid: number }) {
  return backendClient.get<GeneralResponse<any>>(
    `/media/gasfreeCreate/forPublisher`,
    { params }
  );
}

/**
 * 获取 media
 * @param data
 * @returns
 */
export function mediaSearch(data: { gallery: number; relations: string[] }) {
  return backendClient.post<GeneralResponse<Media[]>>(`/media/search`, data);
}
