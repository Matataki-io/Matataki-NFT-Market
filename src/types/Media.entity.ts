import { User } from './user.types';

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
}
