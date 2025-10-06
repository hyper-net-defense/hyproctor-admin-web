import type * as API from '@/@types/api';
import { request } from '@/http/axios';

export function getCheatToolList(data: API.TCheatToolListRequestData): Promise<API.TCheatToolListResponseData> {
  return request<API.TCheatToolListResponseData>({
    url: '/admin/cheat_tool/list',
    method: 'post',
    data
  });
}

export function updateCheatTool(data: API.TCheatToolCommitRequestData): Promise<API.TCheatToolListResponseData> {
  return request<API.TCheatToolListResponseData>({
    url: '/admin/cheat_tool/update',
    method: 'post',
    data
  });
}

export function addCheatTool(data: API.TCheatToolCommitRequestData): Promise<API.TCheatToolCommitResponseData> {
  return request<API.TCheatToolCommitResponseData>({
    url: '/admin/cheat_tool/add',
    method: 'post',
    data
  });
}

export function deleteCheatTool(id: string): Promise<API.TCheatToolDeleteResponseData> {
  return request<API.TCheatToolDeleteResponseData>({
    url: '/admin/cheat_tool/delete',
    method: 'post',
    data: { id }
  });
}
