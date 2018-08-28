import { stringify } from 'qs';
import request from '../utils/request';

export async function queryPunchList(params) {
  return request(`/sys/punch/list?${stringify(params)}&times=${new Date().getTime()}`);
}

export async function queryPunchInfo(params) {
  console.log(" --- params: ", params );
  return request(`/sys/punch/${params}?times=${new Date().getTime()}`);
}

export async function deletePunch(ids) {
  const idsStr = ids.ids;
  return request(`/sys/punch/drop?ids=${idsStr}`, {
    method: 'POST',
    body: `ids2=${idsStr}`,
    type: 'form',
  });
}

export async function activePunch(id) {
  return request(`/sys/punch/active/${id}`, {
    method: 'POST',
  });
}

export async function submitPunchForm(payload) {
  const { anchorId } = payload;
  const infoVo = payload.values;
  infoVo.turnsNum = JSON.parse(payload.values.turnsNum);
  infoVo.sexType = parseInt(payload.values.sexType, 0);

  if (anchorId === 0) {
    const anchorArr = [];
    const obj = {};
    obj.videoVo = {name: infoVo.videoName, url: infoVo.videoUrl};
    delete infoVo.videoName;
    delete infoVo.videoUrl;
    obj.anchorVo = infoVo;
    anchorArr[0] = obj;
    console.log(" --- submitPunchForm: anchorArr[0]: ", JSON.stringify(anchorArr[0]));
    return request("/sys/punch", {
      method: 'POST',
      body: anchorArr,
    });

  } else {
    return request(`/sys/punch/modify/${anchorId}`, {
      method: 'POST',
      body: payload.values,
    });
  }
}

