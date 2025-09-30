<script lang="ts" setup>
import type { RouteLocationNormalizedGeneric, RouteRecordRaw, RouterLink } from 'vue-router';
import type { TagView } from '@/pinia/stores/tags-view';
import { useRouteListener } from '@@/composables/useRouteListener';
import { Close } from '@element-plus/icons-vue';
import path from 'path-browserify';
import { usePermissionStore } from '@/pinia/stores/permission';
import { useTagsViewStore } from '@/pinia/stores/tags-view';

const router = useRouter();

const route = useRoute();

const tagsViewStore = useTagsViewStore();

const permissionStore = usePermissionStore();

const { listenerRouteChange } = useRouteListener();

/** Array of tag component element refs */
const tagRefs = useTemplateRef<InstanceType<typeof RouterLink>[]>('tagRefs');

/** Context menu visible state */
const visible = ref(false);

/** Context menu top position */
const top = ref(0);

/** Context menu left position */
const left = ref(0);

/** Currently right-clicked tag */
const selectedTag = ref<TagView>({});

/** Affixed tags */
let affixTags: TagView[] = [];

/** Check if tag is active */
function isActive(tag: TagView) {
  return tag.path === route.path;
}

/** Check if tag is affixed */
function isAffix(tag: TagView) {
  return tag.meta?.affix;
}

/** Filter affixed tags */
function filterAffixTags(routes: RouteRecordRaw[], basePath = '/') {
  const tags: TagView[] = [];
  routes.forEach((route) => {
    if (isAffix(route)) {
      const tagPath = path.resolve(basePath, route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      });
    }
    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path);
      tags.push(...childTags);
    }
  });
  return tags;
}

/** Initialize tags */
function initTags() {
  affixTags = filterAffixTags(permissionStore.routes);
  for (const tag of affixTags) {
    // Must have name property
    tag.name && tagsViewStore.addVisitedView(tag);
  }
}

/** Add tags */
function addTags(route: RouteLocationNormalizedGeneric) {
  if (route.name) {
    tagsViewStore.addVisitedView(route);
    tagsViewStore.addCachedView(route);
  }
}

/** Refresh selected tag */
function refreshSelectedTag(view: TagView) {
  tagsViewStore.delCachedView(view);
  router.replace({ path: `/redirect${view.path}`, query: view.query });
}

/** Close selected tag */
function closeSelectedTag(view: TagView) {
  tagsViewStore.delVisitedView(view);
  tagsViewStore.delCachedView(view);
  isActive(view) && toLastView(tagsViewStore.visitedViews, view);
}

/** Close other tags */
function closeOthersTags() {
  const fullPath = selectedTag.value.fullPath;
  if (fullPath !== route.path && fullPath !== undefined) {
    router.push(fullPath);
  }
  tagsViewStore.delOthersVisitedViews(selectedTag.value);
  tagsViewStore.delOthersCachedViews(selectedTag.value);
}

/** Close all tags */
function closeAllTags(view: TagView) {
  tagsViewStore.delAllVisitedViews();
  tagsViewStore.delAllCachedViews();
  if (affixTags.some(tag => tag.path === route.path)) return;
  toLastView(tagsViewStore.visitedViews, view);
}

/** Navigate to last view */
function toLastView(visitedViews: TagView[], view: TagView) {
  const latestView = visitedViews.slice(-1)[0];
  const fullPath = latestView?.fullPath;
  if (fullPath !== undefined) {
    router.push(fullPath);
  } else {
    // If all tags are closed, redirect to home page by default
    if (view.name === 'Dashboard') {
      // Reload home page
      router.push({ path: `/redirect${view.path}`, query: view.query });
    } else {
      router.push('/');
    }
  }
}

/** Open context menu */
function openMenu(tag: TagView, e: MouseEvent) {
  const menuMinWidth = 100;
  // Current page width
  const offsetWidth = document.body.offsetWidth;
  // Maximum left position
  const maxLeft = offsetWidth - menuMinWidth;
  // Distance from mouse pointer
  const left15 = e.clientX + 10;
  left.value = left15 > maxLeft ? maxLeft : left15;
  top.value = e.clientY;
  // Show menu
  visible.value = true;
  // Update selected tag
  selectedTag.value = tag;
}

/** Close context menu */
function closeMenu() {
  visible.value = false;
}

watch(visible, (value) => {
  value ? document.body.addEventListener('click', closeMenu) : document.body.removeEventListener('click', closeMenu);
});

initTags();

// Listen for route changes
listenerRouteChange((route) => {
  addTags(route);
}, true);
</script>

<template>    
</template>

<style lang="scss" scoped>
.tags-view-container {
  height: var(--v3-tagsview-height);
  width: 100%;
  color: var(--v3-tagsview-text-color);
  overflow: hidden;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid var(--v3-tagsview-tag-border-color);
      border-radius: var(--v3-tagsview-tag-border-radius);
      background-color: var(--v3-tagsview-tag-bg-color);
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 5px;
      }
      &:last-of-type {
        margin-right: 5px;
      }
      &.active {
        background-color: var(--v3-tagsview-tag-active-bg-color);
        color: var(--v3-tagsview-tag-active-text-color);
        border-color: var(--v3-tagsview-tag-active-border-color);
      }
      .el-icon {
        margin-left: 5px;
        margin-right: 1px;
        border-radius: 50%;
        &:hover {
          background-color: var(--v3-tagsview-tag-icon-hover-bg-color);
          color: var(--v3-tagsview-tag-icon-hover-color);
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    z-index: 3000;
    position: fixed;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    color: var(--v3-tagsview-contextmenu-text-color);
    background-color: var(--v3-tagsview-contextmenu-bg-color);
    box-shadow: var(--v3-tagsview-contextmenu-box-shadow);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        color: var(--v3-tagsview-contextmenu-hover-text-color);
        background-color: var(--v3-tagsview-contextmenu-hover-bg-color);
      }
    }
  }
}
</style>
