import client from './client';

// =========== MTK ===========
// 上传媒体
export function storageUploadToIpfs() {
  return client.put('storage/uploadToIpfs');
}
// 上传媒体 提供组件 action 使用
export const storageUploadToIpfsUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/storage/uploadToIpfs`;
