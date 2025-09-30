/** Get the value of a CSS variable on the specified element (default is global) */
export function getCssVar(varName: string, element: HTMLElement = document.documentElement) {
  if (!varName?.startsWith('--')) {
    console.error('CSS variable name should start with \'--\'');
    return '';
  }
  // If no value is obtained, an empty string will be returned
  return getComputedStyle(element).getPropertyValue(varName);
}

/** Set the value of a CSS variable on the specified element (default is global) */
export function setCssVar(varName: string, value: string, element: HTMLElement = document.documentElement) {
  if (!varName?.startsWith('--')) {
    console.error('CSS variable name should start with \'--\'');
    return;
  }
  element.style.setProperty(varName, value);
}
