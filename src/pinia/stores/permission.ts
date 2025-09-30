import type { RouteRecordRaw } from 'vue-router';
import { pinia } from '@/pinia';
import { constantRoutes, dynamicRoutes } from '@/router';
import { routerConfig } from '@/router/config';
import { flatMultiLevelRoutes } from '@/router/helper';

function hasPermission(roles: string[], route: RouteRecordRaw) {
  const routeRoles = route.meta?.roles;
  return routeRoles ? roles.some(role => routeRoles.includes(role)) : true;
}

function filterDynamicRoutes(routes: RouteRecordRaw[], roles: string[]) {
  const res: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tempRoute = { ...route };
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterDynamicRoutes(tempRoute.children, roles);
      }
      res.push(tempRoute);
    }
  });
  return res;
}

export const usePermissionStore = defineStore('permission', () => {
  // Accessible routes
  const routes = ref<RouteRecordRaw[]>([]);

  // Dynamic routes with access permissions
  const addRoutes = ref<RouteRecordRaw[]>([]);

  // Generate accessible routes based on roles (accessible routes = constant routes + permitted dynamic routes)
  const setRoutes = (roles: string[]) => {
    const accessedRoutes = filterDynamicRoutes(dynamicRoutes, roles);
    set(accessedRoutes);
  };

  // All routes = all constant routes + all dynamic routes
  const setAllRoutes = () => {
    set(dynamicRoutes);
  };

  // Unified setup
  const set = (accessedRoutes: RouteRecordRaw[]) => {
    routes.value = constantRoutes.concat(accessedRoutes);
    addRoutes.value = routerConfig.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes;
  };

  return { routes, addRoutes, setRoutes, setAllRoutes };
});

/**
 * @description Can be used in SPA apps to use store before pinia instance is activated
 * @description Can be used in SSR apps to use store outside setup()
 */
export function usePermissionStoreOutside() {
  return usePermissionStore(pinia);
}
