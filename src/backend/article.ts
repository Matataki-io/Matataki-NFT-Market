import { PaginationResult } from '../types/PaginationResult';
import { backendClient } from './client';

export interface getArticlesProps {
  page: number;
  limit: number;
}

export function getArticles(params: getArticlesProps) {
  return backendClient.post<PaginationResult<any>>(`/article`, params);
}
export function getArticle(id: number) {
  return backendClient.get<PaginationResult<any>>(`/article/${id}`);
}
