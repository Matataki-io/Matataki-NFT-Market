import { MediaFactory } from './contracts/MediaFactory';
import { Decimal } from '../utils/Decimal';
import { providers, Signer, utils } from 'ethers';
import { currentContracts } from '../constant/contracts';
import { signMintWithSig } from './permitUtils';
import { Media } from './contracts/Media';
import type { MintAndTransferParameters } from '../types/MintAndTransfer';

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
  checkParameters(
    tokenURI,
    metadataURI,
    contentHash,
    metadataHash,
    creatorShare
  );
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

  try {
    const estimatedGas = await media.estimateGas.mint(mediaData, bidShare);
    return media.mint(mediaData, bidShare, { gasLimit: estimatedGas });
  } catch (error) {
    console.debug(
      'Gas estimate failed, trying eth_call to extract error',
      error
    );
    return new Promise((resolve, reject) => {
      media.callStatic.mint(mediaData, bidShare).catch(callError => {
        // if ()
        console.debug('Mint Call threw error', callError);
        let errorMessage: string;
        switch (callError.reason) {
          case 'Media: a token has already been created with this content hash':
            errorMessage =
              'This transaction will not succeed because a token has already been created with this content hash';
            break;
          case 'Media: specified uri must be non-empty':
            errorMessage =
              'This transaction will not succeed because Media URI is empty';
            break;
          default:
            errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`;
        }
        reject(errorMessage);
      });
    });
  }
}

export async function GenerateCreationSignature(
  tokenURI: string,
  metadataURI: string,
  contentHash: string,
  metadataHash: string,
  to: string,
  creatorShare: number,
  wallet: providers.JsonRpcSigner
): Promise<MintAndTransferParameters> {
  checkParameters(
    tokenURI,
    metadataURI,
    contentHash,
    metadataHash,
    creatorShare
  );
  const addressBook = currentContracts;
  if (!utils.isAddress(to)) {
    throw new Error('Bad `to`, please contact team ASAP.');
  }
  if (!addressBook) {
    throw new Error('No address book');
  }
  if (!addressBook.MEDIA) {
    throw new Error(`Media contract has not yet been deployed`);
  }
  const media = MediaFactory.connect(addressBook.MEDIA, wallet);

  console.log(
    'Minting by signing... ',
    tokenURI,
    contentHash,
    metadataURI,
    metadataHash
  );
  const { signer, sig } = await signMintWithSig(wallet, media, media.address, {
    contentHash: contentHash,
    metadataHash: metadataHash,
    creatorShare: Decimal.new(creatorShare).value,
    to,
  });

  return {
    creator: signer,
    data: {
      tokenURI: tokenURI,
      metadataURI: metadataURI,
      contentHash: '0x' + Buffer.from(contentHash, 'hex').toString('hex'),
      metadataHash: '0x' + Buffer.from(metadataHash, 'hex').toString('hex'),
    },
    bidShares: {
      // I fxxking hate Zora's Decimal lib
      prevOwner: { value: Decimal.new(0).value.toHexString() },
      creator: { value: Decimal.new(creatorShare).value.toHexString() },
      owner: { value: Decimal.new(100 - creatorShare).value.toHexString() },
    },
    to,
    sig,
  };
}

export function checkParameters(
  tokenURI: string,
  metadataURI: string,
  contentHash: string,
  metadataHash: string,
  creatorShare: number
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
}

// export async function sendPermitToMint(
//   media: Media,
//   data: MintAndTransferParameters
// ) {
//   const res = await media.mintAndTransferWithSig(
//     data.creator,
//     data.data,
//     data.bidShares,
//     data.to,
//     data.sig
//   );
// }
