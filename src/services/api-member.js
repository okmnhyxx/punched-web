import { stringify } from 'qs';
import request from '../utils/request';

export async function queryMemberList(params) {
  return request(`/punched/sys/member/list?${stringify(params)}&times=${new Date().getTime()}`);
}

export async function queryMemberInfo(params) {
  console.log(" --- params: ", params );
  return request(`/punched/sys/member/${params}?times=${new Date().getTime()}`);
}

export async function deleteMember(ids) {
  const idsStr = ids.ids;
  return request(`/punched/sys/member/drop?ids=${idsStr}`, {
    method: 'POST',
    body: `ids2=${idsStr}`,
    type: 'form',
  });
}

export async function activeMember(id) {
  return request(`/punched/sys/member/active/${id}`, {
    method: 'POST',
  });
}

export async function submitMemberForm(payload) {
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
    console.log(" --- submitMemberForm: anchorArr[0]: ", JSON.stringify(anchorArr[0]));
    return request("/punched/sys/member", {
      method: 'POST',
      body: anchorArr,
    });

  } else {
    return request(`/punched/sys/member/modify/${anchorId}`, {
      method: 'POST',
      body: payload.values,
    });
  }
}

