import type { IUser } from '@/@types';

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

export const Membership = {
  FREE: 0,
  PRO: 1,
  ENTERPRISE: 2,
  COUNT: 3
};

export const MembershipList = [
  { id: Membership.FREE, text: 'Free' },
  { id: Membership.PRO, text: 'Pro' },
  { id: Membership.ENTERPRISE, text: 'Enterprise' },
  { id: Membership.COUNT, text: 'Count' }
];
