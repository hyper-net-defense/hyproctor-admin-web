import { request } from '@/http/axios';

export function getVmAppList(data: any) {
  return request({
    url: '/vm_app/list',
    method: 'post',
    data
  });
}

export function addVmApp(data: any) {
  return request({
    url: '/vm_app/add',
    method: 'post',
    data
  });
}

export function updateVmApp(data: any) {
  return request({
    url: '/vm_app/update',
    method: 'post',
    data
  });
}

export function deleteVmApp(id: string) {
  return request({
    url: '/vm_app/delete',
    method: 'post',
    data: { id }
  });
}
