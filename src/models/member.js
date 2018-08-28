import { routerRedux } from 'dva/router';
import { message } from 'antd/lib/index';
import { queryMemberList, queryMemberInfo, deleteMember, activeMember, submitMemberForm } from '../services/api-member';
import store from '../index';
import { checkHasError } from '../utils/request';
import { fetchDefaultPaginationItem } from '../utils/utils';

export default {
  namespace: 'member',

  state: {
    listData: {
      list: [],
      pagination: {
        ...fetchDefaultPaginationItem(),
      },
    },
  },

  effects: {
    *queryMemberList({ payload }, { call, put }) {

      const response = yield call(queryMemberList, payload);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'queryMemberList_',
        payload: response,
      });
    },

    *queryMemberInfo({ payload }, { call, put }) {

      const response = yield call(queryMemberInfo, payload.memberId);
      const { dispatch } = store;
      if (!response.success) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      yield put({
        type: 'queryMemberInfo_',
        payload: response,
      });
    },

    *deleteMember({ payload, callback }, { call, put }) {
      const response = yield call(deleteMember, payload);
      yield put({
        type: 'deleteMember_',
        payload: response,
      });

      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },

    *activeMember({ payload, callback}, { call, put }) {
      const response = yield call(activeMember, payload);
      yield put({
        type: 'activeMember_',
        payload: response,
      });
      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },

    *submitMemberForm({ payload }, { call, put }) {
      const response = yield call(submitMemberForm, payload);
      const { dispatch } = store;
      if (!response.success) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      yield put({
        type: 'submitMemberForm_',
        payload: response,
      });
      message.success('提交成功');
    },

  },

  reducers: {
    queryMemberList_(state, action) {

      return {
        ...state,
        // list: action.payload.data,
        listData: action.payload.data,
      };
    },
    queryMemberInfo_(state, action) {
      return {
        ...state,
        memberInfo: action.payload.data,
      };
    },
    deleteMember_(state) {
      return {
        ...state,
      };
    },
    activeMember_(state) {
      console.log(" --- activeMember_: ", state);
      return {
        ...state,
      };
    },
    submitMemberForm_(state) {
      return {
        ...state,
      };
    },
  },

}
