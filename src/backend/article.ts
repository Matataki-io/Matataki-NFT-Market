import { PaginationResult } from '../types/PaginationResult';
import { backendClient } from './client';
import { Article } from '../types/Article';
import { GeneralResponse, PaginationProps } from '../types/Backend.types';

/**
 * 获取文章
 * @param params
 * @returns
 */
export function getArticles(params: PaginationProps) {
  return backendClient.get<PaginationResult<Article>>(`/article`, { params });
}
/**
 * 获取文章信息
 * @param id
 * @returns
 */
export function getArticle(id: number) {
  return backendClient.get<GeneralResponse<Article>>(`/article/${id}`);
}
/**
 * 获取推荐文章
 * @returns
 */
export function getArticlesRecommed() {
  return backendClient.get<Article[]>(`/article/recommend`, { cache: true });
}
