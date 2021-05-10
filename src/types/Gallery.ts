import { User } from './User.types';
import { GalleryJoinRequest } from './GalleryJoinRequest';

export type Gallery = {
  id: number;
  artists: User[];
  owner: User;
  joinRequests: GalleryJoinRequest;
};
