import { EventAt } from './EventAt';
import { Media } from './Media.entity';

export enum AskActionType {
  AskCreated = 'AskCreated',
  AskRemoved = 'AskRemoved',
}

export class Ask {
  id: number;

  type: AskActionType;

  at: EventAt;

  media: Media;

  mediaId: number;

  amount: string;
  currency: string;
}
