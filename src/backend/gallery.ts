import backendClient, { default as BACKEND_CLIENT } from './client';
import { GeneralResponse, PaginationProps } from '../types/Backend.types';
import { Gallery } from '../types/Gallery';

export async function getGalleryUsers(
  params: PaginationProps
): Promise<Gallery[]> {
  const { data } = await BACKEND_CLIENT.get<GeneralResponse<Gallery[]>>(
    `/gallery`,
    { params }
  );
  return data as any;
}
export async function getGallerySubordinateArtists(
  username: string
): Promise<Gallery> {
  const { data } = await BACKEND_CLIENT.get<GeneralResponse<Gallery>>(
    `/user/@${username}/subordinateArtists`
  );
  return data as any;
}

export async function createGalleryJoinRequest(gid: number) {
  const { data } = await BACKEND_CLIENT.post(`/gallery/${gid}/request`);
  return data;
}
