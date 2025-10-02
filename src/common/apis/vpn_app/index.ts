import { request } from '@/http/axios';

export function getVpnAppList(data: any) {
  return request({
    url: '/vpn_app/list',
    method: 'post',
    data
  });
}

export function addVpnApp(data: any) {
  return request({
    url: '/vpn_app/add',
    method: 'post',
    data
  });
}

export function updateVpnApp(data: any) {
  return request({
    url: '/vpn_app/update',
    method: 'post',
    data
  });
}

export function deleteVpnApp(id: string) {
  return request({
    url: '/vpn_app/delete',
    method: 'post',
    data: { id }
  });
}
