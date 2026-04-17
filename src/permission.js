import router, { asyncRoutes } from './router'
import { useUserStore } from '@/store/modules/user' // 只改这一行
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/404', '/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()

  if (userStore.token) {
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      if (!userStore.userId) {
        const { roles } = await userStore.getInfo()

        const filterRoutes = asyncRoutes.filter(item => {
          return roles.menus.includes(item.name)
        })

        userStore.setRoutes(filterRoutes)

        filterRoutes.forEach(route => {
          router.addRoute(route)
        })
        router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })

        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})