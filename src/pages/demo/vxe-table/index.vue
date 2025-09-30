<script lang="ts" setup>
import type { TableResponseData } from '@@/apis/tables/type';
import type { ElMessageBoxOptions } from 'element-plus';
import type { VxeFormInstance, VxeFormProps, VxeGridInstance, VxeGridProps, VxeModalInstance, VxeModalProps } from 'vxe-table';
import { deleteTableDataApi, getTableDataApi } from '@@/apis/tables';

defineOptions({
  // Name the current component
  name: 'VxeTable'
});

// #region vxe-grid
interface RowMeta {
  id: number;
  username: string;
  roles: string;
  phone: string;
  email: string;
  status: boolean;
  createTime: string;
  /** Property automatically added by vxe-table */
  _VXE_ID?: string;
}

const xGridDom = useTemplateRef<VxeGridInstance>('xGridDom');

const xGridOpt: VxeGridProps = reactive({
  loading: true,
  autoResize: true,
  /** Pagination configuration */
  pagerConfig: {
    align: 'right'
  },
  /** Form configuration */
  formConfig: {
    items: [
      {
        field: 'username',
        itemRender: {
          name: 'VxeInput',
          props: {
            placeholder: 'Username',
            clearable: true
          }
        }
      },
      {
        field: 'phone',
        itemRender: {
          name: 'VxeInput',
          props: {
            placeholder: 'Phone',
            clearable: true
          }
        }
      },
      {
        itemRender: {
          name: 'VxeButtonGroup',
          options: [
            {
              type: 'submit',
              content: 'Search',
              status: 'primary',
              icon: 'vxe-icon-search'
            },
            {
              type: 'reset',
              content: 'Reset',
              icon: 'vxe-icon-refresh'
            }
          ]
        }
      }
    ]
  },
  /** Toolbar configuration */
  toolbarConfig: {
    refresh: true,
    custom: true,
    slots: {
      buttons: 'toolbar-btns'
    }
  },
  /** Custom column configuration */
  customConfig: {
    /** Whether column selection is allowed */
    checkMethod: ({ column }) => !['username'].includes(column.field)
  },
  /** Column configuration */
  columns: [
    {
      type: 'checkbox',
      width: '50px'
    },
    {
      field: 'username',
      title: 'Username'
    },
    {
      field: 'roles',
      title: 'Role',
      slots: {
        default: 'role-column'
      }
    },
    {
      field: 'phone',
      title: 'Phone'
    },
    {
      field: 'email',
      title: 'Email'
    },
    {
      field: 'status',
      title: 'Status',
      slots: {
        default: 'status-column'
      }
    },
    {
      field: 'createTime',
      title: 'Create Time'
    },
    {
      title: 'Actions',
      width: '150px',
      fixed: 'right',
      showOverflow: false,
      slots: {
        default: 'row-operate'
      }
    }
  ],
  /** Data proxy configuration (Promise API based) */
  proxyConfig: {
    /** Enable dynamic sequence proxy */
    seq: true,
    /** Whether to proxy form */
    form: true,
    /** Whether to auto load, default true */
    autoLoad: true,
    props: {
      total: 'total'
    },
    ajax: {
      query: ({ page, form }) => {
        xGridOpt.loading = true;
        crudStore.clearTable();
        return new Promise((resolve) => {
          let total = 0;
          let result: RowMeta[] = [];
          // Load data
          const callback = (res: TableResponseData) => {
            if (res?.data) {
              // Total count
              total = res.data.total;
              // List data
              result = res.data.list;
            }
            xGridOpt.loading = false;
            // Return value has format requirements, see vxe-table docs
            resolve({ total, result });
          };
          // Parameters required by API
          const params = {
            username: form.username || '',
            phone: form.phone || '',
            size: page.pageSize,
            currentPage: page.currentPage
          };
          // Call API
          getTableDataApi(params).then(callback).catch(callback);
        });
      }
    }
  }
});
// #endregion

// #region vxe-modal
const xModalDom = useTemplateRef<VxeModalInstance>('xModalDom');

const xModalOpt: VxeModalProps = reactive({
  title: '',
  showClose: true,
  escClosable: true,
  maskClosable: true,
  beforeHideMethod: () => {
    xFormDom.value?.clearValidate();
    return Promise.resolve();
  }
});
// #endregion

// #region vxe-form
const xFormDom = useTemplateRef<VxeFormInstance>('xFormDom');

const xFormOpt: VxeFormProps = reactive({
  span: 24,
  titleWidth: '100px',
  loading: false,
  /** Whether to show title colon */
  titleColon: false,
  /** Form data */
  data: {
    username: '',
    password: ''
  },
  /** Item list */
  items: [
    {
      field: 'username',
      title: 'Username',
      itemRender: {
        name: '$input',
        props: {
          placeholder: 'Please enter'
        }
      }
    },
    {
      field: 'password',
      title: 'Password',
      itemRender: {
        name: '$input',
        props: {
          placeholder: 'Please enter'
        }
      }
    },
    {
      align: 'right',
      itemRender: {
        name: '$buttons',
        children: [
          {
            props: {
              content: 'Cancel'
            },
            events: {
              click: () => xModalDom.value?.close()
            }
          },
          {
            props: {
              type: 'submit',
              content: 'Confirm',
              status: 'primary'
            },
            events: {
              click: () => crudStore.onSubmitForm()
            }
          }
        ]
      }
    }
  ],
  /** Validation rules */
  rules: {
    username: [
      {
        required: true,
        validator: ({ itemValue }) => {
          switch (true) {
            case !itemValue:
              return new Error('Please enter');
            case !itemValue.trim():
              return new Error('Whitespace invalid');
          }
        }
      }
    ],
    password: [
      {
        required: true,
        validator: ({ itemValue }) => {
          switch (true) {
            case !itemValue:
              return new Error('Please enter');
            case !itemValue.trim():
              return new Error('Whitespace invalid');
          }
        }
      }
    ]
  }
});
// #endregion

// #region CRUD Operations
const crudStore = reactive({
  /** Form type, true for update, false for create */
  isUpdate: true,
  /** Load table data */
  commitQuery: () => xGridDom.value?.commitProxy('query'),
  /** Clear table data */
  clearTable: () => xGridDom.value?.reloadData([]),
  /** Click to show modal */
  onShowModal: (row?: RowMeta) => {
    if (row) {
      crudStore.isUpdate = true;
      xModalOpt.title = 'Edit User';
      // Assign values
      xFormOpt.data.username = row.username;
    } else {
      crudStore.isUpdate = false;
      xModalOpt.title = 'Add User';
    }
    // Disable form item
    const props = xFormOpt.items?.[0]?.itemRender?.props;
    props && (props.disabled = crudStore.isUpdate);
    xModalDom.value?.open();
    nextTick(() => {
      !crudStore.isUpdate && xFormDom.value?.reset();
      xFormDom.value?.clearValidate();
    });
  },
  /** Confirm and save */
  onSubmitForm: () => {
    if (xFormOpt.loading) return;
    xFormDom.value?.validate((errMap) => {
      if (errMap) return;
      xFormOpt.loading = true;
      const callback = () => {
        xFormOpt.loading = false;
        xModalDom.value?.close();
        ElMessage.success('Operation successful');
        !crudStore.isUpdate && crudStore.afterInsert();
        crudStore.commitQuery();
      };
      if (crudStore.isUpdate) {
        // Simulate successful update API call
        setTimeout(() => callback(), 1000);
      } else {
        // Simulate successful create API call
        setTimeout(() => callback(), 1000);
      }
    });
  },
  /** After insert, whether to jump to last page */
  afterInsert: () => {
    const pager = xGridDom.value?.getProxyInfo()?.pager;
    if (pager) {
      const currentTotal = pager.currentPage * pager.pageSize;
      if (currentTotal === pager.total) {
        ++pager.currentPage;
      }
    }
  },
  /** Delete */
  onDelete: (row: RowMeta) => {
    const tip = `Confirm <strong style="color: var(--el-color-danger);"> delete </strong> user <strong style="color: var(--el-color-primary);"> ${row.username} </strong> ?`;
    const config: ElMessageBoxOptions = {
      type: 'warning',
      showClose: true,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
      dangerouslyUseHTMLString: true
    };
    ElMessageBox.confirm(tip, 'Warning', config).then(() => {
      deleteTableDataApi(row.id).then(() => {
        ElMessage.success('Delete successful');
        crudStore.afterDelete();
        crudStore.commitQuery();
      });
    });
  },
  /** After delete, whether to return to previous page */
  afterDelete: () => {
    const tableData: RowMeta[] = xGridDom.value!.getData();
    const pager = xGridDom.value?.getProxyInfo()?.pager;
    if (pager && pager.currentPage > 1 && tableData.length === 1) {
      --pager.currentPage;
    }
  },
  /** More custom methods */
  moreFn: () => {}
});
// #endregion
</script>

<template>
  <div class="app-container">
    <el-alert
      title="Data Source"
      type="success"
      description="Online Mock data provided by Apifox, data is not real, only for basic CRUD demonstration"
      show-icon
    />
    <el-alert
      title="Note"
      type="warning"
      description="Current example is compatible with Vxe Table version up to 4.6.25"
      show-icon
    />
    <!-- Table -->
    <vxe-grid ref="xGridDom" v-bind="xGridOpt">
      <!-- Left button list -->
      <template #toolbar-btns>
        <vxe-button status="primary" icon="vxe-icon-add" @click="crudStore.onShowModal()">
          Add User
        </vxe-button>
        <vxe-button status="danger" icon="vxe-icon-delete">
          Batch Delete
        </vxe-button>
      </template>
      <!-- Role column -->
      <template #role-column="{ row, column }">
        <el-tag
          :type="row[column.field] === 'admin' ? 'primary' : 'warning'"
          effect="plain"
        >
          {{ row[column.field] }}
        </el-tag>
      </template>
      <!-- Status column -->
      <template #status-column="{ row, column }">
        <el-tag
          :type="row[column.field] ? 'success' : 'danger'"
          effect="plain"
        >
          {{ row[column.field] ? "Active" : "Inactive" }}
        </el-tag>
      </template>
      <!-- Actions -->
      <template #row-operate="{ row }">
        <el-button link type="primary" @click="crudStore.onShowModal(row)">
          Edit
        </el-button>
        <el-button link type="danger" @click="crudStore.onDelete(row)">
          Delete
        </el-button>
      </template>
    </vxe-grid>
    <!-- Modal -->
    <vxe-modal ref="xModalDom" v-bind="xModalOpt">
      <!-- Form -->
      <vxe-form ref="xFormDom" v-bind="xFormOpt" />
    </vxe-modal>
  </div>
</template>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 20px;
}
</style>
