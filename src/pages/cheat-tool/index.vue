<script lang="ts" setup>
import type { ICheatTool } from '@/@types';
import { usePagination } from '@@/composables/usePagination';
import { Plus, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import { reactive, ref, watch } from 'vue';
import { addCheatTool, deleteCheatTool, getCheatToolList, updateCheatTool } from '@/common/apis/cheat_tool';

interface TCheatToolForm {
  id?: string;
  name: string;
  domain: string;
  link: string;
  ip_list: string[];
  process_win: string;
  process_mac: string;
}

const loadingProgress = ref<boolean>(false);
const savingProgress = ref<boolean>(false);
const deletingProgress = ref<boolean>(false);

const cheatToolDialogVisible = ref<boolean>(false);
const cheatToolDialogTitle = ref<string>('');

const { paginationData: pagination, handleCurrentChange, handleSizeChange } = usePagination();

const cheatToolList = ref<ICheatTool[]>([]);

const searchFormRef = useTemplateRef('searchFormRef');
const searchFormData = reactive({ name: '' });

const cheatToolFormRef = useTemplateRef('cheatToolFormRef');
const cheatToolFormData: TCheatToolForm = reactive<TCheatToolForm>({
  id: '',
  name: '',
  domain: '',
  link: '',
  ip_list: [] as string[],
  process_win: '',
  process_mac: ''
});
const cheatToolFormRules = reactive({
  name: [{ required: true, message: 'The name is required.', trigger: 'blur' }],
  domain: [{ required: true, message: 'The domain is required.', trigger: 'blur' }],
  link: [{ required: true, message: 'The link is required.', trigger: 'blur' }]
});
const ipString = ref<string>('');

function handleCheatToolDialogOpen(row?: any) {
  if (row) {
    cheatToolDialogTitle.value = 'Edit Cheat Tool';
    cheatToolFormData.id = row.id;
    cheatToolFormData.name = row.name;
    cheatToolFormData.domain = row.domain;
    cheatToolFormData.link = row.link;
    cheatToolFormData.ip_list = row.ip_list || [];
    ipString.value = (cheatToolFormData.ip_list || []).join(',');
    cheatToolFormData.process_win = row.process_win || '';
    cheatToolFormData.process_mac = row.process_mac || '';
  } else {
    cheatToolDialogTitle.value = 'Add Cheat Tool';
    cheatToolFormData.id = '';
    cheatToolFormData.name = '';
    cheatToolFormData.domain = '';
    cheatToolFormData.link = '';
    cheatToolFormData.ip_list = [];
    ipString.value = '';
    cheatToolFormData.process_win = '';
    cheatToolFormData.process_mac = '';
  }
  cheatToolDialogVisible.value = true;
}

function handleDelete(row: ICheatTool) {
  ElMessageBox.confirm(`Are you sure to delete this tool "${row.name}"`, 'Confirm', { type: 'warning' })
    .then(() => {
      if (!row.id) return;
      if (deletingProgress.value) return;

      deletingProgress.value = true;

      deleteCheatTool(row.id)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to delete.');
            searchCheatTool();
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

function handleSave() {
  if (savingProgress.value) return;

  savingProgress.value = true;
  cheatToolFormRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error('The form validation failed.');
      savingProgress.value = false;
      return;
    }

    const ip_list = ipString.value ? ipString.value.split(',').map((s: string) => s.trim()) : [];
    const payload = {
      id: cheatToolFormData.id,
      name: cheatToolFormData.name,
      domain: cheatToolFormData.domain,
      link: cheatToolFormData.link,
      ip_list,
      process_win: cheatToolFormData.process_win,
      process_mac: cheatToolFormData.process_mac
    };

    if (!cheatToolFormData.id) {
      addCheatTool(payload)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to add.');
            cheatToolDialogVisible.value = false;
            searchCheatTool();
          } else {
            ElMessage.error(res.message || 'Failed to add.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    } else {
      updateCheatTool(payload)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to update.');
            cheatToolDialogVisible.value = false;
            searchCheatTool();
          } else {
            ElMessage.error(res.message || 'Failed to update.');
          }
        })
        .finally(() => {
          savingProgress.value = false;
        });
    }
  });
}

function handleResetSearch() {
  searchFormRef.value?.resetFields();
  searchCheatTool();
}

function searchCheatTool() {
  if (loadingProgress.value) return;

  loadingProgress.value = true;

  const payload = {
    name: searchFormData.name,
    curPage: pagination.currentPage - 1,
    pagSize: pagination.pageSize
  };

  getCheatToolList(payload)
    .then((res) => {
      if (res.success && res.data && res.pagination) {
        cheatToolList.value = res.data.cheat_tool_list;
        pagination.total = res.pagination.total;
      } else {
        cheatToolList.value = [];
        pagination.total = 0;
      }
    })
    .finally(() => {
      loadingProgress.value = false;
    });
}

watch([() => pagination.currentPage, () => pagination.pageSize], searchCheatTool, { immediate: true });
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" :model="searchFormData" ref="searchFormRef">
        <el-form-item label="Name" prop="name">
          <el-input v-model="searchFormData.name" placeholder="Search name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="searchCheatTool">
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
            <el-button type="primary" :icon="Plus" circle @click="handleCheatToolDialogOpen()" />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="searchCheatTool" />
          </el-tooltip>
        </div>
      </div>

      <div class="table-wrapper">
        <el-table :data="cheatToolList" class="w-full">
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="domain" label="Domain" />
          <el-table-column prop="link" label="Link">
            <template #default="{ row }">
              <a :href="row.link" target="_blank">{{ row.link }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="ip_list" label="IPs">
            <template #default="{ row }">
              <div v-if="row.ip_list && row.ip_list.length">
                <el-tag v-for="ip in row.ip_list" :key="ip" class="ip-tag">
                  {{ ip }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="process_win" label="Win-Process" />
          <el-table-column prop="process_mac" label="Mac-Process" />
          <el-table-column fixed="right" label="Action" width="150">
            <template #default="{ row }">
              <el-button
                plain
                type="primary"
                size="small"
                @click="handleCheatToolDialogOpen(row)"
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
          :layout="pagination.layout"
          :page-sizes="pagination.pageSizes"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :current-page="pagination.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="cheatToolDialogVisible" :title="cheatToolDialogTitle" width="500px">
      <el-form
        :model="cheatToolFormData"
        :rules="cheatToolFormRules"
        ref="cheatToolFormRef"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="cheatToolFormData.name" />
        </el-form-item>
        <el-form-item label="Domain" prop="domain">
          <el-input v-model="cheatToolFormData.domain" />
        </el-form-item>
        <el-form-item label="Link" prop="link">
          <el-input v-model="cheatToolFormData.link" />
        </el-form-item>
        <el-form-item label="IPs (comma separated)" prop="ip_list">
          <el-input v-model="ipString" />
        </el-form-item>
        <el-form-item label="Win Process" prop="process_win">
          <el-input v-model="cheatToolFormData.process_win" />
        </el-form-item>
        <el-form-item label="Mac Process" prop="process_mac">
          <el-input v-model="cheatToolFormData.process_mac" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cheatToolDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" :loading="savingProgress" @click="handleSave">
          Save
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.search-wrapper {
  margin-bottom: 20px;
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

.ip-tag {
  background-color: #19be6b;
  color: #fff;
  border-radius: 12px;
  padding: 4px 8px;
  margin-right: 6px;
}

/* Make form labels wrap better and reduce line height so long labels (like "IPs (comma separated)")
   don't create excessive vertical spacing in the dialog. Scoped to this page. */
.el-form-item__label {
  white-space: normal;
  line-height: 1.2;
  padding-top: 6px; /* align label vertically a bit better */
  padding-bottom: 6px;
}

/* Use deep selector to ensure scoped styles reach Element Plus internal label */
:deep(.el-form-item__label) {
  white-space: normal !important;
  line-height: 1.2 !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  height: auto !important;
  display: block !important;
}
</style>
