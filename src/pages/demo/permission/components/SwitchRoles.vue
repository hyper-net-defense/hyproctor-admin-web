<script lang="ts" setup>
import { useUserStore } from '@/pinia/stores/user';

const userStore = useUserStore();

const switchRoles = ref(userStore.user.roles[0]);

watch(switchRoles, (value) => {
  userStore.changeRoles(value);
});
</script>

<template>
  <el-card shadow="never">
    <div>
      <span>Your role: </span>
      <el-tag v-for="(role, index) in userStore.user.roles" :key="index" effect="plain" size="large">
        {{ role }}
      </el-tag>
    </div>
    <div class="switch-roles">
      <span>Switch user: </span>
      <el-radio-group v-model="switchRoles">
        <el-radio-button label="editor" value="editor" />
        <el-radio-button label="admin" value="admin" />
      </el-radio-group>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.switch-roles {
  margin-top: 15px;
  display: flex;
  align-items: center;
}
</style>
