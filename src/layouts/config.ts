import { LayoutModeEnum } from '@@/constants/app-key';
import { getLayoutsConfig } from '@@/utils/cache/local-storage';

/** Project configuration type */
export interface LayoutsConfig {
  /** Whether to show settings button and panel */
  showSettings: boolean;
  /** Layout mode */
  layoutMode: LayoutModeEnum;
  /** Whether to show tags view */
  showTagsView: boolean;
  /** Whether to show logo */
  showLogo: boolean;
  /** Whether to fix header */
  fixedHeader: boolean;
  /** Whether to show footer */
  showFooter: boolean;
  /** Whether to show notifications */
  showNotify: boolean;
  /** Whether to show theme switch button */
  showThemeSwitch: boolean;
  /** Whether to show fullscreen button */
  showScreenfull: boolean;
  /** Whether to show search button */
  showSearchMenu: boolean;
  /** Whether to cache tags view */
  cacheTagsView: boolean;
  /** Enable system watermark */
  showWatermark: boolean;
  /** Whether to show grayscale mode */
  showGreyMode: boolean;
  /** Whether to show color weakness mode */
  showColorWeakness: boolean;
}

/** Default configuration */
const DEFAULT_CONFIG: LayoutsConfig = {
  layoutMode: LayoutModeEnum.Left,
  showSettings: false,
  showTagsView: true,
  fixedHeader: true,
  showFooter: true,
  showLogo: true,
  showNotify: true,
  showThemeSwitch: true,
  showScreenfull: true,
  showSearchMenu: true,
  cacheTagsView: false,
  showWatermark: false,
  showGreyMode: false,
  showColorWeakness: false
};

/** Project configuration */
export const layoutsConfig: LayoutsConfig = { ...DEFAULT_CONFIG, ...getLayoutsConfig() };
