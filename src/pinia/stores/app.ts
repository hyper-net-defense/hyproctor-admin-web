import { DeviceEnum, SIDEBAR_CLOSED, SIDEBAR_OPENED } from '@@/constants/app-key';
import { getSidebarStatus, setSidebarStatus } from '@@/utils/cache/local-storage';
import { pinia } from '@/pinia';

interface Sidebar {
  opened: boolean;
  withoutAnimation: boolean;
}

/** Set sidebar status in local storage */
function handleSidebarStatus(opened: boolean) {
  opened ? setSidebarStatus(SIDEBAR_OPENED) : setSidebarStatus(SIDEBAR_CLOSED);
}

export const useAppStore = defineStore('app', () => {
  // Sidebar state
  const sidebar: Sidebar = reactive({
    opened: getSidebarStatus() !== SIDEBAR_CLOSED,
    withoutAnimation: false
  });

  // Device type
  const device = ref<DeviceEnum>(DeviceEnum.Desktop);

  // Watch sidebar opened state
  watch(
    () => sidebar.opened,
    (opened) => {
      handleSidebarStatus(opened);
    }
  );

  // Toggle sidebar
  const toggleSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = !sidebar.opened;
    sidebar.withoutAnimation = withoutAnimation;
  };

  // Close sidebar
  const closeSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = false;
    sidebar.withoutAnimation = withoutAnimation;
  };

  // Change device type
  const toggleDevice = (value: DeviceEnum) => {
    device.value = value;
  };

  return { device, sidebar, toggleSidebar, closeSidebar, toggleDevice };
});

/**
 * @description Can be used in SPA apps to use store before pinia instance is activated
 * @description Can be used in SSR apps to use store outside setup()
 */
export function useAppStoreOutside() {
  return useAppStore(pinia);
}
