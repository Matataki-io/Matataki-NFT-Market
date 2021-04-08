import useSWR from 'swr';
import { axiosFetcher } from '../utils/swr.util';

export function useMediaNFT(tokenId: number) {
  const { data: backendData, error: backendError } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/media/${tokenId}`,
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
