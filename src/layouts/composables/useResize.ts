import { useRouteListener } from '@@/composables/useRouteListener';
import { DeviceEnum } from '@@/constants/app-key';
import { useAppStore } from '@/pinia/stores/app';

/** Reference Bootstrap's responsive design to set max mobile width to 992 */
const MAX_MOBILE_WIDTH = 992;

/**
 * @name Browser Resize Composable
 * @description Change layout based on browser width changes
 */
export function useResize() {
  const appStore = useAppStore();

  const { listenerRouteChange } = useRouteListener();

  // Determine if current device is mobile
  const isMobile = () => {
    const rect = document.body.getBoundingClientRect();
    return rect.width - 1 < MAX_MOBILE_WIDTH;
  };

  // Handle window resize event
  const resizeHandler = () => {
    if (!document.hidden) {
      const _isMobile = isMobile();
      appStore.toggleDevice(_isMobile ? DeviceEnum.Mobile : DeviceEnum.Desktop);
      _isMobile && appStore.closeSidebar(true);
    }
  };

  // Listen for route changes and adjust layout based on device type
  listenerRouteChange(() => {
    if (appStore.device === DeviceEnum.Mobile && appStore.sidebar.opened) {
      appStore.closeSidebar(false);
    }
  });

  // Add window resize event listener before component mounts
  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler);
  });

  // After component mounts, determine device type based on window size and adjust layout
  onMounted(() => {
    if (isMobile()) {
      appStore.toggleDevice(DeviceEnum.Mobile);
      appStore.closeSidebar(true);
    }
  });

  // Remove window resize event listener before component unmounts
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler);
  });
}
