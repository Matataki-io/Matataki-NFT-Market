import { Gallery } from '../types/User.types';
import { default as BACKEND_CLIENT } from './client';
import { GeneralResponse } from '../types/Backend.types';

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
