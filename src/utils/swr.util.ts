import client from '../api/index';

export const axiosFetcher = (url: string) =>
  client.get(url).then(res => res.data);
