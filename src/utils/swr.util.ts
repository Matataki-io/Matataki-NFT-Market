import axios from 'axios';

export const axiosFetcher = (url: string) =>
  axios.get(url).then(res => res.data);
