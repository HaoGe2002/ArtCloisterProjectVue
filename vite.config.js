import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'; // 导入 AutoImport
import Components from 'unplugin-vue-components/vite'; // 导入 Components
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'; // 导入 ElementPlusResolver
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //自动导入 Vue 和 Element Plus 的 API，减少手动导入的工作
    AutoImport({
      imports: ['vue','vue-router','@vueuse/core','pinia'],
      dts: 'src/types/auto-imports.d.ts',
      eslintrc: {
        // 这里先设置成true然后pnpm dev 运行之后会生成 .auto-import.json 文件之后，在改为false
        enabled: true,
        filepath: './.auto-import.json',
        globalsPropValue: true
      }
    }),
    //自动注册 Element Plus 的组件，减少手动注册组件的工作
    Components({
    }),
  ],
  // 路径别名
  resolve: {
    alias:{
      '@': resolvePath('src'),
      '@styles': resolvePath('src/assets/styles'),
      '@icons': resolvePath('src/assets/icons'),
    }
  },
  //使用/api代理发送请求时会使用 http://localhost:7700 自动替换掉/api
  server: {
    port: 5559,
    proxy: {
      '/api': {
        target: 'http://localhost:7700',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  //移除 @charset 规则用于指定 CSS 文件的字符编码。
  // 在现代浏览器中，@charset 规则通常是不必要的，
  // 因为大多数情况下文件编码已经由 HTML 或 HTTP 响应头确定。
  // 移除它可以减少 CSS 文件的体积，略微提升加载速度。
  css: {
    preprocessorOptions: {
      // sass variable and mixin
      scss: {
        api: 'modern-compiler',
        additionalData: 
        `
          @use "@styles/variables.scss" as *; 
          @use "@styles/mixin.scss" as *;
        `
      }
    },
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            }
          }
        }
      ]
    }
  }
})
function resolvePath(paths) {
  return path.resolve(__dirname, paths)
}