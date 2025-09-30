import type { RouteLocationNormalizedGeneric } from 'vue-router';
import { getCachedViews, getVisitedViews, setCachedViews, setVisitedViews } from '@@/utils/cache/local-storage';
import { pinia } from '@/pinia';
import { useSettingsStore } from './settings';

export type TagView = Partial<RouteLocationNormalizedGeneric>;

export const useTagsViewStore = defineStore('tags-view', () => {
  const { cacheTagsView } = useSettingsStore();

  const visitedViews = ref<TagView[]>(cacheTagsView ? getVisitedViews() : []);

  const cachedViews = ref<string[]>(cacheTagsView ? getCachedViews() : []);

  // Cache tags view data
  watchEffect(() => {
    setVisitedViews(visitedViews.value);
    setCachedViews(cachedViews.value);
  });

  // #region Add
  const addVisitedView = (view: TagView) => {
    // Check if visitedView already exists
    const index = visitedViews.value.findIndex(v => v.path === view.path);
    if (index !== -1) {
      // Prevent query parameters from being lost
      visitedViews.value[index].fullPath !== view.fullPath && (visitedViews.value[index] = { ...view });
    } else {
      // Add new visitedView
      visitedViews.value.push({ ...view });
    }
  };

  const addCachedView = (view: TagView) => {
    if (typeof view.name !== 'string') return;
    if (cachedViews.value.includes(view.name)) return;
    if (view.meta?.keepAlive) {
      cachedViews.value.push(view.name);
    }
  };
  // #endregion

  // #region Delete
  const delVisitedView = (view: TagView) => {
    const index = visitedViews.value.findIndex(v => v.path === view.path);
    if (index !== -1) {
      visitedViews.value.splice(index, 1);
    }
  };

  const delCachedView = (view: TagView) => {
    if (typeof view.name !== 'string') return;
    const index = cachedViews.value.indexOf(view.name);
    if (index !== -1) {
      cachedViews.value.splice(index, 1);
    }
  };
  // #endregion

  // #region Delete Others
  const delOthersVisitedViews = (view: TagView) => {
    visitedViews.value = visitedViews.value.filter((v) => {
      return v.meta?.affix || v.path === view.path;
    });
  };

  const delOthersCachedViews = (view: TagView) => {
    if (typeof view.name !== 'string') return;
    const index = cachedViews.value.indexOf(view.name);
    if (index !== -1) {
      cachedViews.value = cachedViews.value.slice(index, index + 1);
    } else {
      // If index = -1, no cached tags
      cachedViews.value = [];
    }
  };
  // #endregion

  // #region Delete All
  const delAllVisitedViews = () => {
    // Keep affixed tags
    visitedViews.value = visitedViews.value.filter(tag => tag.meta?.affix);
  };

  const delAllCachedViews = () => {
    cachedViews.value = [];
  };
  // #endregion

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    addCachedView,
    delVisitedView,
    delCachedView,
    delOthersVisitedViews,
    delOthersCachedViews,
    delAllVisitedViews,
    delAllCachedViews
  };
});

/**
 * @description Can be used in SPA apps to use store before pinia instance is activated
 * @description Can be used in SSR apps to use store outside setup()
 */
export function useTagsViewStoreOutside() {
  return useTagsViewStore(pinia);
}
