import type * as Users from './type';
import { request } from '@/http/axios';

export function getCurrentUser(): Promise<Users.CurrentUserResponseData> {
  return request<Users.CurrentUserResponseData>({
    url: '/account/user/inf',
    method: 'post'
  });
}

export function getUserList(data: any): Promise<Users.UserListResponseData> {
  return request<Users.UserListResponseData>({
    url: '/admin/user/list',
    method: 'post',
    data
  });
}

export function createUser(data: Users.CreateOrUpdateUserRequestData) {
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
export function updateStatus(data: Users.UpdateUserStatusRequestData) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  });
}
