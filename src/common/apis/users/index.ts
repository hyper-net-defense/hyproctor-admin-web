import type * as API from '@/@types/api';
import { request } from '@/http/axios';

export function getCurrentUser(): Promise<API.TCurrentUserResponseData> {
  return request<API.TCurrentUserResponseData>({
    url: '/account/user/inf',
    method: 'post'
  });
}

export function getUserList(data: any): Promise<API.TUserListResponseData> {
  return request<API.TUserListResponseData>({
    url: '/admin/user/list',
    method: 'post',
    data
  });
}

export function createUser(data: API.TCreateOrUpdateUserRequestData) {
  return request({
    url: '/account/create_user',
    method: 'post',
    data
  });
}

/** Delete */
export function deleteUser(id: string) {
  return request({
    url: `/account/${id}`,
    method: 'delete'
  });
}

/** Update */
export function updateStatus(data: API.TUpdateUserStatusRequestData) {
  return request<API.TUpdateUserStatusResponseData>({
    url: '/user/update',
    method: 'post',
    data
  });
}
