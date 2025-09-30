import type { RouteRecordRaw } from 'vue-router';
import { createRouter } from 'vue-router';
import { routerConfig } from '@/router/config';
// Register simplified navigation guard (seeds permission routes)
import { registerNavigationGuard } from '@/router/guard';
import { flatMultiLevelRoutes } from './helper';

const Layouts = () => import('@/layouts/index.vue');

/**
 * @name Constant Routes
 * @description Except for hidden pages like redirect/403/404/login, it is recommended to set a unique Name property for other pages
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ':path(.*)',
        component: () => import('@/pages/redirect/index.vue')
      }
    ]
  },
  {
    path: '/403',
    component: () => import('@/pages/error/403.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: () => import('@/pages/error/404.vue'),
    meta: {
      hidden: true
    },
    alias: '/:pathMatch(.*)*'
  },
  // login route removed as authentication mechanism was removed
  {
    path: '/',
    component: Layouts,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'Home',
          svgIcon: 'dashboard',
          affix: true
        }
      }
    ]
  },
  {
    path: '/users',
    component: Layouts,
    children: [
      {
        path: '',
        component: () => import('@/pages/users/index.vue'),
        name: 'Users',
        meta: {
          title: 'Users',
          elIcon: 'User'
        }
      }
    ]
  },
  {
    path: '/dg-keys',
    component: Layouts,
    children: [
      {
        path: '',
        component: () => import('@/pages/placeholder/index.vue'),
        name: 'Organization',
        meta: {
          title: 'Organization',
          svgIcon: 'organization'
        }
      }
    ]
  },
  {
    path: '/black-domain',
    component: Layouts,
    children: [
      {
        path: '',
        component: () => import('@/pages/placeholder/index.vue'),
        name: 'Black Domain',
        meta: {
          title: 'Black Domain',
          svgIcon: 'black-domain'
        }
      }
    ]
  },
  {
    path: '/signed-app',
    component: Layouts,
    children: [
      {
        path: '',
        component: () => import('@/pages/placeholder/index.vue'),
        name: 'Signed App',
        meta: {
          title: 'Signed App',
          svgIcon: 'signed-app'
        }
      }
    ]
  },
  {
    path: '/cheat-tool',
    component: Layouts,
    children: [
      {
        path: '',
        component: () => import('@/pages/cheat-tool/index.vue'),
        name: 'Cheat Tool',
        meta: {
          title: 'Cheat Tool',
          svgIcon: 'cheat-tool'
        }
      }
    ]
  },
  {
    path: '/vpn-app',
    component: Layouts,
    children: [
      {
        path: '',
        component: () => import('@/pages/placeholder/index.vue'),
        name: 'VPN App',
        meta: {
          title: 'VPN App',
          svgIcon: 'vpn-app'
        }
      }
    ]
  },
  {
    path: '/remote-app',
    component: Layouts,
    children: [
      {
        path: '',
        component: () => import('@/pages/placeholder/index.vue'),
        name: 'Remote App',
        meta: {
          title: 'Remote App',
          svgIcon: 'remote-app'
        }
      }
    ]
  },
  {
    path: '/virtual-camera',
    component: Layouts,
    children: [
      {
        path: '',
        component: () => import('@/pages/placeholder/index.vue'),
        name: 'Virtual Camera',
        meta: {
          title: 'Virtual Camera',
          svgIcon: 'virtual-camera'
        }
      }
    ]
  },
  {
    path: '/vm-app',
    component: Layouts,
    children: [
      {
        path: '',
        component: () => import('@/pages/placeholder/index.vue'),
        name: 'VM App',
        meta: {
          title: 'VM App',
          svgIcon: 'vm-app'
        }
      }
    ]
  },
  {
    path: '/notification-email',
    component: Layouts,
    children: [
      {
        path: '',
        component: () => import('@/pages/placeholder/index.vue'),
        name: 'Notification Email',
        meta: {
          title: 'Notification Email',
          svgIcon: 'notification-email'
        }
      }
    ]
  },
  {
    path: '/demo',
    component: Layouts,
    redirect: '/demo/unocss',
    name: 'Demo',
    meta: {
      title: 'Examples Collection',
      elIcon: 'DataBoard',
      hidden: true
    },
    children: [
      {
        path: 'unocss',
        component: () => import('@/pages/demo/unocss/index.vue'),
        name: 'UnoCSS',
        meta: {
          title: 'UnoCSS'
        }
      },
      {
        path: 'element-plus',
        component: () => import('@/pages/demo/element-plus/index.vue'),
        name: 'ElementPlus',
        meta: {
          title: 'Element Plus',
          keepAlive: true
        }
      },
      {
        path: 'vxe-table',
        component: () => import('@/pages/demo/vxe-table/index.vue'),
        name: 'VxeTable',
        meta: {
          title: 'Vxe Table',
          keepAlive: true
        }
      },
      {
        path: 'level2',
        component: () => import('@/pages/demo/level2/index.vue'),
        redirect: '/demo/level2/level3',
        name: 'Level2',
        meta: {
          title: 'Secondary Route',
          alwaysShow: true
        },
        children: [
          {
            path: 'level3',
            component: () => import('@/pages/demo/level2/level3/index.vue'),
            name: 'Level3',
            meta: {
              title: 'Tertiary Route',
              keepAlive: true
            }
          }
        ]
      },
      {
        path: 'composable-demo',
        redirect: '/demo/composable-demo/use-fetch-select',
        name: 'ComposableDemo',
        meta: {
          title: 'Composable Functions'
        },
        children: [
          {
            path: 'use-fetch-select',
            component: () => import('@/pages/demo/composable-demo/use-fetch-select.vue'),
            name: 'UseFetchSelect',
            meta: {
              title: 'useFetchSelect'
            }
          },
          {
            path: 'use-fullscreen-loading',
            component: () => import('@/pages/demo/composable-demo/use-fullscreen-loading.vue'),
            name: 'UseFullscreenLoading',
            meta: {
              title: 'useFullscreenLoading'
            }
          },
          {
            path: 'use-watermark',
            component: () => import('@/pages/demo/composable-demo/use-watermark.vue'),
            name: 'UseWatermark',
            meta: {
              title: 'useWatermark'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/link',
    meta: {
      title: 'Documentation Link',
      elIcon: 'Link',
      hidden: true
    },
    children: [
      {
        path: 'https://juejin.cn/post/7445151895121543209',
        component: () => {},
        name: 'Link1',
        meta: {
          title: 'Chinese Docs'
        }
      },
      {
        path: 'https://juejin.cn/column/7207659644487139387',
        component: () => {},
        name: 'Link2',
        meta: {
          title: 'Beginner Tutorial'
        }
      }
    ]
  }
];

/**
 * @name Dynamic Routes
 * @description Used to place routes with permissions (Roles property)
 * @description Must have a unique Name property
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/permission',
    component: Layouts,
    redirect: '/permission/page-level',
    name: 'Permission',
    meta: {
      title: 'Permission Demo',
      elIcon: 'Lock',
      // You can set roles in the root route
      roles: ['admin', 'editor'],
      alwaysShow: true,
      hidden: true
    },
    children: [
      {
        path: 'page-level',
        component: () => import('@/pages/demo/permission/page-level.vue'),
        name: 'PermissionPageLevel',
        meta: {
          title: 'Page Level',
          // Or set roles in the child route
          roles: ['admin']
        }
      },
      {
        path: 'button-level',
        component: () => import('@/pages/demo/permission/button-level.vue'),
        name: 'PermissionButtonLevel',
        meta: {
          title: 'Button Level',
          // If no roles are set, it means: this page does not require permissions, but will inherit the roles of the root route
          roles: undefined
        }
      }
    ]
  }
];

/** Route instance */
export const router = createRouter({
  history: routerConfig.history,
  routes: routerConfig.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
});

/** Reset routes */
export function resetRouter() {
  try {
    // Note: All dynamic routes must have a Name property, otherwise they may not be fully reset
    router.getRoutes().forEach((route) => {
      const { name, meta } = route;
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name);
      }
    });
  } catch {
    // Forcibly refreshing the browser is also fine, but the user experience is not very good
    location.reload();
  }
}

// Register route navigation guards (they are now simplified and only seed routes)
registerNavigationGuard(router);
