import type { Router } from 'vue-router';
import { setRouteChange } from '@@/composables/useRouteListener';
import { useTitle } from '@@/composables/useTitle';
// Authentication removed: no token checks
import NProgress from 'nprogress';
import { usePermissionStore } from '@/pinia/stores/permission';
import { useUserStore } from '@/pinia/stores/user';
import { routerConfig } from '@/router/config';
import { ElMessage } from 'element-plus';
import { getCurrentUser } from '@/common/apis/users';
import { setAuthToken } from '@/http/axios';
import { getAuthTokenHeader } from '@/http/axios';

// Memberstack init script as requested (will be executed only in production when needed)
import memberstackDOM from '@memberstack/dom';
const memberstack = memberstackDOM.init({
  publicKey: 'pk_sb_d2cb5753d1be20562a50'
});
// whitelist removed

NProgress.configure({ showSpinner: false });

const { setTitle } = useTitle();

// When true, seed routes for development convenience
const IGNORE_AUTH = import.meta.env.VITE_IGNORE_AUTH === 'true';

let seeded = false;

export function registerNavigationGuard(router: Router) {
  // Global before guard
  router.beforeEach(async (to, _from) => {
    NProgress.start();
    // On first navigation, perform authentication check and seed routes
    if (!seeded) {
      try {
        const userStore = useUserStore();

        // Determine token: production uses Memberstack, non-prod reads query param
        let token: string | undefined;
        if (import.meta.env.PROD) {
          try {
            // Memberstack: attempt to read token from memberstack element
            const member = (await (memberstack as any).getMember?.()) as any;
            token = member?.tokens?.accessToken || member?.token || undefined;
          } catch {
            token = undefined;
          }
        } else {
          // Non-prod: use ?token= query param
          const urlToken = new URL(window.location.href).searchParams.get('token');
          token = urlToken || undefined;
        }

        // Debug: log token and axios header in dev
        if (import.meta.env.DEV) {
          console.debug('[auth] token param:', token);
          console.debug('[auth] axios Authorization header:', getAuthTokenHeader());
        }

        // If no token, redirect to Memberstack sign-in
        if (!token) {
          const website = import.meta.env.VITE_WEBSITE_URL || '/';
          ElMessage.info('Authentication required — redirecting to sign-in');
          window.location.href = `${website.replace(/\/$/, '')}/account/sign-in`;
          return false as any;
        }

        // Set axios auth header
        setAuthToken(token);

        // Fetch current user from backend
        const res = await getCurrentUser();
        if (import.meta.env.DEV) console.debug('[auth] getCurrentUser result:', res);

        if (!res || !res.success || !res.data || !res.data.name) {
          const website = import.meta.env.VITE_WEBSITE_URL || '/';
          ElMessage.error('Invalid session — redirecting to sign-in');
          //window.location.href = `${website.replace(/\/$/, '')}/account/sign-in`;
          return false as any;
        }

        // Populate user store
        userStore.user = {
          ...userStore.user,
          ms_id: res.data.ms_id || '',
          name: res.data.name || '',
          roles: res.data.roles || []
        } as any;
      } catch (e) {
        const website = import.meta.env.VITE_WEBSITE_URL || '/';
        window.location.href = `${website.replace(/\/$/, '')}/account/sign-in`;
        return false as any;
      }
      try {
        const permissionStore = usePermissionStore();
        routerConfig.dynamic ? permissionStore.setAllRoutes() : permissionStore.setAllRoutes();
        permissionStore.addRoutes.forEach(route => {
          try {
            router.addRoute(route as any);
          } catch {
            // ignore duplicate route errors
          }
        });
      } catch (e) {
        // ignore
      }
      seeded = true;
    }
    // Allow navigation
    return true;
  });

  // Global after hook
  router.afterEach((to) => {
    setRouteChange(to);
    setTitle(to.meta.title);
    NProgress.done();
  });
}
