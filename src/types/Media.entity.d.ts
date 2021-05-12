import { User } from './User.types';
import { Tag } from './Tag';

export interface Media {
  id: number;

  owner?: User;

  creator?: User;

  isBurn: boolean;

  tokenURI: string;
  metadataURI: string;

  contentHash: string;
  metadataHash: string;
  tags: Tag[];

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
