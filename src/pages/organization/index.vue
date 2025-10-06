<script setup lang="ts">
import type { FormRules } from 'element-plus';
import type { IOrganization } from '@/@types';
import { usePagination } from '@@/composables/usePagination';
import { Edit, Plus, Refresh, RefreshRight, Search } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import { ref } from 'vue';
import {
  createOrganization,
  getOrganizationList,
  updateOrganization,
  updateOrganizationPlan
} from '@/common/apis/organization';
import { MembershipList } from '@/common/constants';

interface TOrgForm {
  domain: string;
  name: string;
}

interface TPlanForm {
  domain: string;
  plan: number;
  expire_at: string;
  extra: string;
}

const orgFormRef = useTemplateRef('orgFormRef');
const planFormRef = useTemplateRef('planFormRef');
const searchFormRef = useTemplateRef('searchFormRef');

const loadingOrgListProgress = ref<boolean>(false);
const savingOrgProgress = ref<boolean>(false);
const savingPlanProgress = ref<boolean>(false);

const searchFormData = ref({ domain: '' });
const organizationList = ref<IOrganization[]>([]);

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

const orgDialogVisible = ref<boolean>(false);
const orgFormData = ref<TOrgForm>({ domain: '', name: '' });
const orgFormRules: FormRules<TOrgForm> = {
  domain: [{ required: true, trigger: 'blur', message: 'The domain is required.' }],
  name: [{ required: true, trigger: 'blur', message: 'The name is required.' }]
};

const planDialogVisible = ref<boolean>(false);
const planFormData = ref<TPlanForm>({ domain: '', plan: 0, expire_at: '', extra: '' });
const planFormRules: FormRules<TPlanForm> = {
  plan: [{ required: true, trigger: 'blur', message: 'The plan is required.' }],
  expire_at: [{ required: true, trigger: 'blur', message: 'The expiration date is required.' }]
};

function searchOrganizationList() {
  if (loadingOrgListProgress.value) return;

  loadingOrgListProgress.value = true;
  const payload = {
    domain: searchFormData.value.domain,
    curPage: paginationData.currentPage,
    pageSize: paginationData.pageSize
  };
  getOrganizationList(payload)
    .then((res) => {
      if (res.success && res.data && res.pagination) {
        organizationList.value = res.data.org_list;
        paginationData.total = res.pagination.total;
      } else {
        organizationList.value = [];
        paginationData.total = 0;
      }
    })
    .finally(() => {
      loadingOrgListProgress.value = false;
    });
}

function handleOrgDialogOpen(row?: IOrganization) {
  if (row) {
    orgFormData.value = { domain: row.domain, name: row.name };
  } else {
    orgFormData.value = { domain: '', name: '' };
  }
  orgDialogVisible.value = true;
}

function handlePlanDialogOpen(row: any) {
  planFormData.value = {
    domain: row.domain,
    plan: row.plan ?? 0,
    expire_at: dayjs(row.expire_at).format('YYYY-MM-DD') ?? '',
    extra: row.extra ?? ''
  };
  planDialogVisible.value = true;
}

function handleResetSearch() {
  searchFormRef.value?.resetFields();
  searchOrganizationList();
}

function handleSave() {
  if (!orgFormData.value.domain)
    return;
  if (savingOrgProgress.value)
    return;

  orgFormRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error('Form validation failed.');
      return;
    }

    savingOrgProgress.value = true;
    const bl = organizationList.value.some((org: IOrganization) => org.domain === orgFormData.value.domain);
    const payload = {
      domain: orgFormData.value.domain,
      name: orgFormData.value.name
    };

    if (bl) {
      updateOrganization(payload)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to update.');
            orgDialogVisible.value = false;
            searchOrganizationList();
          }
        })
        .finally(() => {
          savingOrgProgress.value = false;
        });
    } else {
      createOrganization(payload)
        .then((res) => {
          if (res.success) {
            ElMessage.success('Succeed to add.');
            orgDialogVisible.value = false;
            searchOrganizationList();
          } else {
            ElMessage.error(res?.message || 'Operation failed.');
          }
        })
        .finally(() => {
          savingOrgProgress.value = false;
        });
    }
  });
}

function handleUpdatePlan() {
  if (!planFormData.value.domain)
    return;

  if (savingPlanProgress.value)
    return;

  planFormRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error('Form validation failed.');
      return;
    }

    savingPlanProgress.value = true;
    const payload = {
      domain: planFormData.value.domain,
      plan: planFormData.value.plan,
      expire_at: `${planFormData.value.expire_at} 00:00:00`,
      extra: planFormData.value.extra
    };

    updateOrganizationPlan(payload)
      .then((res) => {
        if (res.success) {
          planDialogVisible.value = false;
          searchOrganizationList();
        } else {
          ElMessage.error(res?.message || 'Operation failed.');
        }
      })
      .finally(() => {
        savingPlanProgress.value = false;
      });
  });
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], searchOrganizationList, { immediate: true });
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
            @click="searchOrganizationList"
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
    <el-card v-loading="loadingOrgListProgress" shadow="never">
      <div class="toolbar-wrapper">
        <div />
        <div>
          <el-tooltip content="Add new">
            <el-button type="primary" :icon="Plus" circle @click="handleOrgDialogOpen()" />
          </el-tooltip>
          <el-tooltip content="Refresh current page">
            <el-button type="primary" :icon="RefreshRight" circle @click="searchOrganizationList" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="organizationList" stripe>
          <el-table-column prop="domain" label="Domain" />
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="plan" label="Plan">
            <template #default="{ row }">
              <el-tag type="primary">
                {{ MembershipList.find(v => v.id === row.plan)?.text }}
              </el-tag>
              <el-button
                type="primary"
                text
                size="small"
                :icon="Edit"
                @click="handlePlanDialogOpen(row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="expire_at" label="Expire">
            <template #default="{ row }">
              <span v-if="row.expire_at">{{ dayjs(row.expire_at).format('YYYY-MM-DD') }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="Action" width="100">
            <template #default="{ row }">
              <el-button type="primary" plain size="small" @click="handleOrgDialogOpen(row)">
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
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :current-page="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Create/Edit name/domain -->
    <el-dialog title="Organization" v-model="orgDialogVisible" width="500px">
      <el-form
        ref="orgFormRef"
        :model="orgFormData"
        :rules="orgFormRules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item prop="domain" label="Domain">
          <el-input v-model="orgFormData.domain" />
        </el-form-item>
        <el-form-item prop="name" label="Name">
          <el-input v-model="orgFormData.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="orgDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="handleSave" :loading="savingOrgProgress">
          Save
        </el-button>
      </template>
    </el-dialog>

    <!-- Update plan dialog -->
    <el-dialog title="Update Plan" v-model="planDialogVisible" width="500px">
      <el-form
        ref="planFormRef"
        :model="planFormData"
        :rules="planFormRules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="Domain">
          <el-input v-model="planFormData.domain" disabled />
        </el-form-item>
        <el-form-item label="Plan" prop="plan">
          <el-select v-model="planFormData.plan" placeholder="Select Plan" class="w-full">
            <el-option v-for="membership in MembershipList" :key="membership.id" :label="membership.text" :value="membership.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Expire At" prop="expire_at">
          <el-date-picker v-model="planFormData.expire_at" value-format="YYYY-MM-DD" class="w-full" />
        </el-form-item>
        <el-form-item label="Extra" prop="extra">
          <el-input v-model="planFormData.extra" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button bg @click="planDialogVisible = false">
          Cancel
        </el-button>
        <el-button bg type="primary" @click="handleUpdatePlan" :loading="savingPlanProgress">
          Update
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
