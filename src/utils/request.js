import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 100000
})

// 请求拦截器
service.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
  if (response.data instanceof Blob) return response.data
  
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    ElMessage({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async (error) => {
  if (error.response?.status === 401) {
    ElMessage.warning('token超时了')
    
    // PINIA 写法：退出登录
    const userStore = useUserStore()
    await userStore.logout()
    
    // 跳转到登录页
    router.push('/login')
    return Promise.reject(error)
  }

  ElMessage({ type: 'error', message: error.message })
  return Promise.reject(error)
})

export default service