import { request } from '@/http/axios';

export function getVirtualCameraList(data: any) {
  return request({
    url: '/virtual_camera/list',
    method: 'post',
    data
  });
}

export function addVirtualCamera(data: any) {
  return request({
    url: '/virtual_camera/add',
    method: 'post',
    data
  });
}

export function updateVirtualCamera(data: any) {
  return request({
    url: '/virtual_camera/update',
    method: 'post',
    data
  });
}

export function deleteVirtualCamera(id: string) {
  return request({
    url: '/virtual_camera/delete',
    method: 'post',
    data: { id }
  });
}
