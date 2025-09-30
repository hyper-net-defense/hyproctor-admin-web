import type { RouterHistory } from 'vue-router';
import { createWebHashHistory, createWebHistory } from 'vue-router';

/** Route config */
interface RouterConfig {
  /**
   * @name Route mode
   * @description hash mode and html5 mode
   */
  history: RouterHistory;
  /**
   * @name Whether to enable dynamic route feature
   * @description 1. After enabling, you need backend support. The user details API should return a field (roles in this project) to determine and load dynamic routes
   * @description 2. If the project does not need to display different pages for different users, set dynamic: false
   */
  dynamic: boolean;
  /**
   * @name Default role
   * @description When dynamic route feature is off:
   * @description 1. All routes should be written in the constant routes (indicating all logged-in users can access the same pages)
   * @description 2. The system will automatically assign a default role to the current logged-in user, which has no effect
   */
  defaultRoles: Array<string>;
  /**
   * @name Whether to enable caching for routes of level 3 and above
   * @description 1. After enabling, routes will be downgraded (convert routes of level 3 and above to level 2)
   * @description 2. Since all will be converted to level 2, nested child routes of level 2 and above will be invalid
   */
  thirdLevelRouteCache: boolean;
}

const VITE_ROUTER_HISTORY = import.meta.env.VITE_ROUTER_HISTORY;

const VITE_PUBLIC_PATH = import.meta.env.VITE_PUBLIC_PATH;

export const routerConfig: RouterConfig = {
  history: VITE_ROUTER_HISTORY === 'hash' ? createWebHashHistory(VITE_PUBLIC_PATH) : createWebHistory(VITE_PUBLIC_PATH),
  dynamic: true,
  defaultRoles: ['DEFAULT_ROLE'],
  thirdLevelRouteCache: false
};
