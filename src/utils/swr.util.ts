import client from '../backend/client';

export const axiosFetcher = (url: string) =>
  client.get(url).then(res => res.data);
