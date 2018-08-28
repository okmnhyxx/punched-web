import { stringify } from 'qs';
import request from '../utils/request';

export async function queryAnchorList(params) {
  return request(`/sys/anchors/query?${stringify(params)}&times=${new Date().getTime()}`);
}

export async function queryAnchorInfo(params) {
  console.log(" --- params: ", params );
  return request(`/sys/anchors/${params}?times=${new Date().getTime()}`);
}

export async function deleteAnchor(ids) {
  const idsStr = ids.ids;
  return request(`/sys/anchors/drop?ids=${idsStr}`, {
    method: 'POST',
    body: `ids2=${idsStr}`,
    type: 'form',
  });
}

export async function activeAnchor(id) {
  return request(`/sys/anchors/active/${id}`, {
    method: 'POST',
  });
}

export async function submitAnchorForm(payload) {
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
    console.log(" --- submitAnchorForm: anchorArr[0]: ", JSON.stringify(anchorArr[0]));
    return request("/sys/anchors", {
      method: 'POST',
      body: anchorArr,
    });

  } else {
    return request(`/sys/anchors/modify/${anchorId}`, {
      method: 'POST',
      body: payload.values,
    });
  }
}

