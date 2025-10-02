import type { App, Directive } from 'vue';
import { isArray } from '@@/utils/validate';
import { useUserStore } from '@/pinia/stores/user';

/**
 * @name Permission Directive
 * @description Similar functionality to the permission check function checkPermission
 */
const permission: Directive = {
  mounted(el, binding) {
    const { value: permissionRoles } = binding;
    const { user } = useUserStore();
    if (isArray(permissionRoles) && permissionRoles.length > 0) {
      const hasPermission = user.roles.some((role: string) => permissionRoles.includes(role));
      hasPermission || el.parentNode?.removeChild(el);
    } else {
      throw new Error(`Argument must be a non-empty array, example: v-permission="['admin', 'editor']"`);
    }
  }
};

export function installPermissionDirective(app: App) {
  app.directive('permission', permission);
}
