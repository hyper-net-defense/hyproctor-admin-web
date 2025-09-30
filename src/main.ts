/* eslint-disable perfectionist/sort-imports */

// core
import { pinia } from '@/pinia';
import { router } from '@/router';
import { installPlugins } from '@/plugins';
import App from '@/App.vue';
// css
import 'normalize.css';
import 'nprogress/nprogress.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vxe-table/lib/style.css';
import '@@/assets/styles/index.scss';
import 'virtual:uno.css';

// Create application instance
const app = createApp(App);

// Install plugins (global components, custom directives, etc.)
installPlugins(app);

// Install pinia and router
app.use(pinia).use(router);

// Mount the app after the router is ready
router.isReady().then(() => {
  app.mount('#app');
});
