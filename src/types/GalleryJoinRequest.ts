import { User } from './User.types';
import { Gallery } from './Gallery';

export enum GalleryJoinRequestStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
}

export type GalleryJoinRequest = {
  id: number;
  artist: User;
  gallery: Gallery;
  status: GalleryJoinRequestStatus;
};
