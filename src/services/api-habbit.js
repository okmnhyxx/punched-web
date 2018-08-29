import { stringify } from 'qs';
import request from '../utils/request';

export async function queryHabitList(params) {
  return request(`/punched/sys/habit/list?${stringify(params)}&times=${new Date().getTime()}`);
}

export async function queryHabitInfo(params) {
  console.log(" --- params: ", params );
  return request(`/punched/sys/habit/${params}?times=${new Date().getTime()}`);
}

export async function deleteHabit(ids) {
  const idsStr = ids.ids;
  return request(`/punched/sys/habit/drop?ids=${idsStr}`, {
    method: 'POST',
    body: `ids2=${idsStr}`,
    type: 'form',
  });
}

export async function activeHabit(id) {
  return request(`/punched/sys/habit/active/${id}`, {
    method: 'POST',
  });
}

export async function submitHabitForm(payload) {

    return request(`/punched/sys/habit/${payload.habitId}`, {
      method: 'POST',
      body: stringify(payload.values),
      type: 'form',
    });
}

export async function checkHabitName(payload) {
  return request(`/punched/sys/habit//name/checking?${stringify(payload)}`);
}

