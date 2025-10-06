<script setup lang="ts">
import type { IVpnApp } from '@/@types';
import { Plus, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { addVpnApp, deleteVpnApp, getVpnAppList, updateVpnApp } from '@/common/apis/vpn_app';
import { usePagination } from '@/common/composables/usePagination';

interface TVpnAppForm {
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
const vpnAppList = ref<IVpnApp[]>([]);

const vpnAppDialogVisible = ref<boolean>(false);
const vpnAppDialogTitle = ref<string>('');
const vpnAppFormData = ref<TVpnAppForm>({ id: '', name: '', link: '', process_win: '', process_mac: '' });
const vpnAppFormRules = reactive({
  name: [{ required: true, trigger: 'blur', message: 'The name is required.' }],
  link: [{ required: true, trigger: 'blur', message: 'The link is required.' }]
});
const vpnAppFormRef = useTemplateRef('vpnAppFormRef');

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

function searchVpnAppList() {
  if (loadingProgress.value) return;

  loadingProgress.value = true;
  const payload = {
    name: searchFormData.value.name,
    curPage: paginationData.currentPage,
    pageSize: paginationData.pageSize
  };
  getVpnAppList(payload)
    .then((res) => {
      if (res.success && res.data && res.pagination) {
        vpnAppList.value = res.data.vpn_app_list;
        paginationData.total = res.pagination.total;
      } else {
        vpnAppList.value = [];
        paginationData.total = 0;
      }
    })
    .finally(() => {
      loadingProgress.value = false;
    });
}

function handleVpnAppDialogOpen(row?: IVpnApp) {
  if (row) {
    vpnAppDialogTitle.value = 'Edit VPN App';
    vpnAppFormData.value = { ...row };
  } else {
    vpnAppDialogTitle.value = 'Add VPN App';
    vpnAppFormData.value = { id: '', name: '', link: '', process_win: '', process_mac: '' };
  }
  vpnAppDialogVisible.value = true;
}

function handleSave() {
  if (savingProgress.value) return;

  savingProgress.value = true;

  vpnAppFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      ElMessage.error('The form validation failed.');
      savingProgress.value = false;
      return;
    }

    if (vpnAppFormData.value.id) {
      updateVpnApp(vpnAppFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to update.');
            vpnAppDialogVisible.value = false;
            searchVpnAppList();
          } else {
            ElMessage.error(res.message || 'Failed to update.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    } else {
      addVpnApp(vpnAppFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to add.');
            vpnAppDialogVisible.value = false;
            searchVpnAppList();
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

function handleDelete(row: IVpnApp) {
  ElMessageBox.confirm(`Are you sure to delete this app "${row.name}"?`, 'Confirm', { type: 'warning' })
    .then(() => {
      if (!row.id) return;
      if (deletingProgress.value) return;

      deletingProgress.value = true;

      deleteVpnApp(row.id)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to delete.');
            searchVpnAppList();
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
  searchVpnAppList();
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], searchVpnAppList, { immediate: true });
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" ref="searchFormRef" :model="searchFormData">
        <el-form-item label="Name" prop="name">
          <el-input v-model="searchFormData.name" placeholder="Search name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="searchVpnAppList">
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
            <el-button type="primary" :icon="Plus" circle @click="handleVpnAppDialogOpen()" />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="searchVpnAppList" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="vpnAppList" stripe>
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
                @click="handleVpnAppDialogOpen(row)"
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
    <el-dialog :title="vpnAppDialogTitle" v-model="vpnAppDialogVisible" width="500px">
      <el-form :model="vpnAppFormData" :rules="vpnAppFormRules" ref="vpnAppFormRef" label-width="120px" label-position="left">
        <el-form-item label="Name" prop="name">
          <el-input v-model="vpnAppFormData.name" />
        </el-form-item>
        <el-form-item label="Link" prop="link">
          <el-input v-model="vpnAppFormData.link" />
        </el-form-item>
        <el-form-item label="Win Process" prop="process_win">
          <el-input v-model="vpnAppFormData.process_win" />
        </el-form-item>
        <el-form-item label="Mac Process" prop="process_mac">
          <el-input v-model="vpnAppFormData.process_mac" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="vpnAppDialogVisible = false">
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
