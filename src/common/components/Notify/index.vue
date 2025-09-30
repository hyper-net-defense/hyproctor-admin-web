<script lang="ts" setup>
import type { NotifyItem } from './type';
import { Bell } from '@element-plus/icons-vue';
import { messageData, notifyData, todoData } from './data';
import List from './List.vue';

type TabName = 'Notification' | 'Message' | 'Todo';

interface DataItem {
  name: TabName;
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  list: NotifyItem[];
}

/** Current badge value */
const badgeValue = computed(() => data.value.reduce((sum, item) => sum + item.list.length, 0));

/** Badge max value */
const badgeMax = 99;

/** Panel width */
const popoverWidth = 350;

/** Current Tab */
const activeName = ref<TabName>('Notification');

/** All data */
const data = ref<DataItem[]>([
  // Notification data
  {
    name: 'Notification',
    type: 'primary',
    list: notifyData
  },
  // Message data
  {
    name: 'Message',
    type: 'danger',
    list: messageData
  },
  // Todo data
  {
    name: 'Todo',
    type: 'warning',
    list: todoData
  }
]);

function handleHistory() {
  ElMessage.success(`Go to ${activeName.value} history page`);
}
</script>

<template>
  <div class="notify">
    <el-popover placement="bottom" :width="popoverWidth" trigger="click">
      <template #reference>
        <el-badge :value="badgeValue" :max="badgeMax" :hidden="badgeValue === 0">
          <el-tooltip effect="dark" content="Notification" placement="bottom">
            <el-icon :size="20">
              <Bell />
            </el-icon>
          </el-tooltip>
        </el-badge>
      </template>
      <template #default>
        <el-tabs v-model="activeName" class="demo-tabs" stretch>
          <el-tab-pane v-for="(item, index) in data" :key="index" :name="item.name">
            <template #label>
              {{ item.name }}
              <el-badge :value="item.list.length" :max="badgeMax" :type="item.type" />
            </template>
            <el-scrollbar height="400px">
              <List :data="item.list" />
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
        <div class="notify-history">
          <el-button link @click="handleHistory">
            View {{ activeName }} history
          </el-button>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.notify-history {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color);
}
</style>
