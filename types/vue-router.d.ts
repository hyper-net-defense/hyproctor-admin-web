import type * as ElementPlusIconsVue from '@element-plus/icons-vue';
import type { SvgName } from '~virtual/svg-component';
import 'vue-router';

export {};

type ElementPlusIconsName = keyof typeof ElementPlusIconsVue;

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * @description Set the name displayed for this route in the sidebar and breadcrumb
     */
    title?: string;
    /**
     * @description Set the icon for this route, remember to import the svg into src/common/assets/icons
     */
    svgIcon?: SvgName;
    /**
     * @description Set the icon for this route, directly use Element Plus's Icon (when both svgIcon and elIcon are set, svgIcon takes precedence)
     */
    elIcon?: ElementPlusIconsName;
    /**
     * @description Default is false, set to true to hide this route from the sidebar
     */
    hidden?: boolean;
    /**
     * @description Set the roles that can access this route, supports multiple roles
     */
    roles?: string[];
    /**
     * @description Default is true, if set to false, it will not be displayed in the breadcrumb
     */
    breadcrumb?: boolean;
    /**
     * @description Default is false, if set to true, it will be fixed in the tags-view
     */
    affix?: boolean;
    /**
     * @description When there is only 1 non-hidden child route in the children property of a route and that child is a leaf node, this child route will be displayed as the parent route in the sidebar
     * @description When there are more than 1, it will revert to nested mode
     * @description If you always want to display the parent route regardless of the number, you can set alwaysShow: true on the parent route
     */
    alwaysShow?: boolean;
    /**
     * @description Example: activeMenu: "/xxx/xxx",
     * @description When this property is set, the corresponding sidebar will be highlighted when entering the route
     * @description This property is suitable for routes with hidden: true
     */
    activeMenu?: string;
    /**
     * @description Whether to cache this route page
     * @description Default is false, true means it needs to be cached. In this case, both the route and the page need to have the same Name
     */
    keepAlive?: boolean;
  }
}
