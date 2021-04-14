import { EventAt } from './EventAt';
import { Media } from './Media.entity';

export enum BidActionType {
  BidCreated = 'BidCreated',
  BidFinalized = 'BidFinalized',
  BidRemoved = 'BidRemoved',
}

export class BidLog {
  id: number;

  status: BidActionType;

  at: EventAt;

  media: Media;

  mediaId: number;

  amount: string;
  currency: string;

  bidder: string;
  recipient: string;

  sellOnShare: string;
}
