<script lang="ts" setup>
import { useLayoutMode } from '@@/composables/useLayoutMode';
import { removeLayoutsConfig } from '@@/utils/cache/local-storage';
import { Refresh } from '@element-plus/icons-vue';
import { useSettingsStore } from '@/pinia/stores/settings';
import SelectLayoutMode from './SelectLayoutMode.vue';

const { isLeft } = useLayoutMode();

const settingsStore = useSettingsStore();

// Use storeToRefs to keep the extracted properties reactive
const {
  showTagsView,
  showLogo,
  fixedHeader,
  showFooter,
  showNotify,
  showThemeSwitch,
  showScreenfull,
  showSearchMenu,
  cacheTagsView,
  showWatermark,
  showGreyMode,
  showColorWeakness
} = storeToRefs(settingsStore);

/** Define switch settings items */
const switchSettings = {
  'Show Tags View': showTagsView,
  'Show Logo': showLogo,
  'Fixed Header': fixedHeader,
  'Show Footer': showFooter,
  'Show Notification': showNotify,
  'Show Theme Switch Button': showThemeSwitch,
  'Show Fullscreen Button': showScreenfull,
  'Show Search Button': showSearchMenu,
  'Cache Tags View': cacheTagsView,
  'Enable System Watermark': showWatermark,
  'Show Grey Mode': showGreyMode,
  'Show Color Weakness Mode': showColorWeakness
};

// In non-left mode, the Header is always fixed layout
watchEffect(() => {
  !isLeft.value && (fixedHeader.value = true);
});

/** Reset project configuration */
function resetLayoutsConfig() {
  removeLayoutsConfig();
  location.reload();
}
</script>

<template>
  <div class="setting-container">
    <h4>Layout Configuration</h4>
    <SelectLayoutMode />
    <el-divider />
    <h4>Feature Configuration</h4>
    <div v-for="(settingValue, settingName, index) in switchSettings" :key="index" class="setting-item">
      <span class="setting-name">{{ settingName }}</span>
      <el-switch v-model="settingValue.value" :disabled="!isLeft && settingName === 'Fixed Header'" />
    </div>
    <el-button type="danger" :icon="Refresh" @click="resetLayoutsConfig">
      Reset
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
@import '@@/assets/styles/mixins.scss';

.setting-container {
  padding: 20px;
  .setting-item {
    font-size: 14px;
    color: var(--el-text-color-regular);
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .setting-name {
      @extend %ellipsis;
    }
  }
  .el-button {
    margin-top: 40px;
    width: 100%;
  }
}
</style>
