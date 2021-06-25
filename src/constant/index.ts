import axios from 'axios';

export const SUPPORTED_MIME_TYPES = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'audio/mp4',
  'audio/mpeg',
  'audio/mp3',
  'audio/vnd.wav',
  'audio/wav',
  'audio/vnd.wave',
  'audio/wave',
  'audio/x-wav',
  'text/markdown',
  'text/x-markdown', // .md
  'text/plain', // .txt
  'video/mp4', // mp4
  'image/vnd.adobe.photoshop',
  'application/pdf',
  'application/postscript',
];

export const typeAndMime: { [key: string]: string } = {
  image: 'image/jpeg, image/png, image/gif',
  video: 'video/mp4, video/quicktime',
  audio:
    'audio/mpeg, audio/mp3, audio/vnd.wav, audio/wav, audio/vnd.wave, audio/wave, audio/x-wav',
  text: 'text/markdown, text/x-markdown, text/plain',
  file: 'image/vnd.adobe.photoshop, application/pdf, application/postscript',
  url: '',
};
export enum MetadataVersion {
  Apr2021 = 'meta-nft-20210401',
}

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const currentChainId = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID || 97
) as ChainId;

export const LATEST_METADATA_VERSION = MetadataVersion.Apr2021;

const MegaByte = 1024 * 1024;
export const MAX_FILE_SIZE = 10 * MegaByte;

export const BACKEND_CLIENT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
});

export enum UserRole {
  Collector = 'COLLECTOR',
  Artist = 'ARTIST',
  SuperAdmin = 'SUPER_ADMIN',
}

export const MINUTE = 1000 * 60;
export const AppName = 'VICKREY NFT';
export const MessageForLogin = `${AppName} uses this cryptographic signature in place of a password, verifying that you are the owner of this Ethereum address`;
