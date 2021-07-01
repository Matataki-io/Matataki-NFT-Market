import axios, { AxiosResponse } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const matatakiApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MATATAKI_API,
  timeout: 1000 * 60,
  headers: {},
  withCredentials: false,
});

type NextReqMethod =
  | 'HEAD'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | undefined;
const allowedMethods = ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export default async function handler(
  proxyReq: NextApiRequest,
  proxyRes: NextApiResponse
) {
  console.info('started: ', proxyReq.url);
  const { routes } = proxyReq.query;

  const method = proxyReq.method as NextReqMethod;
  if (!(method && allowedMethods.includes(method))) {
    return proxyRes.status(405).json({ message: 'Not supported method' });
  }

  // 增加 params 参数
  // console.info('routes', routes, proxyReq.query);

  let { chain } = proxyReq.query;
  let params: any = {};

  if (chain) {
    params['chain'] = chain;
  }

  const url = '/' + (routes as string[]).join('/');
  console.info('url', url);
  let response: AxiosResponse;
  const buildHeaders: Record<string, any> = {};
  if (proxyReq.headers['x-access-token']) {
    buildHeaders['x-access-token'] = proxyReq.headers['x-access-token'];
  }

  console.info('proxyReq.headers: ', proxyReq.headers.host);
  try {
    if (['GET', 'HEAD', 'DELETE'].includes(method)) {
      // Works with GET / HEAD / DELETE
      const lowerCased = method.toLowerCase() as 'get' | 'head' | 'delete';
      response = await matatakiApiClient[lowerCased](url, {
        headers: buildHeaders,
        data: proxyReq.body,
        params: params,
      });
    } else {
      // Works with PATCH / POST / PUT
      const lowerCased = method.toLowerCase() as 'patch' | 'post' | 'put';
      response = await matatakiApiClient[lowerCased](url, proxyReq.body, {
        headers: buildHeaders,
      });
    }
    // await for the result
    // console.info('request', request);
    // const response = await request;
  } catch (error) {
    console.error('error: ', error);
    if (axios.isAxiosError(error)) {
      return proxyRes
        .status(error.response?.status || 400)
        .json(error.response?.data);
    }
    return proxyRes
      .status(400)
      .json({ message: 'Unknown error happened when proxying matataki.' });
  }
  return proxyRes.status(response.status).json(response.data);
}
