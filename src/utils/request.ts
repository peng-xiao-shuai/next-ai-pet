/*
 * @Author: peng-xiao-shuai
 * @Date: 2024-04-01 10:41:43
 * @LastEditors: peng-xiao-shuai
 * @LastEditTime: 2024-04-01 11:07:39
 * @Description:
 */
import { toast } from 'sonner';
import { objectToQueryString } from './string-transform';
import Cookie from 'js-cookie';
import { createDebounce } from './debounce-throttle';
import AppConfigEnv from './get-config';
import emitter from './bus';
const [debounce] = createDebounce();

let activeRequests = 0;

export const fetchRequest = async <T = any>(
  url: string,
  body?: Indexes | FormData,
  options: RequestInit = {}
) => {
  try {
    const token = Cookie.get('token');

    const headers: any = {
      'Content-Type': 'application/json', // 指定发送的数据类型为 JSON
      ...(options.headers || {}),
    };

    // 注意：当使用 FormData 时，不要设置 `Content-Type`。浏览器会自动设置正确的 `Content-Type: multipart/form-data` 和正确的 boundary。
    // 如果手动设置了，可能会导致服务器无法正确解析数据。
    if (body?.append) {
      delete headers['Content-Type'];
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const URL = AppConfigEnv.HOST + url;

    /**
     * get 请求拼接参数
     */
    if (options.method === 'GET') {
      url += objectToQueryString(body || {});
    }

    activeRequests++;

    const res = await fetch(URL, {
      method: 'POST',
      ...(options || {}),
      [options.method === 'GET' ? 'params' : 'body']: body?.append
        ? body
        : JSON.stringify(body || {}),
      headers,
    });

    const data: {
      code: number;
      message: string;
      result: T;
    } = await res.json();

    activeRequests--;

    /**
     * activeRequests = 0 网络请求资源空闲
     */
    if (activeRequests === 0) {
      emitter.emit('fetchIdle');
    }

    switch (data.code) {
      case 500:
      case 502:
      case 403:
      case 404:
      case 400:
      case 405:
        throw new Error(data.message || 'unknown exception');
    }

    return {
      ...data,
      result: (data.result || {}) as T,
    };
  } catch (err: any) {
    activeRequests--;
    console.log(url, '报错：', err);
    debounce(() => {
      toast(err.message);
    });
    throw new Error(err.message);
  }
};
