import client from './client';
import { Tag } from '../types/tag';

const getTags = (): Promise<Array<Tag>> => client.get('/tag');

const getTag = (name: string): Promise<Tag> => client.get(`/tag/${name}`);

const createTag = (
  name: string
): Promise<{ code: number; data: { name: string; id: number } }> =>
  client.put(`/tag/${name}`);

const deleteTag = (name: string): Promise<{ code: number; data: boolean }> =>
  client.delete(`/tag/${name}`);
