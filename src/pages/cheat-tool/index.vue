<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" :model="searchData" ref="searchFormRef">
        <el-form-item label="Name">
          <el-input v-model="searchData.name" placeholder="Search by name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">Search</el-button>
          <el-button @click="resetSearch">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" @click="openDialog()">Add New</el-button>
        </div>
        <div>
          <el-button type="primary" :icon="RefreshRight" circle @click="searchList" />
        </div>
      </div>

      <div class="table-wrapper">
        <el-table :data="list" style="width:100%">
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
                <el-tag v-for="ip in row.ip_list" :key="ip" class="ip-tag">{{ ip }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="process_win" label="Win-Process" />
          <el-table-column prop="process_mac" label="Mac-Process" />
          <el-table-column fixed="right" label="Action" width="140">
            <template #default="{ row }">
              <el-tooltip content="Edit">
                <el-button type="text" icon="el-icon-edit" @click="openDialog(row)" />
              </el-tooltip>
              <el-tooltip content="Delete">
                <el-button type="text" icon="el-icon-delete" @click="confirmDelete(row)" />
              </el-tooltip>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="formData" ref="formRef" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="Domain">
          <el-input v-model="formData.domain" />
        </el-form-item>
        <el-form-item label="Link">
          <el-input v-model="formData.link" />
        </el-form-item>
        <el-form-item label="IPs (comma separated)">
          <el-input v-model="ipString" />
        </el-form-item>
        <el-form-item label="Win Process">
          <el-input v-model="formData.process_win" />
        </el-form-item>
        <el-form-item label="Mac Process">
          <el-input v-model="formData.process_mac" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="handleSave">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { getCheatToolList, updateCheatTool, deleteCheatTool, addCheatTool } from '@/common/apis/cheat_tool';
import { usePagination } from '@@/composables/usePagination';
import { Search, RefreshRight } from '@element-plus/icons-vue';

const loading = ref(false);
const confirmLoading = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref('');

const { paginationData: pagination, handleCurrentChange, handleSizeChange } = usePagination();

const list = ref<any[]>([]);

const searchFormRef = useTemplateRef('searchFormRef');
const searchData = reactive({ name: '' });

const formRef = useTemplateRef('formRef');
const formData: any = reactive({ id: '', name: '', domain: '', link: '', ip_list: [] as string[], process_win: '', process_mac: '' });
const ipString = ref('');

function openDialog(row?: any) {
  if (row) {
    dialogTitle.value = 'Edit Cheat Tool';
    formData.id = row.id || row._id || '';
    formData.name = row.name;
    formData.domain = row.domain;
    formData.link = row.link;
    formData.ip_list = row.ip_list || [];
    ipString.value = (formData.ip_list || []).join(',');
    formData.process_win = row.process_win || '';
    formData.process_mac = row.process_mac || '';
  } else {
    dialogTitle.value = 'Add Cheat Tool';
    formData.id = '';
    formData.name = '';
    formData.domain = '';
    formData.link = '';
    formData.ip_list = [];
    ipString.value = '';
    formData.process_win = '';
    formData.process_mac = '';
  }
  dialogVisible.value = true;
}

function confirmDelete(row: any) {
  ElMessageBox.confirm(`Delete ${row.name}?`, 'Confirm', { type: 'warning' }).then(async () => {
    const id = row.id || row._id || '';
    const res: any = await deleteCheatTool(id);
    if (res && res.success) {
      ElMessage.success('Deleted');
      searchList();
    } else {
      ElMessage.error(res?.message || 'Delete failed');
    }
  }).catch(() => {});
}

async function handleSave() {
  if (confirmLoading.value) return;
  confirmLoading.value = true;
  try {
    if (!formData.id) {
      // Add new: send full payload including ip_list
      const ip_list = ipString.value ? ipString.value.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
      const payloadAdd: any = {
        name: formData.name,
        domain: formData.domain,
        link: formData.link,
        ip_list,
        process_win: formData.process_win,
        process_mac: formData.process_mac
      };
      const res: any = await addCheatTool(payloadAdd);
      if (res && res.success) {
        ElMessage.success('Added');
        dialogVisible.value = false;
        searchList();
      } else {
        ElMessage.error(res?.message || 'Add failed');
      }
      return;
    }

    // Update existing: backend now accepts full record updates
    const ip_list = ipString.value ? ipString.value.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    const payloadUpdate: any = {
      id: formData.id,
      name: formData.name,
      domain: formData.domain,
      link: formData.link,
      ip_list,
      process_win: formData.process_win,
      process_mac: formData.process_mac
    };
    const res: any = await updateCheatTool(payloadUpdate);
    if (res && res.success) {
      ElMessage.success('Saved');
      dialogVisible.value = false;
      searchList();
    } else {
      ElMessage.error(res?.message || 'Save failed');
    }
  } catch (e) {
    ElMessage.error('Save failed');
  } finally {
    confirmLoading.value = false;
  }
}

function resetSearch() {
  searchData.name = '';
  searchList();
}

function handleSearch() {
  pagination.currentPage === 1 ? searchList() : (pagination.currentPage = 1);
}

async function searchList() {
  loading.value = true;
  try {
    const payload = { name: searchData.name || '', page: pagination.currentPage - 1, page_size: pagination.pageSize };
    const res: any = await getCheatToolList(payload);
    if (res && res.success) {
      const data = res.data ?? res;
      // backend returns the list as the data payload (inf) — prefer array directly
      list.value = Array.isArray(data) ? data : (data.cheat_tool_list || data || []);
      const anyRes: any = res;
      if (anyRes.pagination && typeof anyRes.pagination.total === 'number') {
        pagination.total = anyRes.pagination.total;
      } else if (data.total_count !== undefined) {
        pagination.total = data.total_count;
      }
    } else {
      list.value = [];
      ElMessage.error(res?.message || 'Failed to load');
    }
  } catch (e) {
    list.value = [];
  } finally {
    loading.value = false;
  }
}

watch([() => pagination.currentPage, () => pagination.pageSize], searchList, { immediate: true });
</script>

<style scoped>
.search-wrapper { margin-bottom: 20px }
.toolbar-wrapper { display:flex; justify-content:space-between; margin-bottom: 20px }
.table-wrapper { margin-bottom: 20px }
.pager-wrapper { display:flex; justify-content:flex-end }

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
