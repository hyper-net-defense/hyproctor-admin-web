import type { IUser } from 'types';

export type CurrentUserResponseData = ApiResponseData<IUser>;
export type UserListResponseData = ApiResponseData<{
  user_list: IUser[];
  total_count: number;
}>;

export interface CreateOrUpdateUserRequestData {
  ms_id?: string;
  email: string;
  status: string;
}

export interface UpdateUserStatusRequestData {
  ms_id: string;
  status: number;
}

export interface SearchUserRequestData {
  curPage: number;
  pageSize: number;
  email: string;
  phone: string;
}
