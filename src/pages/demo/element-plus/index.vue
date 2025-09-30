<script lang="ts" setup>
import type { CreateOrUpdateTableRequestData, TableData } from '@@/apis/tables/type';
import type { FormRules } from 'element-plus';
import { createTableDataApi, deleteTableDataApi, getTableDataApi, updateTableDataApi } from '@@/apis/tables';
import { usePagination } from '@@/composables/usePagination';
import { CirclePlus, Delete, Download, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import { cloneDeep } from 'lodash-es';

defineOptions({
  // Name the current component
  name: 'ElementPlus'
});

const loading = ref<boolean>(false);

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

// #region Create
const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  id: undefined,
  username: '',
  password: ''
};

const dialogVisible = ref<boolean>(false);

const formRef = useTemplateRef('formRef');

const formData = ref<CreateOrUpdateTableRequestData>(cloneDeep(DEFAULT_FORM_DATA));

const formRules: FormRules<CreateOrUpdateTableRequestData> = {
  username: [{ required: true, trigger: 'blur', message: 'Please enter username' }],
  password: [{ required: true, trigger: 'blur', message: 'Please enter password' }]
};

function handleCreateOrUpdate() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error('Form validation failed');
      return;
    }
    loading.value = true;
    const api = formData.value.id === undefined ? createTableDataApi : updateTableDataApi;
    api(formData.value).then(() => {
      ElMessage.success('Operation successful');
      dialogVisible.value = false;
      getTableData();
    }).finally(() => {
      loading.value = false;
    });
  });
}

function resetForm() {
  formRef.value?.clearValidate();
  formData.value = cloneDeep(DEFAULT_FORM_DATA);
}
// #endregion

// #region Delete
function handleDelete(row: TableData) {
  ElMessageBox.confirm(`Deleting user: ${row.username}, confirm deletion?`, 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    deleteTableDataApi(row.id).then(() => {
      ElMessage.success('Deleted successfully');
      getTableData();
    });
  });
}
// #endregion

// #region Update
function handleUpdate(row: TableData) {
  dialogVisible.value = true;
  formData.value = cloneDeep(row);
}
// #endregion

// #region Read
const tableData = ref<TableData[]>([]);

const searchFormRef = useTemplateRef('searchFormRef');

const searchData = reactive({
  username: '',
  phone: ''
});

function getTableData() {
  loading.value = true;
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.username,
    phone: searchData.phone
  }).then(({ data }) => {
    if (data) {
      paginationData.total = data.total;
      tableData.value = data.list;
    }
  }).catch(() => {
    tableData.value = [];
  }).finally(() => {
    loading.value = false;
  });
}

function handleSearch() {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1);
}

function resetSearch() {
  searchFormRef.value?.resetFields();
  handleSearch();
}
// #endregion

// Watch pagination changes
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true });
</script>

<template>
  <div class="app-container">
    <el-alert
      title="Data Source"
      type="success"
      description="Online Mock data provided by Apifox, data is not real, only for basic CRUD demonstration"
      show-icon
    />
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="Username">
          <el-input v-model="searchData.username" placeholder="Please enter" />
        </el-form-item>
        <el-form-item prop="phone" label="Phone">
          <el-input v-model="searchData.phone" placeholder="Please enter" />
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">
            Add User
          </el-button>
          <el-button type="danger" :icon="Delete">
            Batch Delete
          </el-button>
        </div>
        <div>
          <el-tooltip content="Download">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="username" label="Username" align="center" />
          <el-table-column prop="roles" label="Role" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.roles === 'admin'" type="primary" effect="plain" disable-transitions>
                admin
              </el-tag>
              <el-tag v-else type="warning" effect="plain" disable-transitions>
                {{ scope.row.roles }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="Phone" align="center" />
          <el-table-column prop="email" label="Email" align="center" />
          <el-table-column prop="status" label="Status" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain" disable-transitions>
                Active
              </el-tag>
              <el-tag v-else type="danger" effect="plain" disable-transitions>
                Inactive
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="Create Time" align="center" />
          <el-table-column fixed="right" label="Actions" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">
                Edit
              </el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">
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
      :title="formData.id === undefined ? 'Add User' : 'Edit User'"
      width="30%"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="Username">
          <el-input v-model="formData.username" placeholder="Please enter" />
        </el-form-item>
        <el-form-item v-if="formData.id === undefined" prop="password" label="Password">
          <el-input v-model="formData.password" placeholder="Please enter" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleCreateOrUpdate">
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
