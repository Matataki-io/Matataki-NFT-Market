import { Article } from '../types/article';
import { mockClient } from './client';

export async function getArticles(
  page: number,
  limit: number
): Promise<Article[]> {
  const resp = await mockClient.get<Article[]>('/article', {
    params: { page, limit },
  });
  return resp.data;
}

export async function getArticle(id: number): Promise<Article> {
  const resp = await mockClient.get<Article>(`/article/${id}`);
  return resp.data;
}
