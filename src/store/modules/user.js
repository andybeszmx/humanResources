import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi, getUserInfo } from '@/api/user'
import { getToken, setToken as setTokenUtil, removeToken as removeTokenUtil } from '@/utils/auth'
import { constantRoutes, resetRouter } from '@/router'

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref(getToken()) // 初始化从缓存取 token
  const info = ref({})
  const routes = ref(constantRoutes)

  const userId = computed(() => info.value.userId)
  const avatar = computed(() => info.value.staffPhoto)
  const name = computed(() => info.value.username)
  const company = computed(() => info.value.company)
  const departmentName = computed(() => info.value.departmentName)

  // actions
  async function login(data) {
    const newToken = await loginApi(data)
    setTokenUtil(newToken)      // 写入缓存
    token.value = newToken  // 更新 state
  }

  async function getInfo() {
    const res = await getUserInfo()
    info.value = res        // 直接更新 info
    return res
  }

  function logout() {
    token.value = null
    info.value = {}
    removeTokenUtil()
    resetRouter()
    routes.value = constantRoutes
  }

  function setRoutes(newRoutes) {
    routes.value = [...constantRoutes, ...newRoutes]
  }

  function removeToken() {
    token.value = null
    removeTokenUtil()           // 调用工具函数清除缓存
  }

  function setInfo(infoData) {
    info.value = infoData
  }

  function setToken(newToken) {
    setTokenUtil(newToken)
    token.value = newToken
  }

  return {
    token,
    info,
    routes,
    userId,
    avatar,
    name,
    company,
    departmentName,
    login,
    getInfo,
    logout,
    setRoutes,
    removeToken,
    setInfo,
    setToken
  }
})