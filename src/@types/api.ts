import type {
  ICheatTool,
  INotificationEmail,
  IOrganization,
  IRemoteApp,
  ISignedApp,
  IUser,
  IVirtualCamera,
  IVmApp,
  IVpnApp
} from '@/@types';

export type TCurrentUserResponseData = ApiResponseData<IUser>;
export type TUserListResponseData = ApiResponseData<{
  user_list: IUser[];
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

export interface TSignedAppListRequestData {
  build?: string;
  os?: string;
  curPage?: number;
  pageSize?: number;
}
export type TSignedAppListResponseData = ApiResponseData<{
  signed_app_list: ISignedApp[];
}>;
export type TSignedAppCommitRequestData = ISignedApp;
export type TSignedAppCommiteResponseData = ApiResponseData<{ id: string }>;
export type TSignedAppDeleteResponseData = ApiResponseData<{ id: string }>;

export interface TCheatToolListRequestData {
  name: string;
  curPage?: number;
  pageSize?: number;
}
export type TCheatToolListResponseData = ApiResponseData<{
  cheat_tool_list: ICheatTool[];
}>;
export type TCheatToolCommitRequestData = ICheatTool;
export type TCheatToolCommitResponseData = ApiResponseData<{ id: string }>;
export type TCheatToolDeleteResponseData = ApiResponseData<{ id: string }>;

export interface TVpnAppListRequestData {
  name: string;
  curPage?: number;
  pageSize?: number;
}
export type TVpnAppListResponseData = ApiResponseData<{
  vpn_app_list: IVpnApp[];
}>;
export type TVpnAppCommitRequestData = ICheatTool;
export type TVpnAppCommitResponseData = ApiResponseData<{ id: string }>;
export interface TVpnAppDeleteRequestData {
  id: string;
}
export type TVpnAppDeleteResponseData = ApiResponseData<{ id: string }>;

export interface TRemoteAppListRequestData {
  name: string;
  curPage?: number;
  pageSize?: number;
}
export type TRemoteAppListResponseData = ApiResponseData<{
  remote_app_list: IRemoteApp[];
}>;
export type TRemoteAppCommitRequestData = ICheatTool;
export type TRemoteAppCommitResponseData = ApiResponseData<{ id: string }>;
export type TRemoteAppDeleteResponseData = ApiResponseData<{ id: string }>;

export interface TVirtualCameraListRequestData {
  name: string;
  curPage?: number;
  pageSize?: number;
}
export type TVirtualCameraListResponseData = ApiResponseData<{
  virtual_camera_list: IVirtualCamera[];
}>;
export type TVirtualCameraCommitRequestData = ICheatTool;
export type TVirtualCameraCommitResponseData = ApiResponseData<{ id: string }>;
export type TVirtualCameraDeleteResponseData = ApiResponseData<{ id: string }>;

export interface TVmAppListRequestData {
  name: string;
  curPage?: number;
  pageSize?: number;
}
export type TVmAppListResponseData = ApiResponseData<{
  vm_app_list: IVmApp[];
}>;
export type TVmAppCommitRequestData = ICheatTool;
export type TVmAppCommitResponseData = ApiResponseData<{ id: string }>;
export type TVmAppDeleteResponseData = ApiResponseData<{ id: string }>;

export interface TNotificationEmailListRequestData {
  name: string;
  email: string;
  curPage?: number;
  pageSize?: number;
}
export type TNotificationEmailListResponseData = ApiResponseData<{
  notification_email_list: INotificationEmail[];
}>;
export type TNotificationEmailCommitRequestData = ICheatTool;
export type TNotificationEmailCommitResponseData = ApiResponseData<{ id: string }>;
export type TNotificationEmailDeleteResponseData = ApiResponseData<{ id: string }>;
