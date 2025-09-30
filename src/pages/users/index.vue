<script lang="ts" setup>
import type { FormRules } from 'element-plus';
import type { IUser } from 'types';
import type { UpdateUserStatusRequestData } from '@/common/apis/users/type';
import { getUserList, updateStatus } from '@/common/apis/users';
import { usePagination } from '@@/composables/usePagination';
import { Download, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import { cloneDeep } from 'lodash-es';

interface UserFormData {
  ms_id?: string;
  email: string;
  status: string;
}

defineOptions({
  // Name the current component
  name: 'ElementPlus'
});

const loading = ref<boolean>(false);
const confirmProgress = ref<boolean>(false);
const downloadLoading = ref<boolean>(false);

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

// #region Create
const DEFAULT_FORM_DATA: UserFormData = {
  email: '',
  status: '0'
};

const dialogVisible = ref<boolean>(false);

const formRef = useTemplateRef('formRef');

const formData = ref<UserFormData>(cloneDeep(DEFAULT_FORM_DATA));
const statusOptions = [
  {
    label: 'Active',
    value: '0'
  },
  {
    label: 'Suspend',
    value: '1'
  },
  {
    label: 'Inacitve',
    value: '2'
  }
];

// Plan options
const planOptions = [
  { label: 'Select All', value: -1 },
  { label: 'Free', value: 0 },
  { label: 'Pro', value: 1 },
  { label: 'Enterprise', value: 2 }
];

const formRules: FormRules<UserFormData> = {
  email: [{ required: true, trigger: 'blur', message: 'Please enter user email.' }],
  status: [{ required: true, trigger: 'blur', message: 'Please select user status.' }]
};

function handleUpdateStatus() {
  if (!formData.value.ms_id) return;
  if (confirmProgress.value) return;

  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error('Form validation failed');
      return;
    }
    confirmProgress.value = true;
    const data: UpdateUserStatusRequestData = {
      ms_id: formData.value.ms_id as string,
      status: Number.parseInt(formData.value.status, 10)
    };
    updateStatus(data).then((res: any) => {
      if (res && res.success) {
        ElMessage.success('Updated status successfully.');
        dialogVisible.value = false;
        searchUser();
      } else {
        ElMessage.error(res?.message || 'Failed to update status');
      }
    }).catch(() => {
      ElMessage.error('Failed to update status');
    }).finally(() => {
      confirmProgress.value = false;
    });
  });
}

function resetForm() {
  formRef.value?.clearValidate();
  formData.value = cloneDeep(DEFAULT_FORM_DATA);
}
// #endregion

// #region Delete
// function handleDelete(row: IUser) {
//   ElMessageBox.confirm(`Deleting user: ${row.name}, confirm deletion?`, 'Warning', {
//     confirmButtonText: 'Confirm',
//     cancelButtonText: 'Cancel',
//     type: 'warning'
//   }).then(() => {
//     deleteUser(row.ms_id).then(() => {
//       ElMessage.success('Deleted successfully');
//       searchUser();
//     });
//   });
// }
// #endregion

// #region Update
function handleUpdate(row: IUser) {
  dialogVisible.value = true;

  formData.value = {
    ms_id: row.ms_id,
    email: row.email,
    status: `${row.status}`
  };
}
// #endregion

// #region Read
const tableData = ref<IUser[]>([]);

const searchFormRef = useTemplateRef('searchFormRef');

const searchData = reactive({
  email: '',
  name: '',
  plan: -1
});

function searchUser() {
  loading.value = true;
  // Compose request payload according to backend API
  const payload: any = {
    name: searchData.name || '',
    email: searchData.email || '',
    plan: searchData.plan >= 0 ? searchData.plan : undefined,
    page: paginationData.currentPage - 1,
    page_size: paginationData.pageSize
  };

  // If plan is Select All (-1), send Membership.COUNT to backend to indicate all plans
  if (searchData.plan === -1) payload.plan = 3; // Membership.COUNT === 3

  getUserList(payload).then((res) => {
    if (!res.success) {
      ElMessage.error(res.message || 'Error');
      return;
    }

    // Backend returns data and pagination fields
    const data = res.data;
    if (data) {
      // support pagination returned either on res.pagination or in the returned data
      // Use any casts because the axios ApiResponseData typing is flexible
      const anyRes: any = res;
      if (anyRes.pagination && typeof anyRes.pagination.total === 'number') {
        paginationData.total = anyRes.pagination.total;
      } else if (data.total_count !== undefined) {
        paginationData.total = data.total_count;
      }

      tableData.value = data.user_list || data;
    }
  }).catch(() => {
    tableData.value = [];
  }).finally(() => {
    loading.value = false;
  });
}

function handleSearch() {
  paginationData.currentPage === 1 ? searchUser() : (paginationData.currentPage = 1);
}

function resetSearch() {
  searchFormRef.value?.resetFields();
  handleSearch();
}
// #endregion

// Watch pagination changes
watch([() => paginationData.currentPage, () => paginationData.pageSize], searchUser, { immediate: true });

/**
 * Download all user data as CSV (no filters, page_size=0)
 */
async function downloadCsv() {
  downloadLoading.value = true;
  try {
    const payload = {
      name: '',
      email: '',
      plan: 3, // Membership.COUNT -> send 3 to indicate all plans
      page: 0,
      page_size: 0
    };
    const res: any = await getUserList(payload);
    if (!res.success) {
      ElMessage.error(res.message || 'Failed to fetch user data');
      return;
    }
    const users = (res.data && (res.data.user_list || res.data)) || [];

    // Build CSV
    const headers = [ 'ms_id', 'name', 'email', 'plan', 'is_admin', 'is_tester', 'status', 'verified' ];
    const rows = users.map((u: any) => headers.map(h => JSON.stringify(u[h] ?? '')).join(','));
    const csv = [headers.join(','), ...rows].join('\n');

    // Trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    ElMessage.success('CSV download started');
  } catch (e) {
    ElMessage.error('Failed to download CSV');
  } finally {
    downloadLoading.value = false;
  }
}
</script>

<template>
  <div class="app-container">
    <!-- <el-alert
      title="Data Source"
      type="success"
      description="Online Mock data provided by Apifox, data is not real, only for basic CRUD demonstration"
      show-icon
    /> -->
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
            <el-form-item prop="email" label="Email">
              <el-input v-model="searchData.email" placeholder="Please enter" />
            </el-form-item>
            <el-form-item prop="name" label="Name">
              <el-input v-model="searchData.name" placeholder="Please enter" />
            </el-form-item>
            <el-form-item prop="plan" label="Plan">
              <el-select v-model="searchData.plan" placeholder="Select Plan" style="width: 160px;">
                <el-option v-for="p in planOptions" :key="p.value" :label="p.label" :value="p.value" />
              </el-select>
            </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            Search
          </el-button>
          <el-button :icon="Refresh" @click="resetSearch">
            Reset
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <!-- <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">
            Add User
          </el-button> -->
          <!-- <el-button type="danger" :icon="Delete">
            Batch Delete
          </el-button> -->
        </div>
        <div>
          <el-tooltip content="Download CSV">
            <el-button :loading="downloadLoading" type="primary" :icon="Download" circle @click="downloadCsv" />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="searchUser" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="Name" align="left">
            <template #default="{ row }">
              <span :style="{ color: row.status === 1 ? 'red' : row.status === 2 ? 'gray' : 'inherit' }">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="Email" align="left" />
          <el-table-column label="Plan" align="left">
            <template #default="{ row }">
              <!-- Plan badge -->
              <el-tag effect="dark" type="info" style="background:#2d8cf0;color:#fff;border-radius:8px;margin-right:6px;" disable-transitions>
                {{ row.plan }}
              </el-tag>
              <!-- Admin / Tester badges -->
              <el-tag v-if="row.is_admin" effect="dark" type="warning" style="background:#f90;color:#fff;border-radius:8px;margin-right:6px;" disable-transitions>Admin</el-tag>
              <el-tag v-if="row.is_tester" effect="dark" type="success" style="background:#19be6b;color:#fff;border-radius:8px;margin-right:6px;" disable-transitions>Tester</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Action" width="150" align="center">
            <template #default="{ row }">
              <el-button type="primary" plain size="small" @click="handleUpdate(row)">Edit</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :current-page="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="!formData.ms_id ? 'Add User' : 'Edit User'"
      width="30%"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="email" label="Email">
          <el-input v-model="formData.email" disabled placeholder="Please enter" />
        </el-form-item>
        <!-- <el-form-item v-if="!formData.ms_id" prop="password" label="Password">
          <el-input v-model="formData.password" placeholder="Please enter" />
        </el-form-item> -->
        <el-form-item prop="status" label="Status">
          <el-select v-model="formData.status" placeholder="Please select">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" :loading="confirmProgress" @click="handleUpdateStatus">
          Confirm
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 20px;
}

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
