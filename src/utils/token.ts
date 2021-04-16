import { ZERO_ADDRESS } from '../constant';
import { currentContracts } from '../constant/contracts';
import { Ask } from '../types/Ask';
import { MediaLog } from '../types/MediaLog';

export const getTokenOnScan = (tokenId: number | string) =>
  `${process.env.NEXT_PUBLIC_SCAN_PREFIX}/token/${currentContracts?.MEDIA}?a=${tokenId}`;

export function isMediaTokenLog(event: Ask | MediaLog): event is MediaLog {
  return event.type.slice(3) !== 'Ask';
}
export function isMintEvent(event: Ask | MediaLog): event is MediaLog {
  return isMediaTokenLog(event) && event.from === ZERO_ADDRESS;
}
