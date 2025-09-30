import type * as Types from './type';
import { request } from '@/http/axios';

export function getCheatToolList(data: any) {
  return request<Types.CheatToolListPayload>({
    url: '/cheat_tool/list',
    method: 'post',
    data
  });
}

export function updateCheatTool(data: Types.UpdateCheatToolRequest) {
  return request({
    url: '/cheat_tool/update',
    method: 'post',
    data
  });
}

export function addCheatTool(data: any) {
  return request({
    url: '/cheat_tool/add',
    method: 'post',
    data
  });
}

export function deleteCheatTool(id: string) {
  return request({
    url: '/cheat_tool/delete',
    method: 'post',
    data: { id }
  });
}
