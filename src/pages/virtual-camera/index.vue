<template>
  <div>
    <el-form :inline="true" class="mb-4">
      <el-form-item>
        <el-input v-model="filters.name" placeholder="Search name" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchList">Search</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="openDialog()">Add New</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" stripe>
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="pattern" label="Pattern" />
      <el-table-column label="Action">
        <template #default="{ row }">
          <el-button type="text" @click="openDialog(row)">Edit</el-button>
          <el-button type="text" @click="handleDelete(row.id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :total="total" :page-size="pageSize" :current-page="page" @current-change="onPageChange"/>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form :model="formData">
        <el-form-item label="Name"><el-input v-model="formData.name"/></el-form-item>
        <el-form-item label="Pattern"><el-input v-model="formData.pattern"/></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getVirtualCameraList, addVirtualCamera, updateVirtualCamera, deleteVirtualCamera } from '@/common/apis/virtual_camera';

const filters = ref({ name: '' });
const list = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);

const dialogVisible = ref(false);
const dialogTitle = ref('');
const formData = ref<any>({ id: '', name: '', pattern: '' });

async function fetchList() {
  const res: any = await getVirtualCameraList({ name: filters.value.name, page: page.value - 1, page_size: pageSize.value });
  list.value = res.data ?? res;
  total.value = res.pagination?.total ?? res.total ?? 0;
}

function onPageChange(p: number) { page.value = p; fetchList(); }

function openDialog(row?: any) {
  if (row) { dialogTitle.value = 'Edit'; formData.value = { ...row }; }
  else { dialogTitle.value = 'Add New'; formData.value = { id: '', name: '', pattern: '' }; }
  dialogVisible.value = true;
}

async function handleSave() { if (formData.value.id) await updateVirtualCamera(formData.value); else await addVirtualCamera(formData.value); dialogVisible.value = false; fetchList(); }

async function handleDelete(id: string) { await deleteVirtualCamera(id); fetchList(); }

fetchList();
</script>
