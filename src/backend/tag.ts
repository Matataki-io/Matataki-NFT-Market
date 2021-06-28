import client from './client';
import { Tag } from '../types/Tag';

/**
 * 获取 Tag
 * @returns
 */
const getTags = async (): Promise<{ data: Array<Tag> }> =>
  await client.get('/tag');

/**
 * 搜索标签
 * @param name
 * @returns
 */
const searchTags = async (name: string): Promise<{ data: Array<Tag> }> =>
  client.post('/tag/search', { name });

/**
 * 获取标签
 * @param name
 * @returns
 */
const getTag = (name: string): Promise<{ data: Tag }> =>
  client.get(`/tag/${name}`);

/**
 * 创建 Tag
 * @param name
 * @returns
 */
const createTag = (
  name: string
): Promise<{ data: { code: number; data: { name: string; id: number } } }> =>
  client.put(`/tag/${name}`);

/**
 * 删除 Tag
 * @param name
 * @returns
 */
const deleteTag = (
  name: string
): Promise<{ data: { code: number; data: boolean } }> =>
  client.delete(`/tag/${name}`);

export { getTags, searchTags, getTag, createTag, deleteTag };
