import dayjs from 'dayjs';

const INVALID_DATE = 'N/A';

/** Format date and time */
export function formatDateTime(datetime: string | number | Date = '', template: string = 'YYYY-MM-DD HH:mm:ss') {
  const day = dayjs(datetime);
  return day.isValid() ? day.format(template) : INVALID_DATE;
}
