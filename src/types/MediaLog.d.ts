import { EventAt } from './EventAt';
import { Media } from './Media.entity';

export enum MediaActionType {
  Approval = 'Approval',
  Transfer = 'Transfer',
}

export class MediaLog {
  id: number;

  type: MediaActionType;

  at: EventAt;

  media: Media;

  mediaId: number;

  from: string;

  to: string;
}
