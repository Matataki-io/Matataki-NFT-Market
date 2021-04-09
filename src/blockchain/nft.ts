import { MediaFactory } from './contracts/MediaFactory';
import { Decimal } from '../utils/Decimal';
import { Signer } from 'ethers';
import { currentContracts } from '../constant/contracts';

/**
 * 铸 Media 币
 * @param tokenURI 内容的链接
 * @param metadataURI 元数据的链接
 * @param contentHash 内容文件的哈希
 * @param metadataHash 元数据文件的哈希
 * @param creatorShare 创造者的分成百分比数，数值范围 [0, 100]
 * @param wallet Web3 Provider 里的 Signer
 */
export async function mintMediaToken(
  tokenURI: string,
  metadataURI: string,
  contentHash: string,
  metadataHash: string,
  creatorShare: number,
  wallet: Signer
) {
  if (!tokenURI) {
    throw new Error('--tokenURI token URI is required');
  }
  if (!metadataURI) {
    throw new Error('--metadataURI metadata URI is required');
  }
  if (!contentHash) {
    throw new Error('--contentHash content hash is required');
  }
  if (!metadataHash) {
    throw new Error('--metadataHash content hash is required');
  }
  if (!creatorShare && creatorShare !== 0) {
    throw new Error('--creatorShare creator share is required');
  }
  if (creatorShare < 0 || creatorShare > 100) {
    throw new Error('--creatorShare creator share range is [0, 100]');
  }
  const addressBook = currentContracts;
  if (!addressBook) {
    throw new Error('No address book');
  }
  if (!addressBook.MEDIA) {
    throw new Error(`Media contract has not yet been deployed`);
  }

  const media = MediaFactory.connect(addressBook.MEDIA, wallet);

  console.log(
    'Minting NFT... ',
    tokenURI,
    contentHash,
    metadataURI,
    metadataHash
  );
  const mediaData = {
    tokenURI: tokenURI,
    metadataURI: metadataURI,
    contentHash: Uint8Array.from(Buffer.from(contentHash, 'hex')),
    metadataHash: Uint8Array.from(Buffer.from(metadataHash, 'hex')),
  };

  const bidShare = {
    prevOwner: Decimal.new(0),
    creator: Decimal.new(creatorShare),
    owner: Decimal.new(100 - creatorShare),
  };

  // just print log
  await media.estimateGas.mint(mediaData, bidShare).catch(error => {
    console.debug(
      'Gas estimate failed, trying eth_call to extract error',
      error
    );

    return media.callStatic.mint(mediaData, bidShare).catch(error => {
      console.debug('callStatic error: ', error);
      console.debug('callStatic error.reason: ', error.reason);
    });
  });

  return media.mint(mediaData, bidShare);
}
