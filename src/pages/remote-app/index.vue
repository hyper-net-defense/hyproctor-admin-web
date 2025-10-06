<script setup lang="ts">
import type { IRemoteApp } from '@/@types';
import { Plus, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { addRemoteApp, deleteRemoteApp, getRemoteAppList, updateRemoteApp } from '@/common/apis/remote_app';
import { usePagination } from '@/common/composables/usePagination';

interface TRemoteAppForm {
  id?: string;
  name: string;
  link: string;
  process_win: string;
  process_mac: string;
}

const loadingProgress = ref<boolean>(false);
const savingProgress = ref<boolean>(false);
const deletingProgress = ref<boolean>(false);

const searchFormData = ref({ name: '' });
const searchFormRef = useTemplateRef('searchFormRef');
const remoteAppList = ref<IRemoteApp[]>([]);

const remoteAppDialogVisible = ref<boolean>(false);
const remoteAppDialogTitle = ref<string>('');
const remoteAppFormData = ref<TRemoteAppForm>({ id: '', name: '', link: '', process_win: '', process_mac: '' });
const remoteAppFormRules = reactive({
  name: [{ required: true, trigger: 'blur', message: 'The name is required.' }],
  link: [{ required: true, trigger: 'blur', message: 'The link is required.' }]
});
const remoteAppFormRef = useTemplateRef('remoteAppFormRef');

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

function searchRemoteAppList() {
  if (loadingProgress.value) return;

  loadingProgress.value = true;
  const payload = {
    name: searchFormData.value.name,
    curPage: paginationData.currentPage,
    pageSize: paginationData.pageSize
  };
  getRemoteAppList(payload)
    .then((res) => {
      if (res.success && res.data && res.pagination) {
        remoteAppList.value = res.data.remote_app_list;
        paginationData.total = res.pagination.total;
      } else {
        remoteAppList.value = [];
        paginationData.total = 0;
      }
    })
    .finally(() => {
      loadingProgress.value = false;
    });
}

function handleRemoteAppDialogOpen(row?: IRemoteApp) {
  if (row) {
    remoteAppDialogTitle.value = 'Edit';
    remoteAppFormData.value = { ...row };
  } else {
    remoteAppDialogTitle.value = 'Add New';
    remoteAppFormData.value = { id: '', name: '', link: '', process_win: '', process_mac: '' };
  }
  remoteAppDialogVisible.value = true;
}

function handleSave() {
  if (savingProgress.value) return;

  savingProgress.value = true;

  remoteAppFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      ElMessage.error('The form validation failed.');
      savingProgress.value = false;
      return;
    }

    if (remoteAppFormData.value.id) {
      updateRemoteApp(remoteAppFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to update.');
            remoteAppDialogVisible.value = false;
            searchRemoteAppList();
          } else {
            ElMessage.error('Failed to update.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    } else {
      addRemoteApp(remoteAppFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to add.');
            remoteAppDialogVisible.value = false;
            searchRemoteAppList();
          } else {
            ElMessage.error('Failed to add.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    }
  });
}

function handleDelete(row: IRemoteApp) {
  ElMessageBox.confirm(`Are you sure to delete this app "${row.name}"?`, 'Confirm', { type: 'warning' })
    .then(() => {
      if (!row.id) return;
      if (deletingProgress.value) return;

      deletingProgress.value = true;

      deleteRemoteApp(row.id)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to delete.');
            searchRemoteAppList();
          } else {
            ElMessage.error('');
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
  searchRemoteAppList();
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], searchRemoteAppList, { immediate: true });
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" ref="searchFormRef" :model="searchFormData">
        <el-form-item label="Name" prop="name">
          <el-input v-model="searchFormData.name" placeholder="Search name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="searchRemoteAppList">
            Search
          </el-button>
          <el-button :icon="Refresh" @click="handleResetSearch">
            Reset
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loadingProgress || deletingProgress" shadow="never">
      <div class="toolbar-wrapper">
        <div />
        <div>
          <el-tooltip content="Add new">
            <el-button type="primary" :icon="Plus" circle @click="handleRemoteAppDialogOpen()" />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="searchRemoteAppList" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="remoteAppList" stripe>
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="link" label="Link" />
          <el-table-column prop="process_win" label="Win Process" />
          <el-table-column prop="process_mac" label="Mac Process" />
          <el-table-column label="Action" width="150">
            <template #default="{ row }">
              <el-button
                plain
                type="primary"
                size="small"
                @click="handleRemoteAppDialogOpen(row)"
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
    <el-dialog :title="remoteAppDialogTitle" v-model="remoteAppDialogVisible" width="500px">
      <el-form :model="remoteAppFormData" :rules="remoteAppFormRules" ref="remoteAppFormRef" label-width="120px" label-position="left">
        <el-form-item label="Name" prop="name">
          <el-input v-model="remoteAppFormData.name" />
        </el-form-item>
        <el-form-item label="Link" prop="link">
          <el-input v-model="remoteAppFormData.link" />
        </el-form-item>
        <el-form-item label="Win Process" prop="process_win">
          <el-input v-model="remoteAppFormData.process_win" />
        </el-form-item>
        <el-form-item label="Mac Process" prop="process_mac">
          <el-input v-model="remoteAppFormData.process_mac" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="remoteAppDialogVisible = false">
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
