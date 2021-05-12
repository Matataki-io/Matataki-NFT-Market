import { User } from './User.types';
import { GalleryJoinRequest } from './GalleryJoinRequest';
import type { About } from './About';

export type Gallery = {
  id: number;
  name: string;
  cover: string;
  intro: string;
  artists: User[];
  owner: User;
  joinRequests: GalleryJoinRequest;

  about: About;
};
