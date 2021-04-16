/// <reference types="next" />
/// <reference types="next/types/global" />

interface NFTFiedlsStringValueProps {
  stringValue: string;
}

interface NFTFiedlsProps {
  low: NFTFiedlsStringValueProps;
  stream: NFTFiedlsStringValueProps;
  medium: NFTFiedlsStringValueProps;
  high: NFTFiedlsStringValueProps;
  thumbnail: NFTFiedlsStringValueProps;
}

interface NFTContentProps {
  low: string;
  stream: string;
  medium: string;
  high: string;
  thumbnail: string;
}

export interface NFTProps {
  id?: number;
  type?: string;
  fields?: NFTFiedlsProps;
  content?: NFTContentProps;
  title?: string;
  owner: any;
  creator: any;
}
