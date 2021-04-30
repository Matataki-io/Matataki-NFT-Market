export type RelatedMedia = {
  id: number;
  isBurn: boolean;
  tokenURI: string;
  metadataURI: string;
  contentHash: number;
  metadataHash: number;
  title: string;
  description: string;
  creationTx: number;
  askIds: number[];
  bidLogIds: number[];
  tokenLogsIds: number[];
};

export type Tag = {
  id: number;
  name: string;
  relatedMedias?: RelatedMedia[] | undefined;
};
