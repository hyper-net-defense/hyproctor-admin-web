import type * as API from '@/@types/api';
import { request } from '@/http/axios';

export function getOrganizationList(data: API.TSearchOrganizationRequestData): Promise<API.TOrganizationListResponseData> {
  return request<API.TOrganizationListResponseData>({
    url: '/admin/get_org_list',
    method: 'post',
    data
  });
}

export function createOrganization(data: API.TCommitOrganizationRequestData) {
  return request<API.TCommitOrganizationResponseData>({
    url: '/admin/create_org',
    method: 'post',
    data
  });
}

export function updateOrganization(data: API.TCommitOrganizationRequestData) {
  return request<API.TCommitOrganizationResponseData>({
    url: '/admin/update_org',
    method: 'post',
    data
  });
}

export function updateOrganizationPlan(data: API.TUpdateOrganizationPlanRequestData) {
  return request<API.TUpdateOrganizationPlanResponseData>({
    url: '/admin/update_org_plan',
    method: 'post',
    data
  });
}
