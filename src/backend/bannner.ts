import BACKEND_CLIENT from './client';
import type { Banner } from '../types/banner';

/**
 * 获取 Banner
 * @returns
 */
export function getBanners() {
  return BACKEND_CLIENT.get<Banner[]>(`/banner`, { cache: true });
}
