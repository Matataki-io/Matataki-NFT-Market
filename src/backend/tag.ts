import client from './client';
import { Tag } from '../types/tag';

const getTags = async (): Promise<{ data: Array<Tag> }> =>
  await client.get('/tag');

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

export { getTags, getTag, createTag, deleteTag };
