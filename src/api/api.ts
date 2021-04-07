import { AxiosResponse } from 'axios';
import client from './index';

// =========== MTK ===========
// 上传媒体
export function storageUploadToIpfs() {
  return client.put('storage/uploadToIpfs');
}
// 上传媒体 提供组件 action 使用
export const storageUploadToIpfsUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/storage/uploadToIpfs`;

export type MediaListItem = {
  id: number;
  isBurn: boolean;
  tokenURI: string;
  metadataURI: string;
  contentHash: string;
  metadataHash: string;
  creationTx: string;
};

export async function getMediaList(): Promise<
  AxiosResponse<Array<MediaListItem>>
> {
  return await client.get('/media');
}

export async function getMediaById(
  id: string
): Promise<AxiosResponse<MediaListItem>> {
  return await client.get(`/media/${id}`);
}

export type MediaMetadata = {
  description: string;
  mimeType: string;
  name: string;
  version: string;
};

export async function getMediaMetadata(
  url: string
): Promise<AxiosResponse<MediaMetadata>> {
  return await client.get(url);
}
