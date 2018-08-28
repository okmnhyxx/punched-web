import { stringify } from 'qs';
import request from '../utils/request';

export async function doLogin(payload) {
  return request(`/sys/login?${stringify(payload)}`);
}


