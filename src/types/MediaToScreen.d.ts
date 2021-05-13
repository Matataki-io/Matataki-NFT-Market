import type { User } from './User.types';
import type { MintAndTransferParameters } from './MintAndTransfer';

export interface MediaToScreen {
  id: number;
  creator: User;
  publisher: User;
  title: string;
  description: string;
  tokenURI: string;
  permitData: MintAndTransferParameters;
}
