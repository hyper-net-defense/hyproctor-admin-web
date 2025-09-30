import type { Directive } from 'vue';

export {};

// Custom directives globally registered by app.directive need to declare TS types here to get type hints
declare module 'vue' {
  export interface ComponentCustomProperties {
    vPermission: Directive<Element, string[]>;
  }
}
