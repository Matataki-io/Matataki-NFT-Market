import axios from 'axios';
import { MatatakiUserStat } from '../types/user.types';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MATATAKI_BACKEND,
});

export const getFullUrlOfFileInCDN = (location: string) =>
  `${process.env.NEXT_PUBLIC_MATATAKI_CDN}${location}`;

export async function fetchUserStat(
  jwtToken: string
): Promise<MatatakiUserStat> {
  const { data } = await client.get('/user/stats', {
    headers: { 'x-access-token': jwtToken },
  });
  return data.data;
}
