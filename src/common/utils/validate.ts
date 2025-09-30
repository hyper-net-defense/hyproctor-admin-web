/** Check if it is an array */
export function isArray<T>(arg: T) {
  return Array.isArray ? Array.isArray(arg) : Object.prototype.toString.call(arg) === '[object Array]';
}

/** Check if it is a string */
export function isString(str: unknown) {
  return typeof str === 'string' || str instanceof String;
}

/** Check if it is an external link */
export function isExternal(path: string) {
  const reg = /^(https?:|mailto:|tel:)/;
  return reg.test(path);
}
