import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin } from '../services/api';
import { doLogin } from '../services/api-login';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery, isNullOrUndefined } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {

      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect && redirect !== "/") {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      console.log(" --- window.location.href: ")
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },


    *doLogin({ payload }, { call, put }) {
      const response = yield call(doLogin, payload);
      yield put({
        type: 'doChangeLoginStatus',
        payload: {
          ...response,
          status: payload.success ? "ok" : "error",
          loginType: payload.type,
        },
      });

      // Login successfully
      if (response.success) {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        console.log(" --- urlParams: ", urlParams);
        console.log(" --- params: ", params);
        console.log(" --- redirect: ", redirect);
        if (redirect && redirect !== "/") {
          redirect = (redirect.startsWith("/") && redirect !== "/" ? `#${redirect}` : redirect);
          const redirectUrlParams = new URL(redirect);
          console.log(" --- new URL(redirect)", redirectUrlParams);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#/')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *doLogout(_, { put }) {
      yield put({
        type: 'doChangeLoginStatus',
        payload: {
          status: false,
          data: 'guest',
        },
      });
      reloadAuthorized();
      console.log(" --- window.location.href: ", window.location.href);
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            // redirect: window.location.href,
            redirect: window.location.hash,
          }),
        })
      );
    },

  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },

    doChangeLoginStatus(state, { payload }) {
      setAuthority(payload.data);
      return {
        ...state,
        status: payload.success ? "ok" : "error",
        type: payload.loginType,
      };
    },

  },
};
