import { PaginationResult } from '../types/PaginationResult';
import { backendClient } from './client';
import { Article } from '../types/Article';
import { GeneralResponse, PaginationProps } from '../types/Backend.types';

export function getArticles(params: PaginationProps) {
  return backendClient.get<PaginationResult<Article>>(`/article`, { params });
}
export function getArticle(id: number) {
  return backendClient.get<GeneralResponse<Article>>(`/article/${id}`);
}
