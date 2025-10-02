import { request } from '@/http/axios';

export function getNotifyEmailList(data: any) {
  return request({
    url: '/notify_email/list',
    method: 'post',
    data
  });
}

export function addNotifyEmail(data: any) {
  return request({
    url: '/notify_email/add',
    method: 'post',
    data
  });
}

export function updateNotifyEmail(data: any) {
  return request({
    url: '/notify_email/update',
    method: 'post',
    data
  });
}

export function deleteNotifyEmail(id: string) {
  return request({
    url: '/notify_email/delete',
    method: 'post',
    data: { id }
  });
}
