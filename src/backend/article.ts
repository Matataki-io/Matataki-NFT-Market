import { Article } from '../types/article';
import { PaginationResult } from '../types/PaginationResult';
import { localClient as client } from './client';

export async function getArticles(
  page: number,
  limit: number
): Promise<PaginationResult<Article>> {
  const resp = await client.get<PaginationResult<Article>>('/article', {
    params: { page, limit },
  });
  return resp.data;
}

export async function getArticle(id: number): Promise<Article> {
  const resp = await client.get<Article>(`/article/${id}`);
  return resp.data;
}
