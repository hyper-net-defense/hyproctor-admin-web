import type * as API from '@/@types/api';
import { request } from '@/http/axios';

export function getNotifyEmailList(data: API.TNotificationEmailListRequestData): Promise<API.TNotificationEmailListResponseData> {
  return request<API.TNotificationEmailListResponseData>({
    url: '/notify_email/list',
    method: 'post',
    data
  });
}

export function addNotifyEmail(data: API.TNotificationEmailCommitRequestData): Promise<API.TNotificationEmailCommitResponseData> {
  return request<API.TNotificationEmailCommitResponseData>({
    url: '/notify_email/add',
    method: 'post',
    data
  });
}

export function updateNotifyEmail(data: API.TNotificationEmailCommitRequestData): Promise<API.TNotificationEmailCommitResponseData> {
  return request<API.TNotificationEmailCommitResponseData>({
    url: '/notify_email/update',
    method: 'post',
    data
  });
}

export function deleteNotifyEmail(id: string): Promise<API.TNotificationEmailDeleteResponseData> {
  return request<API.TNotificationEmailDeleteResponseData>({
    url: '/notify_email/delete',
    method: 'post',
    data: { id }
  });
}
