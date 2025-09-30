import { pinia } from '@/pinia';

// Minimal stub user store to satisfy components after auth removal
export const useUserStore = defineStore('user', () => {
  const token = ref<string>('');
  const user = ref<any>({ ms_id: '', name: '', roles: [] });

  const setToken = (v: string) => {
    token.value = v;
  };

  const getInfo = async () => {
    // noop - no remote call
    return;
  };

  const changeRoles = (_role: string) => {
    // noop in stub
  };

  const logout = () => {
    token.value = '';
    user.value = { ms_id: '', name: '', roles: [] };
  };

  const resetToken = () => {
    token.value = '';
  };

  return { token, user, setToken, getInfo, changeRoles, logout, resetToken };
});

export function useUserStoreOutside() {
  return useUserStore(pinia);
}
