import type * as API from '@/@types/api';
import { request } from '@/http/axios';

export function getVirtualCameraList(data: API.TVirtualCameraListRequestData): Promise<API.TVirtualCameraListResponseData> {
  return request<API.TVirtualCameraListResponseData>({
    url: '/admin/virtual_camera/list',
    method: 'post',
    data
  });
}

export function addVirtualCamera(data: API.TVirtualCameraCommitRequestData): Promise<API.TVirtualCameraCommitResponseData> {
  return request<API.TVirtualCameraCommitResponseData>({
    url: '/admin/virtual_camera/add',
    method: 'post',
    data
  });
}

export function updateVirtualCamera(data: API.TVirtualCameraCommitRequestData): Promise<API.TVirtualCameraCommitResponseData> {
  return request<API.TVirtualCameraCommitResponseData>({
    url: '/admin/virtual_camera/update',
    method: 'post',
    data
  });
}

export function deleteVirtualCamera(id: string): Promise<API.TVirtualCameraDeleteResponseData> {
  return request<API.TVirtualCameraDeleteResponseData>({
    url: '/admin/virtual_camera/delete',
    method: 'post',
    data: { id }
  });
}
