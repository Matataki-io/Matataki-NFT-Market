import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie } from '../utils/cookie';
import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer,
} from 'axios-extensions';

const options = {
  enabledByDefault: false,
};

const backendClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  timeout: 1000 * 60,
  withCredentials: false,
  headers: { 'Cache-Control': 'no-cache' },
  adapter: throttleAdapterEnhancer(
    cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter, options)
  ),
});

export const matatakiApiClient = axios.create({
  baseURL: '/api/matataki/',
  timeout: 1000 * 60,
  withCredentials: false,
  headers: { 'Cache-Control': 'no-cache' },
  adapter: throttleAdapterEnhancer(
    cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter, options)
  ),
});

export const apiClient = axios.create({
  timeout: 1000 * 60,
  withCredentials: false,
  headers: { 'Cache-Control': 'no-cache' },
  adapter: throttleAdapterEnhancer(
    cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter, options)
  ),
});

// Just copy from matataki-fe
backendClient.interceptors.request.use(
  config => {
    let token = getCookie('token');
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

backendClient.interceptors.response.use(
  response => {
    // if(loadingInstance) loadingInstance.close();
    return response;
  },
  error => {
    // loadingInstance.close()
    console.log(error.message);

    if (error.message.includes('status code 401')) {
      console.error('登录状态异常,请重新登录');
    }
    // 超时处理
    if (error.message.includes('timeout')) {
      console.log('请求超时');
    }
    if (error.message.includes('Network Error')) {
      console.error('Network Error');
    }
    return Promise.reject(error);
  }
);

export default backendClient;
export { backendClient };
