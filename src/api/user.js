import request from '@/utils/request'

// 登录
export const login = data => {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 用户资料
export const getUserInfo = () => {
  return request({
    url: '/sys/profile'
  })
}

// 密码修改
export const updatePassword = (data) => {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}

export const getUserDetailById = (userId) => {
  return request({
    url: `/api/salarys/modify/${userId}`,
    method: 'get',
    data
  })
}