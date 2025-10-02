import { request } from '@/http/axios';

export function getSignedAppList(data: any) {
  return request({
    url: '/signed_app/list',
    method: 'post',
    data
  });
}

export function addSignedApp(data: any) {
  return request({
    url: '/signed_app/add',
    method: 'post',
    data
  });
}

export function updateSignedApp(data: any) {
  return request({
    url: '/signed_app/update',
    method: 'post',
    data
  });
}

export function deleteSignedApp(id: string) {
  return request({
    url: '/signed_app/delete',
    method: 'post',
    data: { id }
  });
}
