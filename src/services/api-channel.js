import { stringify } from 'qs';
import request from '../utils/request';

export async function queryChannelList(params) {

  console.log(" --- params: ", params);
  console.log(" --- JSON.stringify(params): ", JSON.stringify(params));
  console.log(" --- stringify(params): ", stringify(params));

  return request(`/sys/channel/list?${stringify(params)}&times=${new Date().getTime()}`);
}

export async function queryChannelInfo(params) {
  console.log(" --- params: ", params );
  return request(`/sys/channel/${params}?times=${new Date().getTime()}`);
}


export async function deleteChannel(ids) {
  const idsStr = ids.ids;
  return request(`/sys/channel/drop?ids=${idsStr}`, {
    method: 'POST',
    body: `ids2=${idsStr}`,
    type: 'form',
  });
}

export async function activeChannel(id) {
  return request(`/sys/channel/active/${id}`, {
    method: 'POST',
  });
}

export async function submitChannelForm(payload) {
  const { channelId } = payload;

  return request(`/sys/channel/modify/${channelId}`, {
    method: 'POST',
    body: payload.values,
  });
}


export async function createChannel(payload) {
  console.log(" --- createChannel.payload: ", payload);
  console.log(" --- stringify(payload.values): ", stringify(payload.values));
  return request(`/sys/channel`, {
  // return request(`/sys/channel?${stringify(payload.values)}`, {
    method: 'POST',
    body: stringify(payload.values),
    type: 'form',
  });
}

export async function checkChannelName(payload) {

  return request(`/sys/channel/name/checking?${stringify(payload)}`);
}

