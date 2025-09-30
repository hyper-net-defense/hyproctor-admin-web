<script lang="ts" setup>
import SwitchRoles from './components/SwitchRoles.vue';
</script>

<template>
  <div class="app-container">
    <SwitchRoles />
    <el-card shadow="never" class="content">
      This page is only visible to users with "Admin" role. You won't be able to access this page after switching roles.
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.content {
  margin-top: 20px;
}
</style>
