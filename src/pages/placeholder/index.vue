<script setup lang="ts">
import type { IBlackDomain } from '@/@types';
import { Plus, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { addBlackDomain, deleteBlackDomain, getBlackDomainList, updateBlackDomain } from '@/common/apis/black_domain';
import { usePagination } from '@/common/composables/usePagination';

interface TBlackDomainForm {
  id?: string;
  domain: string;
  is_cheat: boolean;
}

const loadingProgress = ref<boolean>(false);
const savingProgress = ref<boolean>(false);
const deletingProgress = ref<boolean>(false);

const blackDomainFormRef = useTemplateRef('signedAppFormRef');
const searchFormRef = useTemplateRef('searchFormRef');

const searchFormData = ref({ domain: '' });
const blackDomainList = ref<IBlackDomain[]>([]);

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

const blackDomainDialogVisible = ref<boolean>(false);
const blackDomainDialogTitle = ref<string>('');
const blackDomainFormData = ref<TBlackDomainForm>({ id: '', domain: '', is_cheat: true });
const blackDomainFormRules = ref({
  domain: [{ required: true, message: 'The domain is required', trigger: 'blur' }],
  is_cheat: [{ required: true, message: 'The cheat is required', trigger: 'blur' }]
});

function searchBlackDomainList() {
  if (loadingProgress.value)
    return;

  loadingProgress.value = true;

  getBlackDomainList({
    domain: searchFormData.value.domain,
    curPage: paginationData.currentPage,
    pageSize: paginationData.pageSize
  })
    .then((res) => {
      if (res.success && res.data && res.pagination) {
        blackDomainList.value = res.data.block_domain_list;
        paginationData.total = res.pagination.total;
      } else {
        blackDomainList.value = [];
        paginationData.total = 0;
      }
    })
    .finally(() => {
      loadingProgress.value = false;
    });
}

function handleBlackDomainDialogOpen(row?: IBlackDomain) {
  if (row) {
    blackDomainDialogTitle.value = 'Edit';
    blackDomainFormData.value = { ...row };
  } else {
    blackDomainDialogTitle.value = 'Add New';
    blackDomainFormData.value = { id: '', domain: '', is_cheat: true };
  }
  blackDomainDialogVisible.value = true;
}

function handleSave() {
  if (savingProgress.value)
    return;

  savingProgress.value = true;
  blackDomainFormRef.value?.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('Form validation failed.');
      savingProgress.value = false;
      return;
    }

    if (blackDomainFormData.value.id) {
      updateBlackDomain(blackDomainFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to update.');
            blackDomainDialogVisible.value = false;
            searchBlackDomainList();
          } else {
            ElMessage.error(res.message || 'Update failed.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    } else {
      addBlackDomain(blackDomainFormData.value)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to add.');
            blackDomainDialogVisible.value = false;
            searchBlackDomainList();
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

function handleDelete(row: IBlackDomain) {
  ElMessageBox.confirm(`Are you sure to delete this domain "${row.domain}"?`, 'Confirm', { type: 'warning' })
    .then(() => {
      if (!row.id) return;
      if (deletingProgress.value) return;

      deletingProgress.value = true;

      deleteBlackDomain(row.id)
        .then((res) => {
          if (res.success) {
            searchBlackDomainList();
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
  searchBlackDomainList();
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], searchBlackDomainList, { immediate: true });
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" ref="searchFormRef" :model="searchFormData">
        <el-form-item label="Domain" prop="domain">
          <el-input v-model="searchFormData.domain" placeholder="Search domain" clearable />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            @click="searchBlackDomainList"
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
            <el-button type="primary" :icon="Plus" circle @click="handleBlackDomainDialogOpen()" />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="searchBlackDomainList" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="blackDomainList" stripe>
          <el-table-column prop="domain" label="Domain" />
          <el-table-column prop="is_cheat" label="Cheat">
            <template #default="{ row }">
              <el-tag v-if="row.is_cheat" type="success">
                Yes
              </el-tag>
              <el-tag v-else type="danger">
                No
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Action" width="150">
            <template #default="{ row }">
              <el-button type="primary" plain size="small" @click="handleBlackDomainDialogOpen(row)">
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

    <el-dialog :title="blackDomainDialogTitle" v-model="blackDomainDialogVisible" width="500px">
      <el-form
        :model="blackDomainFormData"
        :rules="blackDomainFormRules"
        ref="signedAppFormRef"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="Domain" prop="domain">
          <el-input v-model="blackDomainFormData.domain" />
        </el-form-item>
        <el-form-item label="Cheat" prop="is_cheat">
          <el-switch v-model="blackDomainFormData.is_cheat" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="blackDomainDialogVisible = false">
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
