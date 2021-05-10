import { PaginationResult } from '../types/PaginationResult';
import { backendClient } from './client';
import { Article } from '../types/Article';
import { GeneralResponse } from '../types/Backend.types';

export interface getArticlesProps {
  page: number;
  limit: number;
}

export function getArticles(params: getArticlesProps) {
  return backendClient.post<PaginationResult<Article>>(`/article`, params);
}
export function getArticle(id: number) {
  return backendClient.get<GeneralResponse<Article>>(`/article/${id}`);
}
