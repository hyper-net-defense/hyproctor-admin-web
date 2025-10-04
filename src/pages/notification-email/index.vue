<script setup lang="ts">
import { ref } from 'vue';
import { addNotifyEmail, deleteNotifyEmail, updateNotifyEmail } from '@/common/apis/notify_email';

const filters = ref({ email: '' });
const list = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);

const dialogVisible = ref(false);
const dialogTitle = ref('');
const formData = ref<any>({ id: '', email: '', name: '' });

async function fetchList() {
  // const res: any = await getNotifyEmailList({ email: filters.value.email, page: page.value - 1, page_size: pageSize.value });
  // list.value = res.data ?? res;
  // total.value = res.pagination?.total ?? res.total ?? 0;
}

function onPageChange(p: number) {
  page.value = p;
  fetchList();
}

function openDialog(row?: any) {
  if (row) {
    dialogTitle.value = 'Edit';
    formData.value = { ...row };
  } else {
    dialogTitle.value = 'Add New';
    formData.value = { id: '', email: '', name: '' };
  }
  dialogVisible.value = true;
}

async function handleSave() {
  if (formData.value.id)
    await updateNotifyEmail(formData.value);
  else
    await addNotifyEmail(formData.value);
  dialogVisible.value = false;
  fetchList();
}

async function handleDelete(id: string) {
  await deleteNotifyEmail(id);
  fetchList();
}

fetchList();
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="filters.email" placeholder="Search email" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">
            Search
          </el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="openDialog()">
            Add New
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="false" shadow="never">
      <div class="table-wrapper">
        <el-table :data="list" stripe>
          <el-table-column prop="email" label="Email" />
          <el-table-column prop="name" label="Name" />
          <el-table-column label="Action">
            <template #default="{ row }">
              <el-button type="text" @click="openDialog(row)">
                Edit
              </el-button>
              <el-button type="text" @click="handleDelete(row.id)">
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination :total="total" :page-size="pageSize" :current-page="page" @current-change="onPageChange" />
      </div>
    </el-card>
    <el-dialog :title="dialogTitle" v-model:visible="dialogVisible">
      <el-form :model="formData">
        <el-form-item label="Email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="formData.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
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

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
