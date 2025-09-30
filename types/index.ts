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

export interface IDgKey {
  id: string;
  email: string;
  pwd: string;
  proj_id: string;
  key: string;
  closed: boolean;
  credit: number;
  checked_at: string;
  created_at: string;
}
