// Authentication removed: provide stubbed cookie/token helpers so imports don't fail.
export function getRootDomain(_hostname: string): string {
  return '';
}

export function getToken() {
  return undefined;
}

export function setToken(_token: string) {
  // noop
}

export function removeToken() {
  // noop
}
