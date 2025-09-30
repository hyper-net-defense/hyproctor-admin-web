import type { LoadingOptions } from 'element-plus';

interface UseFullscreenLoading {
  <T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    options?: LoadingOptions
  ): (...args: Parameters<T>) => Promise<ReturnType<T>>;
}

interface LoadingInstance {
  close: () => void;
}

const DEFAULT_OPTIONS = {
  lock: true,
  text: 'Loading...'
};

/**
 * @name Fullscreen Loading Composable
 * @description Pass in a function fn, and during its execution cycle, add a "fullscreen" Loading
 * @param fn The function to execute
 * @param options LoadingOptions
 * @returns Returns a new function, which returns a Promise
 */
export const useFullscreenLoading: UseFullscreenLoading = (fn, options = {}) => {
  let loadingInstance: LoadingInstance;
  return async (...args) => {
    try {
      loadingInstance = ElLoading.service({ ...DEFAULT_OPTIONS, ...options });
      return await fn(...args);
    } finally {
      loadingInstance.close();
    }
  };
};
