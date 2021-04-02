import { currentContracts } from '../constant/contracts';

export const getTokenOnScan = (tokenId: number | string) =>
  `${process.env.NEXT_PUBLIC_SCAN_PREFIX}/token/${currentContracts?.MEDIA}?a=${tokenId}`;
