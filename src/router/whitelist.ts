import type { RouteLocationNormalizedGeneric, RouteRecordNameGeneric } from 'vue-router';

/** Whitelist for no-login (matches route path) */
const whiteListByPath: string[] = ['/login'];

/** Whitelist for no-login (matches route name) */
const whiteListByName: RouteRecordNameGeneric[] = [];

/** Check if in whitelist */
export function isWhiteList(to: RouteLocationNormalizedGeneric) {
  // Either path or name matches
  return whiteListByPath.includes(to.path) || whiteListByName.includes(to.name);
}
