// router/index.js
import { createRouter, createWebHistory } from 'vue-router' // Vue Router 5 核心API
// 布局组件改为懒加载（Vue3 推荐）
const Layout = () => import('@/layout/index.vue')

// 导入模块路由
import departmentRouter from './modules/department'
import approvalRouter from './modules/approval'
import attendanceRouter from './modules/attendance'
import employeeRouter from './modules/employee'
import permissionRouter from './modules/permission'
import roleRouter from './modules/role'
import salaryRouter from './modules/salary'
import socialRouter from './modules/social'

/**
 * 路由元信息配置保持不变
 * hidden/alwaysShow/redirect/meta 等规则与原逻辑一致
 */

/**
 * 静态路由（无需权限）
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

// 动态路由（需权限控制）
export const asyncRoutes = [
  departmentRouter,
  roleRouter,
  employeeRouter,
  permissionRouter,
  attendanceRouter,
  approvalRouter,
  salaryRouter,
  socialRouter
]

// 创建路由实例（Vue Router 5 语法）
const router = createRouter({
  history: createWebHistory(), // 替代原 mode: 'history'
  scrollBehavior: () => ({ top: 0 }), // y → top（Vue Router 5 规范）
  routes: constantRoutes // 默认仅加载静态路由
})

// 重置路由方法（适配 Vue Router 5）
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ top: 0 }),
    routes: constantRoutes
  })
  // 替换路由映射（Vue Router 5 无需修改 matcher，直接替换routes）
  router.replace({ path: '/', force: true })
  Object.assign(router, newRouter)
}

export default router