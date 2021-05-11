import BACKEND_CLIENT from './client';
import type { Banner } from '../types/banner';

export function getBanners() {
  return BACKEND_CLIENT.get<Banner[]>(`/banner`);
}
