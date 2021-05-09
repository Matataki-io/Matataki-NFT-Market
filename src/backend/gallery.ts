import backendClient, { default as BACKEND_CLIENT } from './client';
import { GeneralResponse } from '../types/Backend.types';
import { Gallery } from '../types/Gallery';

export async function getGalleryUsers(): Promise<Gallery[]> {
  const { data } = await BACKEND_CLIENT.get<GeneralResponse<Gallery[]>>(
    `/gallery`
  );
  return data.data;
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
