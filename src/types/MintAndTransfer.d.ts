import { BigNumberish } from '@ethersproject/bignumber';

type MintAndTransferParameters = {
  creator: string;
  data: {
    tokenURI: string;
    metadataURI: string;
    contentHash: string;
    metadataHash: string;
  };
  bidShares: {
    prevOwner: { value: BigNumberish };
    creator: { value: BigNumberish };
    owner: { value: BigNumberish };
  };
  to: string;
  sig: {
    deadline: BigNumberish;
    v: BigNumberish;
    r: string;
    s: string;
  };
};
