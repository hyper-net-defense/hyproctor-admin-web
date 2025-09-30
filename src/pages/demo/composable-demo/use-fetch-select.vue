<script lang="ts" setup>
import { useFetchSelect } from '@@/composables/useFetchSelect';
import { getSelectDataApi } from './apis/use-fetch-select';

const { loading, options, value } = useFetchSelect({
  api: getSelectDataApi
});
</script>

<template>
  <div class="app-container">
    <el-alert
      title="Example Description"
      type="primary"
      description="Automatically calls API via composable to get data needed for Select component and passes it to Select"
      show-icon
    />
    <el-card header="Select Example" shadow="never" v-loading="loading">
      <el-select v-model="value" filterable>
        <el-option v-for="(item, index) in options" v-bind="item" :key="index" placeholder="Please select" />
      </el-select>
    </el-card>
    <el-card header="Select V2 Example (Use this component for large datasets)" shadow="never" v-loading="loading">
      <el-select-v2 v-model="value" :options="options" filterable placeholder="Please select" />
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
