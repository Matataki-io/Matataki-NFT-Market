import { User } from './User.types';
import { GalleryJoinRequest } from './GalleryJoinRequest';

export type Gallery = {
  id: number;
  name: string;
  cover: string;
  intro: string;
  artists: User[];
  owner: User;
  joinRequests: GalleryJoinRequest;
};
