import { stringify } from 'qs';
import request from '../utils/request';

export async function doLogin(payload) {
  return request(`/punched/sys/login?${stringify(payload)}`);
}


