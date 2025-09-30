<script lang="ts" setup>
import type { FormRules } from 'element-plus';
import type { IDgKey } from 'types';
import type { AddDgKeyRequestData, UpdateDgKeyRequestData } from '@/common/apis/dgkeys/type';
import { usePagination } from '@@/composables/usePagination';
import { CirclePlus, Delete, Download, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import { addDgKey, deleteDgKey, getDgKeyList, updateDgKey } from '@/common/apis/dgkeys';

interface DeepgramKeyFormData {
  id?: string;
  email: string;
  pwd: string;
  proj_id: string;
  key: string;
  closed: string;
  credit: string;
}

defineOptions({
  // Name the current component
  name: 'ElementPlus'
});

const confirmProgress = ref<boolean>(false);
const loading = ref<boolean>(false);
// const creditProgress = ref<boolean>(false);

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

// #region Create
const DEFAULT_FORM_DATA: DeepgramKeyFormData = {
  email: '',
  pwd: '',
  proj_id: '',
  key: '',
  closed: '0',
  credit: ''
};

const dialogVisible = ref<boolean>(false);

const formRef = useTemplateRef('formRef');

const formData = ref<DeepgramKeyFormData>(cloneDeep(DEFAULT_FORM_DATA));
const statusOptions = [
  {
    label: 'All',
    value: '-1'
  },
  {
    label: 'Open',
    value: '0'
  },
  {
    label: 'Close',
    value: '1'
  }
];

const formRules: FormRules<DeepgramKeyFormData> = {
  email: [{ required: true, trigger: 'blur', message: 'Please enter email.' }],
  proj_id: [{ required: true, trigger: 'blur', message: 'Please enter project id.' }],
  key: [{ required: true, trigger: 'blur', message: 'Please enter key.' }],
  credit: [{ required: true, trigger: 'blur', message: 'Please enter credit.' }],
  closed: [{ required: true, trigger: 'blur', message: 'Please select status.' }]
};

function handleCreateOrUpdateDgKey() {
  if (confirmProgress.value) return;

  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error('Form validation failed');
      return;
    }

    confirmProgress.value = true;

    if (formData.value.id) {
      const data: UpdateDgKeyRequestData = {
        id: formData.value.id as string,
        credit: Number.parseInt(formData.value.credit, 10),
        closed: formData.value.closed === '1'
      };
      updateDgKey(data).then(() => {
        ElMessage.success('Update successfully.');
        dialogVisible.value = false;
        searchDgKey();
      }).finally(() => {
        confirmProgress.value = false;
      });
    } else {
      const data: AddDgKeyRequestData = {
        email: formData.value.email,
        pwd: formData.value.pwd,
        proj_id: formData.value.proj_id,
        key: formData.value.key,
        credit: Number.parseInt(formData.value.credit, 10),
        closed: formData.value.closed === '1'
      };

      addDgKey(data).then(() => {
        ElMessage.success('Added successfully.');
        dialogVisible.value = false;
        searchDgKey();
      }).finally(() => {
        confirmProgress.value = false;
      });
    }
  });
}

function resetForm() {
  formRef.value?.clearValidate();
  formData.value = cloneDeep(DEFAULT_FORM_DATA);
}
// #endregion

// #region Delete
function handleDelete(row: IDgKey) {
  ElMessageBox.confirm(`Deleting deepgram key: ${row.key}, confirm deletion?`, 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    deleteDgKey(row.id).then(() => {
      ElMessage.success('Deleted successfully');
      searchDgKey();
    });
  });
}
// #endregion

// #region Update
function handleUpdate(row: IDgKey) {
  dialogVisible.value = true;

  formData.value = {
    id: row.id,
    email: row.email,
    pwd: row.pwd,
    proj_id: row.proj_id,
    key: row.key,
    closed: row.closed ? '1' : '0',
    credit: `${row.credit}`
  };
}
// #endregion

// #region Read
const tableData = ref<IDgKey[]>([]);

const searchFormRef = useTemplateRef('searchFormRef');

const searchData = reactive({
  closed: '-1'
});

function searchDgKey() {
  loading.value = true;
  const sp: any = {
    curPage: paginationData.currentPage,
    pageSize: paginationData.pageSize
  };
  if (searchData.closed !== '-1') {
    sp.closed = searchData.closed === '1';
  }
  getDgKeyList(sp).then((res) => {
    if (!res.success) {
      ElMessage.error(res.message || 'Error');
      return;
    }

    const data = res.data;
    if (data) {
      paginationData.total = data.total_count;
      tableData.value = data.dgkey_list;
    }
  }).catch(() => {
    tableData.value = [];
  }).finally(() => {
    loading.value = false;
  });
}

function handleSearch() {
  paginationData.currentPage === 1 ? searchDgKey() : (paginationData.currentPage = 1);
}

function resetSearch() {
  searchFormRef.value?.resetFields();
  handleSearch();
}
// #endregion

// function handleGetCredit() {
//   if (creditProgress.value) return;
//   if (!formData.value.proj_id || !formData.value.key) return;

//   creditProgress.value = true;
//   const url = `${import.meta.env.VITE_DEEPGRAM_BASE_URL}/projects/${formData.value.proj_id}/balances`;
//   fetch(
//     url,
//     {
//       method: 'get',
//       headers: {
//         Origin: 'https:/www.google.com',
//         Authorization: `Token ${formData.value.key}`
//       }
//     }
//   )
//     .then((res) => {
//       return res.json();
//     })
//     .then((json) => {
//       formData.value.credit = `${Math.round(json.balances[0].amount)}`;
//     })
//     .finally(() => {
//       creditProgress.value = false;
//     });
// }

// Watch pagination changes
watch([() => paginationData.currentPage, () => paginationData.pageSize], searchDgKey, { immediate: true });
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
        <el-form-item prop="status" label="Status">
          <el-select v-model="searchData.closed" placeholder="Please select" class="w-100px">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">
            Add Deepgram Key
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
            <el-button type="primary" :icon="RefreshRight" circle @click="searchDgKey" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="email" label="Email" align="center" />
          <el-table-column prop="pwd" label="Password" align="center">
            <template #default="scope">
              {{ scope.row.password ? '***' : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="proj_id" label="Project Id" align="center" />
          <el-table-column prop="key" label="Key" align="center" />
          <el-table-column prop="credit" label="Credit" align="center" />
          <el-table-column prop="status" label="Status" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.closed" type="danger" effect="plain" disable-transitions>
                Closed
              </el-tag>
              <el-tag v-else type="success" effect="plain" disable-transitions>
                Opened
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="Created At" align="center">
            <template #default="scope">
              {{ dayjs(scope.row.created_at).format('YYYY-MM-DD HH:mm') }}
            </template>
          </el-table-column>
          <el-table-column prop="checked_at" label="Checked At" align="center">
            <template #default="scope">
              {{ dayjs(scope.row.checked_at).format('YYYY-MM-DD HH:mm') }}
            </template>
          </el-table-column>
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
      :title="!formData.id ? 'Add Deepgram Key' : 'Edit Deepgram Key'"
      width="30%"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="email" label="Email">
          <el-input v-model="formData.email" :disabled="!!formData.id" placeholder="Please enter" />
        </el-form-item>
        <el-form-item prop="pwd" label="Password">
          <el-input v-model="formData.pwd" :disabled="!!formData.id" placeholder="Please enter" />
        </el-form-item>
        <el-form-item prop="proj_id" label="Project ID">
          <el-input v-model="formData.proj_id" :disabled="!!formData.id" placeholder="Please enter" />
        </el-form-item>
        <el-form-item prop="key" label="Key">
          <el-input v-model="formData.key" :disabled="!!formData.id" placeholder="Please enter" />
        </el-form-item>
        <el-form-item prop="credit" label="Credit">
          <el-input v-model="formData.credit" placeholder="Please enter" type="number" />
          <!-- <el-button class="mt-1" type="success" size="small" @click="handleGetCredit" :loading="creditProgress">
            Get Credit
          </el-button> -->
        </el-form-item>
        <el-form-item prop="closed" label="Status">
          <el-select v-model="formData.closed" placeholder="Please select">
            <el-option
              v-for="item in statusOptions.filter(v => v.value !== '-1')"
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
        <el-button type="primary" :loading="confirmProgress" @click="handleCreateOrUpdateDgKey">
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
