/// <reference types="vitest/config" />

import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import SvgComponent from 'unplugin-svg-component/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import svgLoader from 'vite-svg-loader';

// Configuring Vite: https://vitejs.dev/config
export default defineConfig(({ mode }) => {
  const { VITE_PUBLIC_PATH } = loadEnv(mode, process.cwd(), '') as ImportMetaEnv;
  return {
    // Base public path when served in development or production
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        // @ symbol points to src directory
        '@': resolve(__dirname, 'src'),
        // @@ symbol points to src/common directory
        '@@': resolve(__dirname, 'src/common')
      }
    },
    // Development server configuration
    server: {
      // Listen on all addresses
      host: true,
      // Port number
      port: 8810,
      // Exit if port is already in use
      strictPort: false,
      // Automatically open browser. In dev we open the dashboard route (#/dashboard)
      // Use VITE_PUBLIC_PATH to compute the base path (works if it's an absolute URL or a path)
      open: (() => {
        try {
          // VITE_PUBLIC_PATH could be an absolute URL (e.g. https://.../assets/admin/) or a path (/assets/admin/)
          const base = VITE_PUBLIC_PATH
            ? (() => {
                try {
                  // If it's an absolute URL, extract the pathname
                  return new URL(VITE_PUBLIC_PATH).pathname;
                } catch {
                  // Otherwise assume it's already a pathname
                  return VITE_PUBLIC_PATH;
                }
              })()
            : '/';
          // Ensure leading slash
          const normalized = base.startsWith('/') ? base : `/${base}`;
          return mode === 'development' ? `${normalized}#/dashboard` : true;
        } catch {
          return mode === 'development' ? '/#/dashboard' : true;
        }
      })(),
      // Proxy configuration
      proxy: {
        '/dev': {
          target: 'http://192.168.133.224:8888',
          // Enable WebSocket proxy
          ws: false,
          // Change origin for CORS
          changeOrigin: true,
          rewrite: path => path.replace(/^\/dev/, '')
        },
        '/credit': {
          target: 'https://api.deepgram.com/v1',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/credit/, '')
        }
      },
      // Enable CORS
      cors: false,
      // Warm up frequently used files for faster initial page load
      warmup: {
        clientFiles: [
          './src/layouts/**/*.*',
          './src/pinia/**/*.*',
          './src/router/**/*.*'
        ]
      }
    },
    // Build configuration
    build: {
      // Custom Rollup bundling configuration
      rollupOptions: {
        output: {
          /**
           * @name Chunking strategy
           * @description 1. Ensure these package names exist to avoid build errors
           * @description 2. Remove this config if you don't need custom chunk splitting
           */
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            element: ['element-plus', '@element-plus/icons-vue'],
            vxe: ['vxe-table']
          }
        }
      },
      // Disable gzip size reporting for slightly better build performance
      reportCompressedSize: false,
      // Warn when chunk size exceeds 2048KB
      chunkSizeWarningLimit: 2048
    },
    // ESBuild configuration
    esbuild:
      mode === 'development'
        ? undefined
        : {
            // Remove console.log in production
            pure: ['console.log'],
            // Remove debugger in production
            drop: ['debugger'],
            // Remove all comments in production
            legalComments: 'none'
          },
    // Dependency optimization
    optimizeDeps: {
      include: ['element-plus/es/components/*/style/css']
    },
    // CSS configuration
    css: {
      // Run CSS preprocessor in worker thread
      preprocessorMaxWorkers: true
    },
    // Plugin configuration
    plugins: [
      vue(),
      // Import SVG files as Vue components
      svgLoader({
        defaultImport: 'url',
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  // @see https://github.com/svg/svgo/issues/1128
                  removeViewBox: false
                }
              }
            }
          ]
        }
      }),
      // Auto-generate SvgIcon component and SVG sprites
      SvgComponent({
        iconDir: [resolve(__dirname, 'src/common/assets/icons')],
        preserveColor: resolve(__dirname, 'src/common/assets/icons/preserve-color'),
        dts: true,
        dtsDir: resolve(__dirname, 'types/auto')
      }),
      // Atomic CSS
      UnoCSS(),
      // Auto-import APIs
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'types/auto/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()]
      }),
      // Auto-import components
      Components({
        dts: 'types/auto/components.d.ts',
        resolvers: [ElementPlusResolver()]
      })
    ],
    // Configuring Vitest: https://vitest.dev/config
    test: {
      include: ['tests/**/*.test.{ts,js}'],
      environment: 'happy-dom',
      server: {
        deps: {
          inline: ['element-plus']
        }
      }
    }
  };
});
