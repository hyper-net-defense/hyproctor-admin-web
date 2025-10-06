import type * as API from '@/@types/api';
import { request } from '@/http/axios';

export function getVmAppList(data: API.TVmAppListRequestData): Promise<API.TVmAppListResponseData> {
  return request<API.TVmAppListResponseData>({
    url: '/admin/vm_app/list',
    method: 'post',
    data
  });
}

export function addVmApp(data: API.TVmAppCommitRequestData): Promise<API.TVmAppCommitResponseData> {
  return request<API.TVmAppCommitResponseData>({
    url: '/admin/vm_app/add',
    method: 'post',
    data
  });
}

export function updateVmApp(data: API.TVmAppCommitRequestData): Promise<API.TVmAppCommitResponseData> {
  return request<API.TVmAppCommitResponseData>({
    url: '/admin/vm_app/update',
    method: 'post',
    data
  });
}

export function deleteVmApp(id: string): Promise<API.TVmAppDeleteResponseData> {
  return request<API.TVmAppDeleteResponseData>({
    url: '/admin/vm_app/delete',
    method: 'post',
    data: { id }
  });
}
