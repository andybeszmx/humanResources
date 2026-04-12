import { useAppStore } from './modules/app'
import { useUserStore } from './modules/user'

// 对应原 getters.js 全局计算属性
export const useStoreGetters = () => {
  const appStore = useAppStore()
  const userStore = useUserStore()

  return {
    // app 模块 getters
    sidebar: appStore.sidebar,
    device: appStore.device,
    // user 模块 getters
    token: userStore.token,
    userId: userStore.userId,
    avatar: userStore.avatar,
    name: userStore.name,
    routes: userStore.routes,
    company: userStore.company,
    departmentName: userStore.departmentName
  }
}