import type { IUser } from 'types';

export const InitialUser: IUser = {
  ms_id: '',
  name: 'nobody',
  email: 'nobody@ntro.io',
  plan_desc: {
    title: '',
    desc: '',
    upgrade: false
  },
  verified: false,
  ip: '',
  plan: 0,
  credit: '',
  status: 0,
  roles: ['admin'],
  is_admin: false
};
