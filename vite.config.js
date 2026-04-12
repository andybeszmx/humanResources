import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
     AutoImport({
      resolvers: [ElementPlusResolver(
        {
          // 关键：指定 Element Plus 新版样式路径
          importStyle: false
        }
      )],
    }),
    Components({
      resolvers: [ElementPlusResolver(
        {
          // 关键：指定 Element Plus 新版样式路径
          importStyle: false
        }
      )],
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 匹配所有以 /api 开头的请求
      '/api': {
        target: 'https://heimahr.itheima.net', // 后端目标地址
        changeOrigin: true, // 必须加！修改请求头的origin，解决跨域
        rewrite: (path) => path // 不重写路径，和Vue2效果一致
        // 如果你需要去掉/api前缀，加：rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
