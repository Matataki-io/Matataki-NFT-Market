import { User } from './User.types';
import { GalleryJoinRequest } from './GalleryJoinRequest';
import { Media } from './Media.entity';

export type Gallery = {
  id: number;
  name: string;
  cover: string;
  intro: string;
  artists: User[];
  owner: User;
  media: Media[];
  joinRequests: GalleryJoinRequest;
};
