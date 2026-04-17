import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRoutes, resetRouter } from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(), // 初始化时从缓存取 token
    info: {},
    routes: constantRoutes
  }),
  actions: {
    // 对应原 login action
    async login(data) {
      const token = await login(data)
      setToken(token) // 写入缓存
      this.token = token // 更新 state
    },
    // 对应原 getInfo action
    async getInfo() {
      const res = await getUserInfo()
      this.info = res // 直接更新 state，替代原 setInfo mutation
      return res
    },
    // 对应原 logout action
    logout() {
      this.token = null // 清空 token
      this.info = {} // 清空用户信息
      removeToken() // 清除缓存 token
      resetRouter() // 重置路由
      this.routes = constantRoutes // 重置路由列表
    },
    // 对应原 setRoutes mutation
    setRoutes(newRoutes) {
      this.routes = [...constantRoutes, ...newRoutes]
    },
    // 对应原 removeToken mutation（logout 中调用）
    removeToken() {
      this.token = null
      removeToken()
    },
    // 对应原 setInfo mutation（getInfo 中调用）
    setInfo(info) {
      this.info = info
    },
    // 对应原 setToken mutation（login 中调用）
    setToken(token) {
      setToken(token)
      this.token = token
    }
  },
  // 对应原 getters.js 中 user 相关的计算属性
  getters: {
    userId: (state) => state.info.userId,
    avatar: (state) => state.info.staffPhoto,
    name: (state) => state.info.username,
    company: (state) => state.info.company,
    departmentName: (state) => state.info.departmentName
    // token: (state) => state.token,
    // routes: (state) => state.routes
  }
})