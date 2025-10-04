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
