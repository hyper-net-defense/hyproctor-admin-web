import type { App } from 'vue';
import { installElementPlusIcons } from './element-plus-icons';
// permission directive removed
import { installSvgIcon } from './svg-icon';
import { installVxeTable } from './vxe-table';

export function installPlugins(app: App) {
  installElementPlusIcons(app);
  // permission directive removed
  installSvgIcon(app);
  installVxeTable(app);
}
