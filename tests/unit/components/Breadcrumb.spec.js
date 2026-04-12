import { mount, createLocalVue } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router' // Vue3 路由创建方式
import ElementPlus from 'element-plus' // 替换 element-ui 为 element-plus
import Breadcrumb from '@/components/Breadcrumb/index.vue'

const localVue = createLocalVue()
localVue.use(ElementPlus) // 注册 Element Plus

const routes = [
  {
    path: '/',
    name: 'home',
    children: [{
      path: 'dashboard',
      name: 'dashboard'
    }]
  },
  {
    path: '/menu',
    name: 'menu',
    children: [{
      path: 'menu1',
      name: 'menu1',
      meta: { title: 'menu1' },
      children: [{
        path: 'menu1-1',
        name: 'menu1-1',
        meta: { title: 'menu1-1' }
      },
      {
        path: 'menu1-2',
        name: 'menu1-2',
        redirect: 'noredirect',
        meta: { title: 'menu1-2' },
        children: [{
          path: 'menu1-2-1',
          name: 'menu1-2-1',
          meta: { title: 'menu1-2-1' }
        },
        {
          path: 'menu1-2-2',
          name: 'menu1-2-2'
        }]
      }]
    }]
  }]

// Vue3 路由实例创建方式
const router = createRouter({
  history: createWebHistory(), // 替换 mode: 'history'
  routes
})

describe('Breadcrumb.vue', () => {
  const wrapper = mount(Breadcrumb, {
    global: { // Vue3 测试工具的全局配置（替代 localVue）
      plugins: [router, ElementPlus]
    }
  })
  
  it('dashboard', async () => { // Vue3 路由跳转需异步
    await router.push('/dashboard') // 路由跳转是异步的，需 await
    await router.isReady() // 等待路由就绪
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(1)
  })
  
  it('normal route', async () => {
    await router.push('/menu/menu1')
    await router.isReady()
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(2)
  })
  
  it('nested route', async () => {
    await router.push('/menu/menu1/menu1-2/menu1-2-1')
    await router.isReady()
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(4)
  })
  
  it('no meta.title', async () => {
    await router.push('/menu/menu1/menu1-2/menu1-2-2')
    await router.isReady()
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(3)
  })
  
  it('last breadcrumb', async () => {
    await router.push('/menu/menu1/menu1-2/menu1-2-1')
    await router.isReady()
    const breadcrumbArray = wrapper.findAll('.el-breadcrumb__inner')
    const redirectBreadcrumb = breadcrumbArray.at(3)
    expect(redirectBreadcrumb.find('a').exists()).toBe(false) // Vue3 用 exists() 替代 contains()
  })
})