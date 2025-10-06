<script setup lang="ts">
import type { IVirtualCamera } from '@/@types';
import { Plus, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { addVirtualCamera, deleteVirtualCamera, getVirtualCameraList, updateVirtualCamera } from '@/common/apis/virtual_camera';
import { usePagination } from '@/common/composables/usePagination';

interface TVirtualCameraForm {
  id?: string;
  name: string;
  pattern: string;
}

const loadingProgress = ref<boolean>(false);
const savingProgress = ref<boolean>(false);
const deletingProgress = ref<boolean>(false);

const searchFormData = ref({ name: '' });
const searchFormRef = useTemplateRef('searchFormRef');
const virtualCameraList = ref<IVirtualCamera[]>([]);

const virtualCameraDialogVisible = ref<boolean>(false);
const virtualCameraDialogTitle = ref<string>('');
const virtualCameraFormData = ref<TVirtualCameraForm>({ id: '', name: '', pattern: '' });
const virtualCameraFormRules = reactive({
  name: [{ required: true, trigger: 'blur', message: 'The name is required.' }],
  pattern: [{ required: true, trigger: 'blur', message: 'The pattern is required.' }]
});
const virtualCameraFormRef = useTemplateRef('virtualCameraFormRef');

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

function searchVirtualCameraList() {
  if (loadingProgress.value) return;

  loadingProgress.value = true;
  const payload = {
    name: searchFormData.value.name,
    curPage: paginationData.currentPage,
    pageSize: paginationData.pageSize
  };
  getVirtualCameraList(payload)
    .then((res) => {
      if (res.success && res.data && res.pagination) {
        virtualCameraList.value = res.data.virtual_camera_list;
        paginationData.total = res.pagination.total;
      } else {
        virtualCameraList.value = [];
        paginationData.total = 0;
      }
    })
    .finally(() => {
      loadingProgress.value = false;
    });
}

function handleVirtualCameraDialogOpen(row?: IVirtualCamera) {
  if (row) {
    virtualCameraDialogTitle.value = 'Edit Virtual Camera';
    virtualCameraFormData.value = { ...row };
  } else {
    virtualCameraDialogTitle.value = 'Add Virtual Camera';
    virtualCameraFormData.value = { id: '', name: '', pattern: '' };
  }
  virtualCameraDialogVisible.value = true;
}

function handleSave() {
  if (savingProgress.value) return;

  savingProgress.value = true;

  virtualCameraFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      ElMessage.error('The form validation failed.');
      savingProgress.value = false;
      return;
    }

    if (virtualCameraFormData.value.id) {
      updateVirtualCamera(virtualCameraFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to update.');
            virtualCameraDialogVisible.value = false;
            searchVirtualCameraList();
          } else {
            ElMessage.error(res.message || 'Failed to update.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    } else {
      addVirtualCamera(virtualCameraFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to add.');
            virtualCameraDialogVisible.value = false;
            searchVirtualCameraList();
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

function handleDelete(row: IVirtualCamera) {
  ElMessageBox.confirm(`Are you sure to delete this app "${row.name}"?`, 'Confirm', { type: 'warning' })
    .then(() => {
      if (!row.id) return;
      if (deletingProgress.value) return;

      deletingProgress.value = true;

      deleteVirtualCamera(row.id)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to delete.');
            searchVirtualCameraList();
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
  searchVirtualCameraList();
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], searchVirtualCameraList, { immediate: true });
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" ref="searchFormRef" :model="searchFormData">
        <el-form-item label="Name" prop="name">
          <el-input v-model="searchFormData.name" placeholder="Search name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="searchVirtualCameraList">
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
            <el-button type="primary" :icon="Plus" circle @click="handleVirtualCameraDialogOpen()" />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="searchVirtualCameraList" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="virtualCameraList" stripe>
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="pattern" label="Pattern" />
          <el-table-column label="Action" width="150">
            <template #default="{ row }">
              <el-button
                plain
                type="primary"
                size="small"
                @click="handleVirtualCameraDialogOpen(row)"
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
    <el-dialog :title="virtualCameraDialogTitle" v-model="virtualCameraDialogVisible" width="500px">
      <el-form :model="virtualCameraFormData" :rules="virtualCameraFormRules" ref="virtualCameraFormRef" label-width="120px" label-position="left">
        <el-form-item label="Name" prop="name">
          <el-input v-model="virtualCameraFormData.name" />
        </el-form-item>
        <el-form-item label="Pattern" prop="pattern">
          <el-input v-model="virtualCameraFormData.pattern" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="virtualCameraDialogVisible = false">
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
