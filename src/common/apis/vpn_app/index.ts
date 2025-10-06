import type * as API from '@/@types/api';
import { request } from '@/http/axios';

export function getVpnAppList(data: API.TVpnAppListRequestData): Promise<API.TVpnAppListResponseData> {
  return request<API.TVpnAppListResponseData>({
    url: '/admin/vpn_app/list',
    method: 'post',
    data
  });
}

export function addVpnApp(data: API.TVpnAppCommitRequestData): Promise<API.TVpnAppCommitResponseData> {
  return request<API.TVpnAppCommitResponseData>({
    url: '/admin/vpn_app/add',
    method: 'post',
    data
  });
}

export function updateVpnApp(data: API.TVpnAppCommitRequestData): Promise<API.TVpnAppCommitResponseData> {
  return request<API.TVpnAppCommitResponseData>({
    url: '/admin/vpn_app/update',
    method: 'post',
    data
  });
}

export function deleteVpnApp(id: string): Promise<API.TVpnAppDeleteResponseData> {
  return request<API.TVpnAppDeleteResponseData>({
    url: '/admin/vpn_app/delete',
    method: 'post',
    data: { id }
  });
}
