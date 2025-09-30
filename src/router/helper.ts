import type { Router, RouteRecordNormalized, RouteRecordRaw } from 'vue-router';
import { cloneDeep, omit } from 'lodash-es';
import { createRouter } from 'vue-router';
import { routerConfig } from './config';

/** Route downgrade (convert routes of level 3 and above to level 2) */
export function flatMultiLevelRoutes(routes: RouteRecordRaw[]) {
  const routesMirror = cloneDeep(routes);
  routesMirror.forEach((route) => {
    // If the route is level 3 or above, downgrade it
    isMultipleRoute(route) && promoteRouteLevel(route);
  });
  return routesMirror;
}

/** Check if the route level is greater than 2 */
function isMultipleRoute(route: RouteRecordRaw) {
  const children = route.children;
  // As long as one child route's children length is greater than 0, it is a level 3 or above route
  if (children?.length) return children.some(child => child.children?.length);
  return false;
}

/** Generate secondary routes */
function promoteRouteLevel(route: RouteRecordRaw) {
  // Create a router instance to get all route information for the current route
  let router: Router | null = createRouter({
    history: routerConfig.history,
    routes: [route]
  });
  const routes = router.getRoutes();
  // Use the above route information in the addToChildren function to update the children of the route
  addToChildren(routes, route.children || [], route);
  router = null;
  // After converting to secondary routes, remove all children from the child routes
  route.children = route.children?.map(item => omit(item, 'children') as RouteRecordRaw);
}

/** Add the given child route to the specified route module */
function addToChildren(routes: RouteRecordNormalized[], children: RouteRecordRaw[], routeModule: RouteRecordRaw) {
  children.forEach((child) => {
    const route = routes.find(item => item.name === child.name);
    if (route) {
      // Initialize the children of routeModule
      routeModule.children = routeModule.children || [];
      // If the children property of routeModule does not contain this route, add it
      if (!routeModule.children.includes(route)) {
        routeModule.children.push(route);
      }
      // If the child route has its own children, recursively call this function to add them as well
      if (child.children?.length) {
        addToChildren(routes, child.children, routeModule);
      }
    }
  });
}
