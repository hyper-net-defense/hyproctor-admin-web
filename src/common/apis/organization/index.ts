import type * as API from '@/@types/api';
import { request } from '@/http/axios';

export function getOrganizationList(data: API.TSearchOrganizationRequestData): Promise<API.TOrganizationListResponseData> {
  return request<API.TOrganizationListResponseData>({
    url: '/admin/org/list',
    method: 'post',
    data
  });
}

export function createOrganization(data: API.TCommitOrganizationRequestData) {
  return request<API.TCommitOrganizationResponseData>({
    url: '/admin/org/add',
    method: 'post',
    data
  });
}

export function updateOrganization(data: API.TCommitOrganizationRequestData) {
  return request<API.TCommitOrganizationResponseData>({
    url: '/admin/org/update',
    method: 'post',
    data
  });
}

export function updateOrganizationPlan(data: API.TUpdateOrganizationPlanRequestData) {
  return request<API.TUpdateOrganizationPlanResponseData>({
    url: '/admin/org/update_plan',
    method: 'post',
    data
  });
}
