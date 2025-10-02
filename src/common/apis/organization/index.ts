import { request } from '@/http/axios';

export function getOrganizationList(data: any) {
  return request({
    url: '/admin/dg/list',
    method: 'post',
    data
  });
}

export function createOrganization(data: any) {
  return request({
    url: '/admin/create_org',
    method: 'post',
    data
  });
}

export function updateOrganization(data: any) {
  return request({
    url: '/admin/update_org',
    method: 'post',
    data
  });
}

export function updateOrganizationPlan(data: any) {
  return request({
    url: '/admin/update_org_plan',
    method: 'post',
    data
  });
}
