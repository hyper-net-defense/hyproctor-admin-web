<script setup lang="ts">
import type { ISignedApp } from '@/@types';
import { Refresh, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { addSignedApp, deleteSignedApp, getSignedAppList, updateSignedApp } from '@/common/apis/signed_app';
import { usePagination } from '@/common/composables/usePagination';

interface TSignedAppForm {
  id: string;
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
const signedAppFormRef = useTemplateRef('signedAppFormRef');
const searchFormRef = useTemplateRef('searchFormRef');

const filters = ref({ build: '', os: '' });
const signedAppList = ref<ISignedApp[]>([]);

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

const signedAppDialogVisible = ref<boolean>(false);
const signedAppDialogTitle = ref<string>('');
const signedAppForm = ref<TSignedAppForm>({ id: '', build: '', os: '', obj_key: '', pv_key: '', plan: 0, domain: '', is_active: true });
const signedAppFormRules = ref({
  build: [{ required: true, message: 'The build is required', trigger: 'blur' }],
  os: [{ required: true, message: 'The os is required', trigger: 'blur' }],
  obj_key: [{ required: true, message: 'The object key is required', trigger: 'blur' }],
  pv_key: [{ required: true, message: 'The pv key is required', trigger: 'blur' }],
  plan: [{ required: true, message: 'The plan is required', trigger: 'blur' }],
  domain: [{ required: true, message: 'The domain is required', trigger: 'blur' }]
});

function searchSignedAppList() {
  if (loadingProgress.value)
    return;

  getSignedAppList({
    build: filters.value.build,
    os: filters.value.os,
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

function openSignedAppDialog(row?: any) {
  if (row) {
    signedAppDialogTitle.value = 'Edit';
    signedAppForm.value = { ...row };
  } else {
    signedAppDialogTitle.value = 'Add New';
    signedAppForm.value = { id: '', build: '', os: '', obj_key: '', pv_key: '', plan: 0, domain: '', is_active: true };
  }
  signedAppDialogVisible.value = true;
}

function handleSave() {
  if (savingProgress.value)
    return;

  signedAppFormRef.value?.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('Form validation failed.');
      return;
    }

    if (signedAppForm.value.id) {
      updateSignedApp(signedAppForm.value)
        .then((res) => {
          if (res.success) {
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
      addSignedApp(signedAppForm.value)
        .then((res) => {
          if (res.success) {
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

function handleDelete(id: string) {
  deleteSignedApp(id)
    .then((res) => {
      if (res.success) {
        searchSignedAppList();
      } else {
        ElMessage.error(res.message || 'Delete failed.');
      }
    });
}

function resetSearch() {
  searchFormRef.value?.resetFields();
  searchSignedAppList();
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], searchSignedAppList, { immediate: true });
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loadingProgress" class="search-wrapper">
      <el-form :inline="true" ref="searchFormRef" v-model="filters">
        <el-form-item>
          <el-input v-model="filters.build" placeholder="Build" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.os" placeholder="OS" clearable />
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
            @click="resetSearch"
          >
            Reset
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <div class="toolbar-wrapper">
        <div />
        <div>
          <el-tooltip content="Add Signed App">
            <el-button type="primary" @click="openSignedAppDialog">
              + Add New
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="signedAppList" stripe>
          <el-table-column prop="build" label="Build" />
          <el-table-column prop="os" label="OS" />
          <el-table-column prop="plan" label="Plan" />
          <el-table-column prop="domain" label="Domain" />
          <el-table-column prop="is_active" label="Active" />
          <el-table-column label="Action">
            <template #default="{ row }">
              <el-button type="primary" plain size="small" @click="openSignedAppDialog(row)">
                Edit
              </el-button>
              <el-button type="primary" plain size="small" @click="handleDelete(row.id)">
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
        :model="signedAppForm"
        :rules="signedAppFormRules"
        ref="signedAppFormRef"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="Build" prop="build">
          <el-input v-model="signedAppForm.build" />
        </el-form-item>
        <el-form-item label="OS" prop="os">
          <el-input v-model="signedAppForm.os" />
        </el-form-item>
        <el-form-item label="Obj Key" prop="obj_key">
          <el-input v-model="signedAppForm.obj_key" />
        </el-form-item>
        <el-form-item label="Pv Key" prop="pv_key">
          <el-input v-model="signedAppForm.pv_key" />
        </el-form-item>
        <el-form-item label="Plan" prop="plan">
          <el-input v-model="signedAppForm.plan" />
        </el-form-item>
        <el-form-item label="Domain" prop="domain">
          <el-input v-model="signedAppForm.domain" />
        </el-form-item>
        <el-form-item label="Active" prop="is_active">
          <el-switch v-model="signedAppForm.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="signedAppDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="handleSave">
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
