import { createRouter, createWebHistory } from 'vue-router' // Vue Router 核心API
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

const router = createRouter({
  history: createWebHistory(), // 'history'
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes // 默认仅加载静态路由
})

// 重置路由方法
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ top: 0 }),
    routes: constantRoutes
  })
  // 替换路由映射
  router.replace({ path: '/', force: true })
  Object.assign(router, newRouter)
}

export default router