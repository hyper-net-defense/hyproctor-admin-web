import type { App } from 'vue';
import VXETable from 'vxe-table'; // https://vxetable.cn/#/start/install

// Global default configuration
VXETable.setConfig({
  // Global component size
  size: 'medium',
  // Base z-index value (increase if your project uses high z-index values)
  zIndex: 9999,
  // Version number for cache busting
  version: 0,
  // Loading indicator text (null hides text)
  loadingText: null,

  // Table configuration
  table: {
    showHeader: true,
    showOverflow: 'tooltip',
    showHeaderOverflow: 'tooltip',
    autoResize: true,
    border: 'inner',
    emptyText: 'No data available',
    rowConfig: {
      isHover: true,
      isCurrent: true,
      // Primary key field name for row data
      keyField: '_VXE_ID'
    },
    columnConfig: {
      resizable: false
    },
    align: 'center',
    headerAlign: 'center'
  },

  // Pager configuration
  pager: {
    perfect: false, // Compact mode
    pageSize: 10,
    pagerCount: 7, // Visible page buttons
    pageSizes: [10, 20, 50],
    layouts: [
      'Total',
      'PrevJump',
      'PrevPage',
      'Number',
      'NextPage',
      'NextJump',
      'Sizes',
      'FullJump'
    ]
  },

  // Modal configuration
  modal: {
    minWidth: 500,
    minHeight: 400,
    lockView: true, // Prevent background scrolling
    mask: true, // Show overlay
    dblclickZoom: false, // Disable zoom on double-click
    showTitleOverflow: true,
    transfer: true, // Append to body
    draggable: false
  }
});

export function installVxeTable(app: App) {
  // Install VXETable with all components
  app.use(VXETable);
}
