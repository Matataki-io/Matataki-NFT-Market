import { Post } from '../types/post';
import { mockClient } from './client';

export async function getPosts(page: number, pageSize: number) {
  const resp = await mockClient.get<Post[]>('/post', {
    params: { page, pageSize },
  });
  return resp.data;
}

export async function getPost(id: number) {
  const resp = await mockClient.get<Post>(`/post/${id}`);
  return resp.data;
}
