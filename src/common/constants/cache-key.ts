const SYSTEM_NAME = '__nta';

/** Key used when caching data */
export class CacheKey {
  static readonly KEY_ADMIN_AUTH_TOKEN = '__Secure_1NTCDADMIN';
  static readonly CONFIG_LAYOUT = `${SYSTEM_NAME}-config-layout-key`;
  static readonly SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`;
  static readonly ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`;
  static readonly VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`;
  static readonly CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`;
}
