import { request } from '@/http/axios';

export function getRemoteAppList(data: any) {
  return request({
    url: '/remote_app/list',
    method: 'post',
    data
  });
}

export function addRemoteApp(data: any) {
  return request({
    url: '/remote_app/add',
    method: 'post',
    data
  });
}

export function updateRemoteApp(data: any) {
  return request({
    url: '/remote_app/update',
    method: 'post',
    data
  });
}

export function deleteRemoteApp(id: string) {
  return request({
    url: '/remote_app/delete',
    method: 'post',
    data: { id }
  });
}
