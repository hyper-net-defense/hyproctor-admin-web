import type * as API from '@/@types/api';
import { request } from '@/http/axios';

export function getBlackDomainList(data: API.TBlackDomainListRequestData): Promise<API.TBlackDomainListResponseData> {
  return request<API.TBlackDomainListResponseData>({
    url: '/admin/black_domain/list',
    method: 'post',
    data
  });
}

export function addBlackDomain(data: API.TBlackDomainCommitRequestData): Promise<API.TBlackDomainCommitResponseData> {
  return request<API.TBlackDomainCommitResponseData>({
    url: '/admin/black_domain/add',
    method: 'post',
    data
  });
}

export function updateBlackDomain(data: API.TBlackDomainCommitRequestData): Promise<API.TBlackDomainCommitResponseData> {
  return request<API.TBlackDomainCommitResponseData>({
    url: '/admin/black_domain/update',
    method: 'post',
    data
  });
}

export function deleteBlackDomain(id: string): Promise<API.TBlackDomainDeleteResponseData> {
  return request<API.TBlackDomainDeleteResponseData>({
    url: '/admin/black_domain/delete',
    method: 'post',
    data: { id }
  });
}
