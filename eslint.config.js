import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}']
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
  {
    rules:{
      // 关闭 <script setup> 组件名必须多单词的限制
      'vue/multi-word-component-names': 'off',
       // 关闭未使用变量检查
      'no-unused-vars': 'off',              
      // 空行最多一行
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
      // 禁止分号
      'semi': ['error', 'never'],
      // 禁止尾随逗号（多余逗号）
      'comma-dangle': ['error', 'never'],
      // import 花括号内必须有空格 -> { computed, onMounted }
      'object-curly-spacing': ['error', 'always'],
      // 逗号后必须有空格，逗号前不能有空格
      'comma-spacing': ['error', { before: false, after: true }]
    }
  }

])
