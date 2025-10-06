import type * as API from '@/@types/api';
import { request } from '@/http/axios';

export function getRemoteAppList(data: API.TRemoteAppListRequestData): Promise<API.TRemoteAppListResponseData> {
  return request<API.TRemoteAppListResponseData>({
    url: '/admin/remote_app/list',
    method: 'post',
    data
  });
}

export function addRemoteApp(data: API.TRemoteAppCommitRequestData): Promise<API.TRemoteAppCommitResponseData> {
  return request<API.TRemoteAppCommitResponseData>({
    url: '/admin/remote_app/add',
    method: 'post',
    data
  });
}

export function updateRemoteApp(data: API.TRemoteAppCommitRequestData): Promise<API.TRemoteAppCommitResponseData> {
  return request<API.TRemoteAppCommitResponseData>({
    url: '/admin/remote_app/update',
    method: 'post',
    data
  });
}

export function deleteRemoteApp(id: string): Promise<API.TRemoteAppDeleteResponseData> {
  return request<API.TRemoteAppDeleteResponseData>({
    url: '/admin/remote_app/delete',
    method: 'post',
    data: { id }
  });
}
