import { stringify } from 'qs';
import request from '../utils/request';

export async function queryVideoList(params) {
  return request(`/sys/videos/query?${stringify(params)}&times=${new Date().getTime()}`);
}

export async function queryVideoInfo(params) {
  const { videoId } = params;
  console.log(" --- videoId: ",  videoId);
  return request(`/sys/videos/${videoId}?times=${new Date().getTime()}`);
}

export async function deleteVideo(ids) {
  return request(`/sys/videos/drop?ids=${ids.ids}`, {
    method: 'POST',
    body: `ids2=${ids.ids}`,
    type: 'form',
  });
}

export async function activeVideo(id) {
  return request(`/sys/videos/active/${id}`, {
    method: 'POST',
  });
}

export async function submitVideoForm(payload) {

  const { videoId } = payload;
  const reqDto = payload;
  delete reqDto.videoId;

  console.log(" --- submitVideoForm videoId: ",videoId);
  console.log(" --- submitVideoForm reqDto: ", JSON.stringify(reqDto));
  // return request(`/sys/videos/modify/${videoId}`, {
  return request(`/sys/videos/modify/a`, {
    method: 'POST',
    body: reqDto,
  });
}

