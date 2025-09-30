import type { App } from 'vue';
import SvgIcon from '~virtual/svg-component';

export function installSvgIcon(app: App) {
  // Register SvgIcon component globally
  app.component('SvgIcon', SvgIcon);
}
