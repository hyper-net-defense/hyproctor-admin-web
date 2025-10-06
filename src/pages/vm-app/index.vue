<script setup lang="ts">
import type { IVmApp } from '@/@types';
import { Plus, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { addVmApp, deleteVmApp, getVmAppList, updateVmApp } from '@/common/apis/vm_app';
import { usePagination } from '@/common/composables/usePagination';

interface TVmAppForm {
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
const vmAppList = ref<IVmApp[]>([]);

const vmAppDialogVisible = ref<boolean>(false);
const vmAppDialogTitle = ref<string>('');
const vmAppFormData = ref<TVmAppForm>({ id: '', name: '', link: '', process_win: '', process_mac: '' });
const vmAppFormRules = reactive({
  name: [{ required: true, trigger: 'blur', message: 'The name is required.' }],
  link: [{ required: true, trigger: 'blur', message: 'The link is required.' }]
});
const vmAppFormRef = useTemplateRef('vmAppFormRef');

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

function searchVmAppList() {
  if (loadingProgress.value) return;

  loadingProgress.value = true;
  const payload = {
    name: searchFormData.value.name,
    curPage: paginationData.currentPage,
    pageSize: paginationData.pageSize
  };
  getVmAppList(payload)
    .then((res) => {
      if (res.success && res.data && res.pagination) {
        vmAppList.value = res.data.vm_app_list;
        paginationData.total = res.pagination.total;
      } else {
        vmAppList.value = [];
        paginationData.total = 0;
      }
    })
    .finally(() => {
      loadingProgress.value = false;
    });
}

function handleVmAppDialogOpen(row?: IVmApp) {
  if (row) {
    vmAppDialogTitle.value = 'Edit';
    vmAppFormData.value = { ...row };
  } else {
    vmAppDialogTitle.value = 'Add New';
    vmAppFormData.value = { id: '', name: '', link: '', process_win: '', process_mac: '' };
  }
  vmAppDialogVisible.value = true;
}

function handleSave() {
  if (savingProgress.value) return;

  savingProgress.value = true;

  vmAppFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      ElMessage.error('The form validation failed.');
      savingProgress.value = false;
      return;
    }

    if (vmAppFormData.value.id) {
      updateVmApp(vmAppFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to update.');
            vmAppDialogVisible.value = false;
            searchVmAppList();
          } else {
            ElMessage.error('Failed to update.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    } else {
      addVmApp(vmAppFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to add.');
            vmAppDialogVisible.value = false;
            searchVmAppList();
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

function handleDelete(row: IVmApp) {
  ElMessageBox.confirm(`Are you sure to delete this app "${row.name}"?`, 'Confirm', { type: 'warning' })
    .then(() => {
      if (!row.id) return;
      if (deletingProgress.value) return;

      deletingProgress.value = true;

      deleteVmApp(row.id)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to delete.');
            searchVmAppList();
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
  searchVmAppList();
}

watch([paginationData.currentPage, paginationData.pageSize], searchVmAppList, { immediate: true });
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" ref="searchFormRef" :model="searchFormData">
        <el-form-item label="Name" prop="name">
          <el-input v-model="searchFormData.name" placeholder="Search name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="searchVmAppList">
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
            <el-button type="primary" :icon="Plus" circle @click="handleVmAppDialogOpen()" />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="searchVmAppList" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="vmAppList" stripe>
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
                @click="handleVmAppDialogOpen(row)"
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
    <el-dialog :title="vmAppDialogTitle" v-model="vmAppDialogVisible" width="500px">
      <el-form :model="vmAppFormData" :rules="vmAppFormRules" ref="vmAppFormRef" label-width="120px" label-position="left">
        <el-form-item label="Name" prop="name">
          <el-input v-model="vmAppFormData.name" />
        </el-form-item>
        <el-form-item label="Link" prop="link">
          <el-input v-model="vmAppFormData.link" />
        </el-form-item>
        <el-form-item label="Win Process" prop="process_win">
          <el-input v-model="vmAppFormData.process_win" />
        </el-form-item>
        <el-form-item label="Mac Process" prop="process_mac">
          <el-input v-model="vmAppFormData.process_mac" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="vmAppDialogVisible = false">
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
