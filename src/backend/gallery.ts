import backendClient, { default as BACKEND_CLIENT } from './client';
import { GeneralResponse, PaginationProps } from '../types/Backend.types';
import { Gallery } from '../types/Gallery';
import {
  GalleryJoinRequest,
  GalleryJoinRequestStatus,
} from '../types/GalleryJoinRequest';
import { User } from '../types/User.types';

export async function getGallery(params: PaginationProps): Promise<Gallery[]> {
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

export async function createGallery(gallery: {
  name: string;
  cover: string;
  intro: string;
  artists: User[];
  owner: User;
}) {
  const { data } = await BACKEND_CLIENT.post<GeneralResponse<Gallery>>(
    `/gallery`,
    gallery
  );
  return data;
}

export async function createGalleryJoinRequest(gid: number) {
  const { data } = await BACKEND_CLIENT.post(`/gallery/${gid}/request`);
  return data;
}

export async function findGalleryJoinRequest(
  condition: Partial<{
    id: number;
    artist: User;
    gallery: Gallery;
    status: GalleryJoinRequestStatus;
  }>
) {
  const { data } = await BACKEND_CLIENT.post<GalleryJoinRequest[]>(
    '/gallery/request/find',
    condition
  );
  return data;
}

export async function updateGalleryJoinRequest(id: number, accept: boolean) {
  const { data } = await BACKEND_CLIENT.patch<GalleryJoinRequest[]>(
    `/gallery/request/${id}`,
    { accept }
  );
  return data;
}

export async function updateGallery(id: number, g: Partial<Gallery>) {
  const { data } = await BACKEND_CLIENT.patch<any>(`/gallery/${id}`, g);
  return data;
}
