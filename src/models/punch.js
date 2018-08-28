import { routerRedux } from 'dva/router';
import { message } from 'antd/lib/index';
import { queryPunchList, queryPunchInfo, deletePunch, activePunch, submitPunchForm } from '../services/api-punch';
import store from '../index';
import { checkHasError } from '../utils/request';
import { fetchDefaultPaginationItem } from '../utils/utils';

export default {
  namespace: 'punch',

  state: {
    listData: {
      list: [],
      pagination: {
        ...fetchDefaultPaginationItem(),
      },
    },
  },

  effects: {
    *queryPunchList({ payload }, { call, put }) {

      console.debug( " --- payload: ", payload);
      const response = yield call(queryPunchList, payload);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'queryPunchList_',
        payload: response,
      });
    },

    *queryPunchInfo({ payload }, { call, put }) {

      const response = yield call(queryPunchInfo, payload.anchorId);
      const { dispatch } = store;
      if (!response.success) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      yield put({
        type: 'queryPunchInfo_',
        payload: response,
      });
    },

    *deletePunch({ payload, callback }, { call, put }) {
      const response = yield call(deletePunch, payload);
      yield put({
        type: 'deletePunch_',
        payload: response,
      });

      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },

    *activePunch({ payload, callback}, { call, put }) {
      const response = yield call(activePunch, payload);
      yield put({
        type: 'activePunch_',
        payload: response,
      });
      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },

    *submitPunchForm({ payload }, { call, put }) {
      const response = yield call(submitPunchForm, payload);
      const { dispatch } = store;
      if (!response.success) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      yield put({
        type: 'submitPunchForm_',
        payload: response,
      });
      message.success('提交成功');
    },

  },

  reducers: {
    queryPunchList_(state, action) {

      return {
        ...state,
        // list: action.payload.data,
        listData: action.payload.data,
      };
    },
    queryPunchInfo_(state, action) {
      return {
        ...state,
        anchorInfo: action.payload.data,
      };
    },
    deletePunch_(state) {
      return {
        ...state,
      };
    },
    activePunch_(state) {
      console.log(" --- activePunch_: ", state);
      return {
        ...state,
      };
    },
    submitPunchForm_(state) {
      return {
        ...state,
      };
    },
  },
}
