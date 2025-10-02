import { isArray } from '@@/utils/validate';
import { useUserStore } from '@/pinia/stores/user';

/** Global permission check function, similar to the permission directive v-permission */
export function checkPermission(permissionRoles: string[]): boolean {
  if (isArray(permissionRoles) && permissionRoles.length > 0) {
    const { user } = useUserStore();
    return user.roles.some((role: string) => permissionRoles.includes(role));
  } else {
    console.error('The parameter must be an array with length greater than 0, reference: checkPermission([\'admin\', \'editor\'])');
    return false;
  }
}
