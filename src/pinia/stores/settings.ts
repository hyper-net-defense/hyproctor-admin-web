import type { Ref } from 'vue';
import type { LayoutsConfig } from '@/layouts/config';
import { setLayoutsConfig } from '@@/utils/cache/local-storage';
import { layoutsConfig } from '@/layouts/config';
import { pinia } from '@/pinia';

type SettingsStore = {
  // Use mapped types to iterate over keys of LayoutsConfig object
  [Key in keyof LayoutsConfig]: Ref<LayoutsConfig[Key]>
};

type SettingsStoreKey = keyof SettingsStore;

export const useSettingsStore = defineStore('settings', () => {
  // State object
  const state = {} as SettingsStore;

  // Iterate over key-value pairs of LayoutsConfig object
  for (const [key, value] of Object.entries(layoutsConfig)) {
    // Use type assertion to specify key type, wrap value in ref to create reactive variable
    const refValue = ref(value);
    // @ts-expect-error ignore
    state[key as SettingsStoreKey] = refValue;
    // Watch each reactive variable
    watch(refValue, () => {
      // Cache data
      const settings = getCacheData();
      setLayoutsConfig(settings);
    });
  }

  // Get data to cache: convert state object to settings object
  const getCacheData = () => {
    const settings = {} as LayoutsConfig;
    for (const [key, value] of Object.entries(state)) {
      // @ts-expect-error ignore
      settings[key as SettingsStoreKey] = value.value;
    }
    return settings;
  };

  return state;
});

/**
 * @description Can be used in SPA apps to use store before pinia instance is activated
 * @description Can be used in SSR apps to use store outside setup()
 */
export function useSettingsStoreOutside() {
  return useSettingsStore(pinia);
}
