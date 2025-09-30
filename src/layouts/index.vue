<script lang="ts" setup>
import { useDevice } from '@@/composables/useDevice';
import { useLayoutMode } from '@@/composables/useLayoutMode';
import { useWatermark } from '@@/composables/useWatermark';
import { getCssVar, setCssVar } from '@@/utils/css';
import { useSettingsStore } from '@/pinia/stores/settings';
import { RightPanel, Settings } from './components';
import { useResize } from './composables/useResize';
import LeftMode from './modes/LeftMode.vue';
import LeftTopMode from './modes/LeftTopMode.vue';
import TopMode from './modes/TopMode.vue';

// Responsive layout handling
useResize();

const { setWatermark, clearWatermark } = useWatermark();

const { isMobile } = useDevice();

const { isLeft, isTop, isLeftTop } = useLayoutMode();

const settingsStore = useSettingsStore();

const { showSettings, showTagsView, showWatermark } = storeToRefs(settingsStore);

// #region Remove tags view height when hidden to keep Logo component height consistent with Header area
const cssVarName = '--v3-tagsview-height';

const v3TagsviewHeight = getCssVar(cssVarName);

watchEffect(() => {
  showTagsView.value ? setCssVar(cssVarName, v3TagsviewHeight) : setCssVar(cssVarName, '0px');
});
// #endregion

// Enable or disable system watermark
watchEffect(() => {
  showWatermark.value ? setWatermark(import.meta.env.NTRO_APP_TITLE) : clearWatermark();
});
</script>

<template>
  <div>
    <!-- Left layout mode -->
    <LeftMode v-if="isLeft || isMobile" />
    <!-- Top layout mode -->
    <TopMode v-else-if="isTop" />
    <!-- Mixed layout mode -->
    <LeftTopMode v-else-if="isLeftTop" />
    <!-- Right settings panel -->
    <RightPanel v-if="showSettings">
      <Settings />
    </RightPanel>
  </div>
</template>
