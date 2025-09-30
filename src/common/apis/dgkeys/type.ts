import type { IDgKey } from 'types';

export type DgKeyListResponseData = ApiResponseData<{
  dgkey_list: IDgKey[];
  total_count: number;
}>;

export interface AddDgKeyRequestData {
  email: string;
  pwd: string;
  proj_id: string;
  key: string;
  closed: boolean;
  credit: number;
}

export interface UpdateDgKeyRequestData {
  id: string;
  closed: boolean;
  credit: number;
}
