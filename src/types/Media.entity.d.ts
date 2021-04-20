import { User } from './User.types';

export interface Media {
  id: number;

  owner: User;

  creator: User;

  isBurn: boolean;

  tokenURI: string;
  metadataURI: string;

  contentHash: string;
  metadataHash: string;

  creationTx: string;
  title?: string; // user/@username/bids
  description: string;
}

export type MediaMetadata = {
  description: string;
  mimeType: string;
  name: string;
  version: string;
};
