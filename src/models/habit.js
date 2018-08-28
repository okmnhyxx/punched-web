import { message, notification } from 'antd/lib/index';
import { activeHabit, deleteHabit, queryHabitInfo, queryHabitList, submitHabitForm, checkHabitName } from '../services/api-habbit';
import { checkHasError } from '../utils/request';

export default {
  namespace: 'habit',

  state: {
    listData: {
      list: [],
      pagination: {},
    },
    habitInfo: {},
  },

  effects: {
    *queryHabitList({ payload }, { call, put }) {

      const response = yield call(queryHabitList, payload);
      if (checkHasError(response)) {
        return;
      }

      yield put({
        type: 'queryHabitList_',
        payload: response,
      });
    },

    *queryHabitInfo({ payload }, { call, put }) {

      const response = yield call(queryHabitInfo, payload.habitId);
      checkHasError(response);

      yield put({
        type: 'queryHabitInfo_',
        payload: response,
      });
    },

    *deleteHabit({ payload, callback }, { call }) {
      const response = yield call(deleteHabit, payload);
      if (checkHasError(response)) {
        return;
      }

      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },

    *activeHabit({ payload, callback}, { call }) {
      const response = yield call(activeHabit, payload);
      if (checkHasError(response)) {
        return;
      }

      if (callback) {
        if (response.success) {
          callback();
        }
      }
    },

    *submitHabitForm({ payload, callback }, { call }) {
      const response = yield call(submitHabitForm, payload);
      if (checkHasError(response)) {
        return;
      } else {
        notification.success({
          message: `Success`,
          description: '系统习惯修改成功',
          duration: 7,
        });
        if (callback) {
          callback();
        }
      }
    },

    *checkHabitName({ payload }, { call }) {
      return yield call(checkHabitName, payload);
    },

  },

  reducers: {
    queryHabitList_(state, action) {

      return {
        ...state,
        // list: action.payload.data,
        listData: action.payload.data,
      };
    },
    queryHabitInfo_(state, action) {
      return {
        ...state,
        habitInfo: action.payload.data,
      };
    },
  },
}
