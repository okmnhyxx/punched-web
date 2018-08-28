import { message } from 'antd/lib/index';
import { queryVideoList, activeVideo, deleteVideo, queryVideoInfo, submitVideoForm } from '../services/apis-video';
import { checkHasError } from '../utils/request';

export default {
  namespace: 'video',

  state: {
    data: {
      list: [],
      pagination: {
        pageSize : 10,
        current: 1,
      },
    },
  },

  effects: {
    *queryVideoList({ payload }, { call, put }) {
      const response = yield call(queryVideoList, payload);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'queryVideoList_',
        payload: response,
      });
    },
    *activeVideo({ payload, callback}, { call, put }) {
      const response = yield call(activeVideo, payload);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'activeVideo_',
        payload: response,
      });
      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },
    *deleteVideo({ payload}, { call, put }) {
      console.log(" --- payload: ", payload);
      const response = yield call(deleteVideo, payload);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'deleteVideo_',
        payload: response,
      });
    },
    *queryVideoInfo({ payload }, { call, put }) {
      const response = yield call(queryVideoInfo, payload);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'queryVideoInfo_',
        payload: response,
      });
    },
    *submitVideoForm({ payload, callback }, { call, put }) {
      const response = yield call(submitVideoForm, payload);
      console.log(" --- response: ", response);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'submitAnchorForm_',
        payload: response,
      });
      message.success('提交成功');
      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },
  },


  reducers: {
    queryVideoList_(state, action) {
      console.log(" --- action: ", action);
      return {
        ...state,
        data: action.payload.data,
      };
    },
    activeVideo_(state) {
      return {
        ...state,
      };
    },
    deleteVideo_(state) {
      return {
        ...state,
      }
    },
    queryVideoInfo_(state, action) {
      return {
        ...state,
        videoInfo: action.payload.data,
      }
    },
    submitAnchorForm_(state) {
      return {
        ...state,
      }
    },
  },
}
