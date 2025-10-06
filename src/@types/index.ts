export interface IUser {
  ms_id: string;
  name: string;
  email: string;
  plan_desc: IPlanDesc;
  verified: boolean;
  plan: number;
  ip: string;
  credit: string;
  status: number;
  roles: string[];
  is_admin: boolean;
}

export interface IPlanDesc {
  title: string;
  desc: string;
  upgrade: boolean;
}

export interface IOrganization {
  domain: string;
  name: string;
  plan: number;
  expire_at: string;
  extra: string;
}

export interface ISignedApp {
  id?: string;
  build: string;
  os: string;
  obj_key: string;
  pv_key: string;
  plan: number;
  domain: string;
  is_active: boolean;
}

export interface ICheatTool {
  id?: string;
  name: string;
  domain: string;
  link: string;
  ip_list: string[];
  process_win: string;
  process_mac: string;
}

export interface IVpnApp {
  id?: string;
  name: string;
  link: string;
  process_win: string;
  process_mac: string;
}

export interface IRemoteApp {
  id?: string;
  name: string;
  link: string;
  process_win: string;
  process_mac: string;
}

export interface IVmApp {
  id?: string;
  name: string;
  link: string;
  process_win: string;
  process_mac: string;
}

export interface IVirtualCamera {
  id?: string;
  name: string;
  pattern: string;
}

export interface INotificationEmail {
  id?: string;
  name: string;
  email: string;
}

export interface IBlackDomain {
  id?: string;
  domain: string;
  is_cheat: boolean;
}
