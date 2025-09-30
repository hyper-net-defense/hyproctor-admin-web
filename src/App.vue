<script lang="ts" setup>
import { useGreyAndColorWeakness } from '@@/composables/useGreyAndColorWeakness';
// import { usePany } from '@@/composables/usePany';
import { useTheme } from '@@/composables/useTheme';
import En from 'element-plus/es/locale/lang/en'; // Element Plus English package

const { initTheme } = useTheme();

const { initGreyAndColorWeakness } = useGreyAndColorWeakness();

// const { initStarNotification, initStoreNotification, initMobileNotification } = usePany();

// Initialize theme
initTheme();

// Initialize grey mode and color weakness mode
initGreyAndColorWeakness();

// #region Initialize notifications
// initStarNotification();

// initStoreNotification();

// initMobileNotification();
// #endregion
</script>

<template>
  <el-config-provider :locale="En">
    <router-view />
  </el-config-provider>
</template>
