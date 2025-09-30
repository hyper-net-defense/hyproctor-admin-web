<script lang="ts" setup>
import { useFullscreenLoading } from '@@/composables/useFullscreenLoading';
import { getErrorApi, getSuccessApi } from './apis/use-fullscreen-loading';

const svg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`;

const options = {
  text: 'About to encounter an error...',
  background: '#F56C6C20',
  svg,
  svgViewBox: '-10, -10, 50, 50'
};

async function querySuccess() {
  // Note:
  // 1. getSuccessApi is a function reference, not a function call
  // 2. To pass parameters to getSuccessApi, do it in the following parentheses (actual getSuccessApi call)
  const res = await useFullscreenLoading(getSuccessApi)([1, 2, 3]);
  ElMessage.success(`${res.message} with parameters ${res.data.list.toString()}`);
}

async function queryError() {
  try {
    await useFullscreenLoading(getErrorApi, options)();
  } catch (error) {
    ElMessage.error((error as Error).message);
  }
}
</script>

<template>
  <div class="app-container">
    <el-alert
      title="Example Description"
      type="primary"
      description="Pass the function to be executed to the composable, which will automatically show fullscreen loading and hide it when execution completes"
      show-icon
    />
    <el-card header="Example" shadow="never">
      <el-button type="primary" @click="querySuccess">
        Query Success
      </el-button>
      <el-button type="danger" @click="queryError">
        Query Error
      </el-button>
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
</style>
