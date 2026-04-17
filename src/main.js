// 导入 createApp 替代 new Vue
import { createApp } from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/styles/index.scss' // global css

import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

import '@/icons/index' // icon

import '@/permission' // permission control
import { useUserStore } from './store'

// 创建 app 实例
const app = createApp(App)

// 使用插件
app.use(ElementPlus)
app.use(router)
app.use(createPinia())

app.config.productionTip = false

app.directive('permission', {
  mounted(el, binding) {
    // el 指令作用的元素的dom对象
    const userStore = useUserStore()
    const points = userStore.info?.roles?.points || []
    if (!points.includes(binding.value)) {
      el.remove() // 删除元素
    }
  }
})

// 挂载应用
app.mount('#app')