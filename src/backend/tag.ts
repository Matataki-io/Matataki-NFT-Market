import client from './client';
import { Tag } from '../types/Tag';

const getTags = async (): Promise<{ data: Array<Tag> }> =>
  await client.get('/tag');

const searchTags = async (name: string): Promise<{ data: Array<Tag> }> =>
  client.post('/tag/search', { name });

const getTag = (name: string): Promise<{ data: Tag }> =>
  client.get(`/tag/${name}`);

const createTag = (
  name: string
): Promise<{ data: { code: number; data: { name: string; id: number } } }> =>
  client.put(`/tag/${name}`);

const deleteTag = (
  name: string
): Promise<{ data: { code: number; data: boolean } }> =>
  client.delete(`/tag/${name}`);

export { getTags, searchTags, getTag, createTag, deleteTag };
