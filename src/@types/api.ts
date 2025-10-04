import type { IOrganization, IUser } from '@/@types';

export type TCurrentUserResponseData = ApiResponseData<IUser>;
export type TUserListResponseData = ApiResponseData<{
  user_list: IUser[];
  total_count: number;
}>;

export interface TCreateOrUpdateUserRequestData {
  ms_id?: string;
  email: string;
  status: string;
}

export interface TUpdateUserStatusRequestData {
  ms_id: string;
  status: number;
}

export type TUpdateUserStatusResponseData = ApiResponseData<{ domain: string }>;

export interface TSearchUserRequestData {
  curPage: number;
  pageSize: number;
  email: string;
  phone: string;
}

export type TOrganizationListResponseData = ApiResponseData<{
  org_list: IOrganization[];
  total_count: number;
}>;

export interface TSearchOrganizationRequestData {
  domain: string;
  pageSize: number;
  curPage: number;
}

export interface TCommitOrganizationRequestData {
  domain: string;
  name: string;
}

export type TCommitOrganizationResponseData = ApiResponseData<{ domain: string }>;

export interface TUpdateOrganizationPlanRequestData {
  domain: string;
  plan: number;
  expire_at: string;
  extra: string;
}
export type TUpdateOrganizationPlanResponseData = ApiResponseData<{ domain: string }>;
