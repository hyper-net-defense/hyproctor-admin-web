<script setup lang="ts">
import type { INotificationEmail } from '@/@types';
import { Plus, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { addNotifyEmail, deleteNotifyEmail, getNotifyEmailList, updateNotifyEmail } from '@/common/apis/notify_email';
import { usePagination } from '@/common/composables/usePagination';

interface TNotificationEmailForm {
  id?: string;
  name: string;
  email: string;
}

const loadingProgress = ref<boolean>(false);
const savingProgress = ref<boolean>(false);
const deletingProgress = ref<boolean>(false);

const searchFormData = ref({ email: '' });
const searchFormRef = useTemplateRef('searchFormRef');
const notificationEmailList = ref<INotificationEmail[]>([]);

const notificationEmailDialogVisible = ref<boolean>(false);
const notificationEmailDialogTitle = ref<string>('');
const notificationEmailFormData = ref<TNotificationEmailForm>({ id: '', name: '', email: '' });
const notificationEmailFormRules = reactive({
  name: [{ required: true, trigger: 'blur', message: 'The name is required.' }],
  email: [{ required: true, trigger: 'blur', message: 'The pattern is required.' }]
});
const notificationEmailFormRef = useTemplateRef('notificationEmailFormRef');

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

function searchNotificationEmailList() {
  if (loadingProgress.value) return;

  loadingProgress.value = true;
  const payload = {
    email: searchFormData.value.email,
    curPage: paginationData.currentPage,
    pageSize: paginationData.pageSize
  };
  getNotifyEmailList(payload)
    .then((res) => {
      if (res.success && res.data && res.pagination) {
        notificationEmailList.value = res.data.notification_email_list;
        paginationData.total = res.pagination.total;
      } else {
        notificationEmailList.value = [];
        paginationData.total = 0;
      }
    })
    .finally(() => {
      loadingProgress.value = false;
    });
}

function handleNotificationEmailDialogOpen(row?: INotificationEmail) {
  if (row) {
    notificationEmailDialogTitle.value = 'Edit Notification Email';
    notificationEmailFormData.value = { ...row };
  } else {
    notificationEmailDialogTitle.value = 'Add Notification Email';
    notificationEmailFormData.value = { id: '', name: '', email: '' };
  }
  notificationEmailDialogVisible.value = true;
}

function handleSave() {
  if (savingProgress.value) return;

  savingProgress.value = true;

  notificationEmailFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      ElMessage.error('The form validation failed.');
      savingProgress.value = false;
      return;
    }

    if (notificationEmailFormData.value.id) {
      updateNotifyEmail(notificationEmailFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to update.');
            notificationEmailDialogVisible.value = false;
            searchNotificationEmailList();
          } else {
            ElMessage.error(res.message || 'Failed to update.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    } else {
      addNotifyEmail(notificationEmailFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to add.');
            notificationEmailDialogVisible.value = false;
            searchNotificationEmailList();
          } else {
            ElMessage.error(res.message || 'Failed to add.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    }
  });
}

function handleDelete(row: INotificationEmail) {
  ElMessageBox.confirm(`Are you sure to delete this email "${row.name}"?`, 'Confirm', { type: 'warning' })
    .then(() => {
      if (!row.id) return;
      if (deletingProgress.value) return;

      deletingProgress.value = true;

      deleteNotifyEmail(row.id)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to delete.');
            searchNotificationEmailList();
          } else {
            ElMessage.error(res.message || 'Failed to delete.');
          }
        })
        .finally(() => {
          deletingProgress.value = false;
        });
    })
    .catch(() => {
      deletingProgress.value = false;
    });
}

function handleResetSearch() {
  searchFormRef.value?.resetFields();
  searchNotificationEmailList();
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], searchNotificationEmailList, { immediate: true });
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" ref="searchFormRef" :model="searchFormData">
        <el-form-item label="Email" prop="email">
          <el-input v-model="searchFormData.email" placeholder="Search email" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="searchNotificationEmailList">
            Search
          </el-button>
          <el-button :icon="Refresh" @click="handleResetSearch">
            Reset
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loadingProgress" shadow="never">
      <div class="toolbar-wrapper">
        <div />
        <div>
          <el-tooltip content="Add new">
            <el-button type="primary" :icon="Plus" circle @click="handleNotificationEmailDialogOpen()" />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="searchNotificationEmailList" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="notificationEmailList" stripe>
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="email" label="Email" />
          <el-table-column label="Action" width="150">
            <template #default="{ row }">
              <el-button
                plain
                type="primary"
                size="small"
                @click="handleNotificationEmailDialogOpen(row)"
              >
                Edit
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(row)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :current-page="paginationData.currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
    <el-dialog :title="notificationEmailDialogTitle" v-model="notificationEmailDialogVisible" width="500px">
      <el-form :model="notificationEmailFormData" :rules="notificationEmailFormRules" ref="notificationEmailFormRef" label-width="120px" label-position="left">
        <el-form-item label="Name" prop="name">
          <el-input v-model="notificationEmailFormData.name" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="notificationEmailFormData.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="notificationEmailDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" :loading="savingProgress" @click="handleSave">
          Save
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
