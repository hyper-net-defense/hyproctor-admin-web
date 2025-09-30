<script lang="ts" setup>
import { checkPermission } from '@@/utils/permission';
import SwitchRoles from './components/SwitchRoles.vue';
</script>

<template>
  <div class="app-container">
    <SwitchRoles />
    <el-card header="Permission Directive v-permission Example" shadow="never" class="margin-top-20">
      <el-button v-permission="['admin']">
        admin
      </el-button>
      <el-button v-permission="['admin', 'editor']">
        admin and editor
      </el-button>
    </el-card>
    <el-card header="Permission Function checkPermission Example" shadow="never" class="margin-top-20">
      <el-text type="warning" size="large">
        Element Plus components like el-tab-pane, el-table-column and other dynamically rendered DOM scenarios
        are not suitable for v-permission directive. In these cases, use v-if with checkPermission instead.
      </el-text>
      <el-tabs type="border-card" class="margin-top-20">
        <el-tab-pane v-if="checkPermission(['admin'])" label="admin">
          <el-tag size="large">
            v-if="checkPermission(['admin'])"
          </el-tag>
        </el-tab-pane>
        <el-tab-pane v-if="checkPermission(['admin', 'editor'])" label="admin and editor">
          <el-tag size="large">
            v-if="checkPermission(['admin', 'editor'])"
          </el-tag>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.margin-top-20 {
  margin-top: 20px;
}
</style>
