import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb/index.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

describe('Breadcrumb.vue', () => {
  const wrapper = mount(Breadcrumb, {
    global: {
      plugins: [router, ElementPlus]
    }
  })

  it('dashboard', async () => {
    await router.push('/dashboard')
    await router.isReady()
    await wrapper.vm.$nextTick()   // 等待组件重新渲染
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(1)
  })

  it('normal route', async () => {
    await router.push('/menu/menu1')
    await router.isReady()
    await wrapper.vm.$nextTick()
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(2)
  })

  it('nested route', async () => {
    await router.push('/menu/menu1/menu1-2/menu1-2-1')
    await router.isReady()
    await wrapper.vm.$nextTick()
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(4)
  })

  it('no meta.title', async () => {
    await router.push('/menu/menu1/menu1-2/menu1-2-2')
    await router.isReady()
    await wrapper.vm.$nextTick()
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(3)
  })

  it('last breadcrumb', async () => {
    await router.push('/menu/menu1/menu1-2/menu1-2-1')
    await router.isReady()
    await wrapper.vm.$nextTick()
    const breadcrumbArray = wrapper.findAll('.el-breadcrumb__inner')
    const lastItem = breadcrumbArray[breadcrumbArray.length - 1]
    // 最后一个面包屑不应包含链接
    expect(lastItem.find('a').exists()).toBe(false)
  })
})