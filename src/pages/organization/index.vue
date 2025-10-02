<template>
  <div>
    <el-form :inline="true" class="mb-4">
      <el-form-item>
        <el-input v-model="filters.domain" placeholder="Search domain" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchList">Search</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="openDialog()">Create Org</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" stripe>
      <el-table-column prop="domain" label="Domain" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="plan" label="Plan" />
      <el-table-column prop="expire_at" label="Expire" />
      <el-table-column label="Action">
        <template #default="{ row }">
          <el-button type="text" @click="openDialog(row)">Edit</el-button>
          <el-button type="text" @click="openPlanDialog(row)">Update Plan</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :total="total" :page-size="pageSize" :current-page="page" @current-change="onPageChange"/>

    <!-- Create/Edit name/domain -->
    <el-dialog title="Org" :visible.sync="dialogVisible">
      <el-form :model="formData">
        <el-form-item label="Domain"><el-input v-model="formData.domain"/></el-form-item>
        <el-form-item label="Name"><el-input v-model="formData.name"/></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
      </template>
    </el-dialog>

    <!-- Update plan dialog -->
    <el-dialog title="Update Plan" :visible.sync="planDialogVisible">
      <el-form :model="planForm">
        <el-form-item label="Domain"><el-input v-model="planForm.domain" disabled/></el-form-item>
        <el-form-item label="Plan"><el-input v-model.number="planForm.plan"/></el-form-item>
        <el-form-item label="Expire At"><el-input v-model="planForm.expire_at" placeholder="YYYY-MM-DD or empty"/></el-form-item>
        <el-form-item label="Extra"><el-input v-model="planForm.extra"/></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="planDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleUpdatePlan">Update</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getOrganizationList, createOrganization, updateOrganization, updateOrganizationPlan } from '@/common/apis/organization';

const filters = ref({ domain: '' });
const list = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);

const dialogVisible = ref(false);
const formData = ref<any>({ domain: '', name: '' });

const planDialogVisible = ref(false);
const planForm = ref<any>({ domain: '', plan: 0, expire_at: '', extra: '' });

async function fetchList() {
  const res: any = await getOrganizationList({ domain: filters.value.domain, page: page.value - 1, page_size: pageSize.value });
  list.value = res.data ?? res;
  total.value = res.pagination?.total ?? res.total ?? 0;
}

function onPageChange(p: number) { page.value = p; fetchList(); }

function openDialog(row?: any) {
  if (row) { formData.value = { domain: row.domain, name: row.name }; }
  else { formData.value = { domain: '', name: '' }; }
  dialogVisible.value = true;
}

function openPlanDialog(row: any) {
  planForm.value = { domain: row.domain, plan: row.plan ?? 0, expire_at: row.expire_at ?? '', extra: row.extra ?? '' };
  planDialogVisible.value = true;
}

async function handleSave() {
  if (!formData.value.domain) return;
  // create or update: backend create_org returns created object, update_org returns updated inf
  if (list.value.some((i: any) => i.domain === formData.value.domain)) {
    await updateOrganization({ domain: formData.value.domain, name: formData.value.name });
  } else {
    await createOrganization({ domain: formData.value.domain, name: formData.value.name });
  }
  dialogVisible.value = false; fetchList();
}

async function handleUpdatePlan() {
  if (!planForm.value.domain) return;
  await updateOrganizationPlan({ domain: planForm.value.domain, plan: planForm.value.plan, expire_at: planForm.value.expire_at, extra: planForm.value.extra });
  planDialogVisible.value = false; fetchList();
}

fetchList();
</script>
