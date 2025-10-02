/** Declare the type of vite environment variables (if not declared, the default is any) */
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ROUTER_HISTORY: 'hash' | 'html5';
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_MEMBERSTACK_PUBLIC_KEY: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
