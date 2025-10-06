<script setup lang="ts">
import type { ISignedApp } from '@/@types';
import { Plus, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { addSignedApp, deleteSignedApp, getSignedAppList, updateSignedApp } from '@/common/apis/signed_app';
import { usePagination } from '@/common/composables/usePagination';
import { MembershipList } from '@/common/constants';

interface TSignedAppForm {
  id?: string;
  build: string;
  os: string;
  obj_key: string;
  pv_key: string;
  plan: number;
  domain: string;
  is_active: boolean;
}

const loadingProgress = ref<boolean>(false);
const savingProgress = ref<boolean>(false);
const deletingProgress = ref<boolean>(false);

const signedAppFormRef = useTemplateRef('signedAppFormRef');
const searchFormRef = useTemplateRef('searchFormRef');

const searchFormData = ref({ build: '', os: '' });
const signedAppList = ref<ISignedApp[]>([]);

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

const signedAppDialogVisible = ref<boolean>(false);
const signedAppDialogTitle = ref<string>('');
const signedAppFormData = ref<TSignedAppForm>({ id: '', build: '', os: '', obj_key: '', pv_key: '', plan: 0, domain: '', is_active: true });
const signedAppFormRules = ref({
  build: [{ required: true, message: 'The build is required', trigger: 'blur' }],
  os: [{ required: true, message: 'The os is required', trigger: 'blur' }],
  obj_key: [{ required: true, message: 'The object key is required', trigger: 'blur' }],
  pv_key: [{ required: true, message: 'The pv key is required', trigger: 'blur' }],
  plan: [{ required: true, message: 'The plan is required', trigger: 'blur' }],
  is_active: [{ required: true, message: 'The active is required', trigger: 'blur' }]
});

function searchSignedAppList() {
  if (loadingProgress.value)
    return;

  loadingProgress.value = true;

  getSignedAppList({
    build: searchFormData.value.build,
    os: searchFormData.value.os,
    curPage: paginationData.currentPage,
    pageSize: paginationData.pageSize
  })
    .then((res) => {
      if (res.success && res.data && res.pagination) {
        signedAppList.value = res.data.signed_app_list;
        paginationData.total = res.pagination.total;
      } else {
        signedAppList.value = [];
        paginationData.total = 0;
      }
    })
    .finally(() => {
      loadingProgress.value = false;
    });
}

function handleSignedAppDialogOpen(row?: ISignedApp) {
  if (row) {
    signedAppDialogTitle.value = 'Edit';
    signedAppFormData.value = { ...row };
  } else {
    signedAppDialogTitle.value = 'Add New';
    signedAppFormData.value = { id: '', build: '', os: '', obj_key: '', pv_key: '', plan: 0, domain: '', is_active: true };
  }
  signedAppDialogVisible.value = true;
}

function handleSave() {
  if (savingProgress.value)
    return;
  savingProgress.value = true;
  signedAppFormRef.value?.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('Form validation failed.');
      savingProgress.value = false;
      return;
    }

    if (signedAppFormData.value.id) {
      updateSignedApp(signedAppFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to update.');
            signedAppDialogVisible.value = false;
            searchSignedAppList();
          } else {
            ElMessage.error(res.message || 'Update failed.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    } else {
      addSignedApp(signedAppFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to add.');
            signedAppDialogVisible.value = false;
            searchSignedAppList();
          } else {
            ElMessage.error(res.message || 'Save failed.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    }
  });
}

function handleDelete(row: ISignedApp) {
  ElMessageBox.confirm(`Are you sure to delete this app?`, 'Confirm', { type: 'warning' })
    .then(() => {
      if (!row.id) return;
      if (deletingProgress.value) return;

      deletingProgress.value = true;

      deleteSignedApp(row.id)
        .then((res) => {
          if (res.success) {
            searchSignedAppList();
          } else {
            ElMessage.error(res.message || 'Delete failed.');
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
  searchSignedAppList();
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], searchSignedAppList, { immediate: true });
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" ref="searchFormRef" :model="searchFormData">
        <el-form-item label="Build" prop="build">
          <el-input v-model="searchFormData.build" placeholder="Search build" clearable />
        </el-form-item>
        <el-form-item label="OS" prop="os">
          <el-input v-model="searchFormData.os" placeholder="Search os" clearable />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            @click="searchSignedAppList"
          >
            Search
          </el-button>
          <el-button
            :icon="Refresh"
            @click="handleResetSearch"
          >
            Reset
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" v-loading="loadingProgress || deletingProgress">
      <div class="toolbar-wrapper">
        <div />
        <div>
          <el-tooltip content="Add new">
            <el-button type="primary" :icon="Plus" circle @click="handleSignedAppDialogOpen()" />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="searchSignedAppList" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="signedAppList" stripe>
          <el-table-column prop="build" label="Build" />
          <el-table-column prop="os" label="OS" />
          <el-table-column prop="plan" label="Plan">
            <template #default="{ row }">
              <el-tag type="primary">
                {{ MembershipList.find(v => v.id === row.plan)?.text }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="domain" label="Domain" />
          <el-table-column prop="is_active" label="Active">
            <template #default="{ row }">
              <el-tag v-if="row.is_active" type="success">
                Yes
              </el-tag>
              <el-tag v-else type="danger">
                No
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Action" width="150">
            <template #default="{ row }">
              <el-button type="primary" plain size="small" @click="handleSignedAppDialogOpen(row)">
                Edit
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          backround
          :layout="paginationData.layout"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :current-page="paginationData.currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog :title="signedAppDialogTitle" v-model="signedAppDialogVisible" width="500px">
      <el-form
        :model="signedAppFormData"
        :rules="signedAppFormRules"
        ref="signedAppFormRef"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="Build" prop="build">
          <el-input v-model="signedAppFormData.build" />
        </el-form-item>
        <el-form-item label="OS" prop="os">
          <el-input v-model="signedAppFormData.os" />
        </el-form-item>
        <el-form-item label="Obj Key" prop="obj_key">
          <el-input v-model="signedAppFormData.obj_key" />
        </el-form-item>
        <el-form-item label="Pv Key" prop="pv_key">
          <el-input v-model="signedAppFormData.pv_key" />
        </el-form-item>
        <el-form-item label="Plan" prop="plan">
          <el-select v-model="signedAppFormData.plan" placeholder="Select Plan" class="w-full">
            <el-option v-for="membership in MembershipList" :key="membership.id" :label="membership.text" :value="membership.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Domain" prop="domain">
          <el-input v-model="signedAppFormData.domain" />
        </el-form-item>
        <el-form-item label="Active" prop="is_active">
          <el-switch v-model="signedAppFormData.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="signedAppDialogVisible = false">
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
