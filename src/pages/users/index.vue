<script lang="ts" setup>
import type { FormRules } from 'element-plus';
import type { IUser } from '@/@types';
import { usePagination } from '@@/composables/usePagination';
import { Download, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import { cloneDeep } from 'lodash-es';
import { getUserList, updateStatus } from '@/common/apis/users';
import { Membership, MembershipList } from '@/common/constants';

defineOptions({
  name: 'ElementPlus'
});

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

interface UserFormData {
  ms_id?: string;
  email: string;
  status: string;
}

const loadingProgress = ref<boolean>(false);
const confirmProgress = ref<boolean>(false);
const downloadingProgress = ref<boolean>(false);

const userDialogVisible = ref<boolean>(false);

const userFormRef = useTemplateRef('userFormRef');
const userFormData = ref<UserFormData>(cloneDeep({
  email: '',
  status: '0'
}));
const userFormRules: FormRules<UserFormData> = {
  email: [{ required: true, trigger: 'blur', message: 'The email is required.' }],
  status: [{ required: true, trigger: 'blur', message: 'The status is required.' }]
};

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

function handleUpdateStatus() {
  if (!userFormData.value.ms_id) return;
  if (confirmProgress.value) return;

  userFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      ElMessage.error('Form validation failed.');
      return;
    }

    confirmProgress.value = true;
    const data = {
      ms_id: userFormData.value.ms_id as string,
      status: Number.parseInt(userFormData.value.status, 10)
    };

    updateStatus(data)
      .then((res) => {
        if (res.success) {
          ElMessage.success('Succeed to update.');
          userDialogVisible.value = false;
          searchUser();
        } else {
          ElMessage.error(res.message || 'Failed to update.');
        }
      })
      .catch(() => {
        ElMessage.error('Failed to update.');
      })
      .finally(() => {
        confirmProgress.value = false;
      });
  });
}

function resetForm() {
  userFormRef.value?.clearValidate();
  userFormData.value = {
    email: '',
    status: '0'
  };
}

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

function handleUpdate(row: IUser) {
  userDialogVisible.value = true;

  userFormData.value = {
    ms_id: row.ms_id,
    email: row.email,
    status: `${row.status}`
  };
}

const userList = ref<IUser[]>([]);
const searchFormRef = useTemplateRef('searchFormRef');
const searchFormData = reactive({
  email: '',
  name: '',
  plan: Membership.FREE
});

function searchUser() {
  if (loadingProgress.value) return;

  loadingProgress.value = true;

  const payload = {
    name: searchFormData.name || '',
    email: searchFormData.email || '',
    plan: searchFormData.plan >= Membership.FREE ? searchFormData.plan : undefined,
    page: paginationData.currentPage - 1,
    page_size: paginationData.pageSize
  };

  if (searchFormData.plan === -1) payload.plan = 3; // Membership.COUNT === 3

  getUserList(payload).then((res) => {
    if (!res.success) {
      ElMessage.error(res.message || 'Error');
      return;
    }

    if (res.data && res.pagination) {
      paginationData.total = res.pagination.total;
      userList.value = res.data.user_list;
    }
  }).catch(() => {
    userList.value = [];
    paginationData.total = 0;
  }).finally(() => {
    loadingProgress.value = false;
  });
}

function handleSearch() {
  paginationData.currentPage === 1 ? searchUser() : (paginationData.currentPage = 1);
}

function handleResetSearch() {
  searchFormRef.value?.resetFields();
  handleSearch();
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], searchUser, { immediate: true });

async function handleDownloadCsv() {
  if (downloadingProgress.value) return;

  downloadingProgress.value = true;
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
    const headers = ['ms_id', 'name', 'email', 'plan', 'is_admin', 'is_tester', 'status', 'verified'];
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
    console.log(e);
    ElMessage.error('Failed to download CSV');
  } finally {
    downloadingProgress.value = false;
  }
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchFormData">
        <el-form-item prop="email" label="Email">
          <el-input v-model="searchFormData.email" placeholder="Search email" />
        </el-form-item>
        <el-form-item prop="name" label="Name">
          <el-input v-model="searchFormData.name" placeholder="Search name" />
        </el-form-item>
        <el-form-item prop="plan" label="Plan">
          <el-select v-model="searchFormData.plan" placeholder="Select Plan" style="width: 160px;">
            <el-option v-for="p in MembershipList" :key="p.id" :label="p.text" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
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
            <el-button :loading="downloadingProgress" type="primary" :icon="Download" circle @click="handleDownloadCsv" />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="searchUser" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="userList" style="width: 100%">
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
              <el-tag v-if="row.is_admin" effect="dark" type="warning" style="background:#f90;color:#fff;border-radius:8px;margin-right:6px;" disable-transitions>
                Admin
              </el-tag>
              <el-tag v-if="row.is_tester" effect="dark" type="success" style="background:#19be6b;color:#fff;border-radius:8px;margin-right:6px;" disable-transitions>
                Tester
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Action" width="150" align="center">
            <template #default="{ row }">
              <el-button type="primary" plain size="small" @click="handleUpdate(row)">
                Edit
              </el-button>
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
      v-model="userDialogVisible"
      :title="!userFormData.ms_id ? 'Add User' : 'Edit User'"
      width="30%"
      @closed="resetForm"
    >
      <el-form ref="userFormRef" :model="userFormData" :rules="userFormRules" label-width="100px" label-position="left">
        <el-form-item prop="email" label="Email">
          <el-input v-model="userFormData.email" disabled placeholder="Please enter" />
        </el-form-item>
        <!-- <el-form-item v-if="!userFormData.ms_id" prop="password" label="Password">
          <el-input v-model="userFormData.password" placeholder="Please enter" />
        </el-form-item> -->
        <el-form-item prop="status" label="Status">
          <el-select v-model="userFormData.status" placeholder="Please select">
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
        <el-button @click="userDialogVisible = false">
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
