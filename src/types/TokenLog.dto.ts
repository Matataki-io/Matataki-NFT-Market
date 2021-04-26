import { BidLog } from './Bid';
import { MediaLog } from './MediaLog';
import { User } from './User.types';

export class BidLogWithUser extends BidLog {
  matchedBidder?: User;
}

export class MediaLogWithUser extends MediaLog {
  fromUser?: User;
  toUser?: User;
}
