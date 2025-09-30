import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { get, merge } from 'lodash-es';

/** Log out and force refresh the page (will redirect to login page) */
// No-op logout: auth removed. We do not force page reloads from axios.
function logout() {
  // noop
}

/** Create an axios instance named instance */
function createInstance() {
  // Create an axios instance named instance
  const instance = axios.create();
  // Request interceptor
  instance.interceptors.request.use(
    // Before sending
    config => config,
    // Sending failed
    error => Promise.reject(error)
  );
  // Response interceptor (can be adjusted according to specific business needs)
  instance.interceptors.response.use(
    (response) => {
      // apiData is the data returned by the api
      const apiData = response.data;
      // Dev: log raw api response to help debugging
      if (import.meta.env.DEV) console.debug('[axios] raw apiData:', apiData);
      // Return binary data directly
      const responseType = response.request?.responseType;
      if (responseType === 'blob' || responseType === 'arraybuffer') return apiData;
      // This code is the business code agreed with the backend
      const code = apiData.code;
      // If there is no code, it means this is not an api developed by the backend of this project
      if (code === undefined) {
        ElMessage.error('Not an interface of this system');
        // return Promise.reject(new Error('Not an interface of this system'));
        return { success: false, message: 'Not an interface of this system' };
      }
      switch (code) {
        case 0:
          // This system uses code === 0 to indicate no business error
          // Map common backend payload keys (msg or data) into .data so callers get the expected shape
          // Include pagination when backend provides it.
          return {
            success: true,
            data: apiData.msg ?? apiData.data ?? apiData,
            pagination: apiData.pagination ?? undefined
          };
        default:
          // Not the correct code
          ElMessage.error(apiData.msg || 'Error');
          return { success: false, code, message: apiData.msg || 'Error' };
      }
    },
    (error) => {
      // status is the HTTP status code
      const status = get(error, 'response.status');
      const message = get(error, 'response.data.message');
      switch (status) {
        case 400:
          error.message = 'Request error';
          break;
        case 401:
          // Unauthorized — do not auto-logout in global axios after auth removal
          error.message = message || 'Unauthorized';
          break;
        case 403:
          error.message = message || 'Access denied';
          break;
        case 404:
          error.message = 'Request URL error';
          break;
        case 408:
          error.message = 'Request timeout';
          break;
        case 500:
          error.message = 'Internal server error';
          break;
        case 501:
          error.message = 'Service not implemented';
          break;
        case 502:
          error.message = 'Gateway error';
          break;
        case 503:
          error.message = 'Service unavailable';
          break;
        case 504:
          error.message = 'Gateway timeout';
          break;
        case 505:
          error.message = 'HTTP version not supported';
          break;
      }
      ElMessage.error(error.message);
      // return Promise.reject(error);
      return {
        success: false,
        message: error.message
      };
    }
  );
  return instance;
}

/** Create request method */
function createRequest(instance: AxiosInstance) {
  return <ApiResponseData>(config: AxiosRequestConfig): Promise<ApiResponseData> => {
    // Default config
    const defaultConfig: AxiosRequestConfig = {
      // API address
      baseURL: import.meta.env.VITE_API_BASE_URL,
      // Request headers
      headers: {
        'Content-Type': 'application/json'
      },
      // Request body
      data: {},
      // Request timeout
      timeout: 20000,
      // Whether to carry Cookies in cross-domain requests
      withCredentials: false
    };
    // Merge defaultConfig and custom config into mergeConfig
    const mergeConfig = merge(defaultConfig, config);
    return instance(mergeConfig);
  };
}

/** Instance for requests */
const instance = createInstance();

/** Method for requests */
export const request = createRequest(instance);

/**
 * Set Authorization header for subsequent requests
 */
export function setAuthToken(token?: string) {
  try {
    // Set Authorization on axios defaults so it applies to all requests
    // Use .common for axios so method-specific headers don't override it
    (instance.defaults.headers as any) = (instance.defaults.headers as any) || {};
    (instance.defaults.headers as any).common = (instance.defaults.headers as any).common || {};
    if (token) {
      (instance.defaults.headers as any).common['Authorization'] = `Bearer ${token}`;
      // also set top-level header for compatibility
      (instance.defaults.headers as any)['Authorization'] = `Bearer ${token}`;
    } else {
      delete (instance.defaults.headers as any).common['Authorization'];
      delete (instance.defaults.headers as any)['Authorization'];
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Return the current Authorization header value (if any).
 * Useful for debugging whether setAuthToken applied the header to the axios instance.
 */
export function getAuthTokenHeader(): string | undefined {
  try {
    const headers = (instance.defaults.headers as any) || {};
    return headers.common?.['Authorization'] || headers['Authorization'];
  } catch (e) {
    return undefined;
  }
}
