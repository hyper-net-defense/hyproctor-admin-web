import type * as API from '@/@types/api';
import { request } from '@/http/axios';

export function getSignedAppList(data: API.TSignedAppListRequestData): Promise<API.TSignedAppListResponseData> {
  return request<API.TSignedAppListResponseData>({
    url: '/signed_app/list',
    method: 'post',
    data
  });
}

export function addSignedApp(data: API.TSignedAppCommitRequestData): Promise<API.TSignedAppCommiteResponseData> {
  return request<API.TSignedAppCommiteResponseData>({
    url: '/signed_app/add',
    method: 'post',
    data
  });
}

export function updateSignedApp(data: API.TSignedAppCommitRequestData): Promise<API.TSignedAppCommiteResponseData> {
  return request<API.TSignedAppCommiteResponseData>({
    url: '/signed_app/update',
    method: 'post',
    data
  });
}

export function deleteSignedApp(id: string): Promise<API.TSignedAppDeleteResponseData> {
  return request<API.TSignedAppDeleteResponseData>({
    url: '/signed_app/delete',
    method: 'post',
    data: { id }
  });
}
