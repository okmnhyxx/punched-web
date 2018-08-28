// import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { queryChannelList, queryChannelInfo, deleteChannel, activeChannel, submitChannelForm, createChannel, checkChannelName } from '../services/api-channel';
import { checkHasError } from '../utils/request';
import { fetchDefaultPaginationItem } from '../utils/utils';

export default {

  namespace: 'channel',

  state: {
    listData: {
      list: [],
      pagination: {
        ...fetchDefaultPaginationItem(),
      },
    },
    channelInfo: {},
  },

  effects: {
    *queryChannelList({ payload }, { call, put }) {

      const response = yield call(queryChannelList, payload);
      if (checkHasError(response)) {
        return;
      }
      const noProxy = process.env.NO_PROXY === 'true';
      console.log(" --- noProxy: ", noProxy);

      yield put({
        type: 'queryChannelList_',
        payload: response,
      });
    },

    *queryChannelInfo({ payload }, { call, put }) {

      const response = yield call(queryChannelInfo, payload.channelId);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'queryChannelInfo_',
        payload: response,
      });
    },

    *deleteChannel({ payload, callback }, { call, put }) {
      const response = yield call(deleteChannel, payload);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'deleteChannel_',
        payload: response,
      });

      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },

    *activeChannel({ payload, callback}, { call, put }) {
      const response = yield call(activeChannel, payload);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'activeChannel_',
        payload: response,
      });

      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },

    *submitChannelForm({ payload, callback }, { call, put }) {
      const response = yield call(submitChannelForm, payload);
      if (checkHasError(response)) {
        return;
      } else {
        // message.success('提交成功');
        notification.success({
          message: `Success`,
          description: '渠道修改成功',
          duration: 7,
        });

        if (callback) {
          if (response.success) {
            callback();
          }
        }
      }

      yield put({
        type: 'submitChannelForm_',
        payload: response,
      });
    },

    *createChannel({ payload }, { call, put }) {
      const response = yield call(createChannel, payload);
      if (checkHasError(response)) {
        return;
      } else {
        notification.success({
          message: `Success`,
          description: '渠道创建成功',
          duration: 7,
        });
      }

      yield put({
        type: 'createChannel_',
        payload: response,
      });
    },

    *checkChannelName({ payload },  { call }) {
      return yield call(checkChannelName, payload);
    },

  },

  reducers: {
    queryChannelList_(state, action) {

      console.debug(" --- state: ", state, " --- action: ", action);
      return {
        ...state,
        listData: action.payload.data,
      };
    },
    queryChannelInfo_(state, action) {
      return {
        ...state,
        channelInfo: action.payload.data,
      };
    },
    deleteChannel_(state) {
      return {
        ...state,
      };
    },
    activeChannel_(state) {
      console.log(" --- activeChannel_: ", state);
      return {
        ...state,
      };
    },
    submitChannelForm_(state) {
      return {
        ...state,
      };
    },
    createChannel_(state) {
      return {
        ...state,
      };
    },
  },
}
