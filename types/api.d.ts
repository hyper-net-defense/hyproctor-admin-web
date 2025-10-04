/** All API response data should follow this format */
interface ApiResponseData<T> {
  code?: number;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    size: number;
  };
  message?: string;
  success: boolean;
}
