import { BigNumberish, providers, Signer, utils } from 'ethers';
import type { Media } from './contracts/Media';

export function getDeadline(days: number) {
  //          Now            + sec + min + hour * days
  return Math.floor(Date.now() / 1000) + 3600 * 24 * days;
}

type MintAndTransferWithSig = {
  contentHash: string;
  metadataHash: string;
  creatorShare: BigNumberish;
  to: string;
};

export async function signMintWithSig(
  wallet: providers.JsonRpcSigner,
  media: Media,
  verifyingContract: string,
  data: MintAndTransferWithSig,
  nonce: BigNumberish
) {
  const deadline = getDeadline(365);
  const [signerWallet, chainId, contractName] = await Promise.all([
    wallet.getAddress(),
    wallet.getChainId(),
    media.name(),
  ]);
  const finalData = {
    ...data,
    // contentHash: '0x' + data.contentHash,
    // metadataHash: '0x' + data.metadataHash,
    contentHash: Uint8Array.from(Buffer.from(data.contentHash, 'hex')),
    metadataHash: Uint8Array.from(Buffer.from(data.metadataHash, 'hex')),
    nonce,
    deadline,
  };
  const result = await wallet._signTypedData(
    {
      name: contractName,
      version: '1',
      chainId,
      verifyingContract,
    },
    {
      MintWithSig: [
        { name: 'contentHash', type: 'bytes32' },
        { name: 'metadataHash', type: 'bytes32' },
        { name: 'creatorShare', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'to', type: 'address' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    finalData
  );
  const { r, s, v } = utils.splitSignature(result);
  return { sig: { r, s, v, deadline }, signer: signerWallet };
}
