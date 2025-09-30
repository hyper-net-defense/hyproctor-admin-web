<script lang="ts" setup>
import { useWatermark } from '@@/composables/useWatermark';

const localRef = useTemplateRef('localRef');

const { setWatermark, clearWatermark } = useWatermark(localRef);

const { setWatermark: setGlobalWatermark, clearWatermark: clearGlobalWatermark } = useWatermark();
</script>

<template>
  <div class="app-container">
    <el-alert
      title="Example Description"
      type="primary"
      description="Enable or disable watermarks by calling the composable. Supports local/global scope, custom styles (color, opacity, font size, font family, rotation angle, etc.), with built-in protection (against deletion/hiding) and responsive behavior"
      show-icon
    />
    <el-card header="Example" shadow="never">
      <div ref="localRef" class="local" />
      <template #footer>
        <el-button-group>
          <el-button type="primary" @click="setWatermark('Local Watermark', { color: '#409eff' })">
            Create Local Watermark
          </el-button>
          <el-button type="warning" @click="setWatermark('Unprotected Local Watermark', { color: '#e6a23c', defense: false })">
            Create Unprotected Local
          </el-button>
          <el-button type="danger" @click="clearWatermark">
            Clear Local Watermark
          </el-button>
        </el-button-group>
        <el-button-group>
          <el-button type="primary" @click="setGlobalWatermark('Global Watermark', { color: '#409eff' })">
            Create Global Watermark
          </el-button>
          <el-button type="warning" @click="setGlobalWatermark('Unprotected Global Watermark', { color: '#e6a23c', defense: false })">
            Create Unprotected Global
          </el-button>
          <el-button type="danger" @click="clearGlobalWatermark">
            Clear Global Watermark
          </el-button>
        </el-button-group>
      </template>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 20px;
}

.el-card {
  margin-bottom: 20px;
}

.local {
  height: 35vh;
  border: 2px dashed var(--el-color-primary);
}

.el-button-group {
  margin-right: 12px;
  margin-bottom: 5px;
}
</style>
