import { routerRedux } from 'dva/router';
import { message } from 'antd/lib/index';
import { queryAnchorList, queryAnchorInfo, deleteAnchor, activeAnchor, submitAnchorForm } from '../services/apis-anchor';
import store from '../index';
import { checkHasError } from '../utils/request';

export default {
  namespace: 'anchor',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *queryAnchorList({ payload }, { call, put }) {

      const response = yield call(queryAnchorList, payload);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'queryAnchorList_',
        payload: response,
      });
    },

    *queryAnchorInfo({ payload }, { call, put }) {

      const response = yield call(queryAnchorInfo, payload.anchorId);
      const { dispatch } = store;
      if (!response.success) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      yield put({
        type: 'queryAnchorInfo_',
        payload: response,
      });
    },

    *deleteAnchor({ payload, callback }, { call, put }) {
      const response = yield call(deleteAnchor, payload);
      yield put({
        type: 'deleteAnchor_',
        payload: response,
      });

      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },

    *activeAnchor({ payload, callback}, { call, put }) {
      const response = yield call(activeAnchor, payload);
      yield put({
        type: 'activeAnchor_',
        payload: response,
      });
      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },

    *submitAnchorForm({ payload }, { call, put }) {
      const response = yield call(submitAnchorForm, payload);
      const { dispatch } = store;
      if (!response.success) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      yield put({
        type: 'submitAnchorForm_',
        payload: response,
      });
      message.success('提交成功');
    },

  },

  reducers: {
    queryAnchorList_(state, action) {

      return {
        ...state,
        // list: action.payload.data,
        data: action.payload.data,
      };
    },
    queryAnchorInfo_(state, action) {
      return {
        ...state,
        anchorInfo: action.payload.data,
      };
    },
    deleteAnchor_(state) {
      return {
        ...state,
      };
    },
    activeAnchor_(state) {
      console.log(" --- activeAnchor_: ", state);
      return {
        ...state,
      };
    },
    submitAnchorForm_(state) {
      return {
        ...state,
      };
    },
  },
}
