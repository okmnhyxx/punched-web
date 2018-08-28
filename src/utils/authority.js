// use localStorage to store the authority info, which might be sent from server in actual project.
import { isNullOrUndefined } from './utils';

export function getAuthority() {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const auth = isNullOrUndefined(localStorage.getItem('antd-pro-authority')) ? 'guest' : localStorage.getItem('antd-pro-authority');
  console.log(" --- getAuthority: ", auth);
  return auth;
  // return localStorage.getItem('antd-pro-authority') || 'admin';
}

export function setAuthority(authority) {
  console.log(" --- setAuthority: ", authority);
  return localStorage.setItem('antd-pro-authority', authority);
}
