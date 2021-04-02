import useSWR from 'swr';
import { axiosFetcher } from '../utils/swr.util';

export function useMediaNFT(tokenId: number) {
  const { data: backendData, error: backendError } = useSWR(
    `https://meta-nft-test.mttk.net/media/${tokenId}`,
    axiosFetcher
  );
  const { data: metadata, error: metadataError } = useSWR(
    backendData ? backendData.metadataURI : null,
    axiosFetcher
  );
  return {
    backendData,
    metadata,
    isLoading: !backendError && !backendData,
    isError: backendError,
    backendError,
    metadataError,
  };
}
