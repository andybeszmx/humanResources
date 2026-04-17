import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    // 模拟浏览器环境
    environment: 'happy-dom',
    // 全局引入 describe/it/expect，无需每次导入
    globals: true,
    // 配置路径别名（与 vite.config.js 保持一致）
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mock/**',
        'src/main.js'  // 入口文件通常不测
      ]
    }
  }
})