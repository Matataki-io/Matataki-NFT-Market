import { BidLog } from './Bid.d';
import { MediaLog } from './MediaLog.d';
import { User } from './User.types';

export class BidLogWithUser extends BidLog {
  matchedBidder?: User;
}

export class MediaLogWithUser extends MediaLog {
  fromUser?: User;
  toUser?: User;
}

export function isBidLogWithUser(
  obj: BidLogWithUser | any
): obj is BidLogWithUser {
  return Boolean((obj as BidLogWithUser).bidder);
}

export function isMediaLogWithUser(
  obj: MediaLogWithUser | any
): obj is MediaLogWithUser {
  return Boolean((obj as MediaLogWithUser).to);
}
