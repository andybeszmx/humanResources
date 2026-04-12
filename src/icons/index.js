//  src/icons/index.js  （替换原来的代码）

import SvgIcon from '@/components/SvgIcon/index.vue'

// 全局注册组件（Vue3 写法）
export default (app) => {
  app.component('svg-icon', SvgIcon)

  // 👇 Vite 方式导入所有 svg图标（等价于原来的 require.context）
  import.meta.glob('./svg/*.svg', { eager: true })
  // console.log('已加载 SVG 图标:', Object.keys(svgFiles))
}