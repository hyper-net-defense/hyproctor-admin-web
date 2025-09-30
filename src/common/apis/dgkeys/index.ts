import type * as Dgkeys from './type';
import { request } from '@/http/axios';

export function getDgKeyList(data: any): Promise<Dgkeys.DgKeyListResponseData> {
  return request<Dgkeys.DgKeyListResponseData>({
    url: '/lic/get_deepgram_list',
    method: 'post',
    data
  });
}

export function addDgKey(data: Dgkeys.AddDgKeyRequestData) {
  return request({
    url: '/lic/add_deepgram',
    method: 'put',
    data
  });
}

/** Delete */
export function deleteDgKey(id: string) {
  return request({
    url: `/lic/delete_deepgram/${id}`,
    method: 'delete'
  });
}

/** Update */
export function updateDgKey(data: Dgkeys.UpdateDgKeyRequestData) {
  return request({
    url: '/lic/update_deepgram',
    method: 'post',
    data
  });
}
