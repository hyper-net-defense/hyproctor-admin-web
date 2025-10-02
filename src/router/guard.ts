import type { Router } from 'vue-router';
import { setRouteChange } from '@@/composables/useRouteListener';

import { useTitle } from '@@/composables/useTitle';
import memberstackDOM from '@memberstack/dom';
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress';
import { getCurrentUser } from '@/common/apis/users';
import { getAuthTokenHeader, setAuthToken } from '@/http/axios';
import { usePermissionStore } from '@/pinia/stores/permission';
import { useUserStore } from '@/pinia/stores/user';
import { routerConfig } from '@/router/config';

const memberstack = memberstackDOM.init({
  publicKey: import.meta.env.VITE_MEMBERSTACK_PUBLIC_KEY
});

NProgress.configure({ showSpinner: false });

const { setTitle } = useTitle();

let seeded = false;

export function registerNavigationGuard(router: Router) {
  // Global before guard
  router.beforeEach(async (_, _from) => {
    NProgress.start();
    // On first navigation, perform authentication check and seed routes
    if (!seeded) {
      try {
        const userStore = useUserStore();

        let token: string = '';
        if (import.meta.env.PROD) {
          try {
            token = await memberstack.getMemberCookie();
          } catch {
            token = '';
          }
        } else {
          // Non-prod: use ?token= query param
          const urlToken = new URL(window.location.href).searchParams.get('token');
          token = urlToken ?? '';
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
          return false;
        }

        // Set axios auth header
        setAuthToken(token);

        // Fetch current user from backend
        const res = await getCurrentUser();
        if (import.meta.env.DEV) console.debug('[auth] getCurrentUser result:', res);

        if (!res || !res.success || !res.data || !res.data.name) {
          const website = import.meta.env.VITE_WEBSITE_URL || '/';
          ElMessage.error('Invalid session — redirecting to sign-in');
          window.location.href = `${website.replace(/\/$/, '')}/account/sign-in`;
          return false;
        }

        // Populate user store
        userStore.user = {
          ...userStore.user,
          ms_id: res.data.ms_id || '',
          name: res.data.name || '',
          roles: res.data.roles || []
        };
      } catch (e) {
        console.log(e);
        const website = import.meta.env.VITE_WEBSITE_URL || '/';
        window.location.href = `${website.replace(/\/$/, '')}/account/sign-in`;
        return false;
      }

      const permissionStore = usePermissionStore();
      routerConfig.dynamic ? permissionStore.setAllRoutes() : permissionStore.setAllRoutes();
      permissionStore.addRoutes.forEach((route) => {
        router.addRoute(route);
      });
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
