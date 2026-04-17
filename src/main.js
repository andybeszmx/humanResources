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
import { permissionPlugin } from './directives'

// 创建 app 实例
const app = createApp(App)

// 使用插件
app.use(permissionPlugin)
app.use(ElementPlus)
app.use(router)
app.use(createPinia())

app.config.productionTip = false

// 挂载应用
app.mount('#app')