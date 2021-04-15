import useSWR from 'swr';
import { backendSWRFetcher } from '../backend/media';
import { axiosFetcher } from '../utils/swr.util';

export function useMediaData(post?: {
  id: number;
  backendData: any;
  metadata: {
    description: string;
    name: string;
    mimeType: string;
  };
}) {
  const { data: backendData, error: backendError } = useSWR(
    post ? `/media/${post.id}` : null,
    backendSWRFetcher,
    {
      initialData: post?.backendData,
    }
  );
  const { data: metadata, error: metadataError } = useSWR(
    post && backendData ? backendData.metadataURI : null,
    axiosFetcher,
    { initialData: post?.metadata }
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
