import request from '@/utils/request'

// 获取权限列表
export const getPermissionList = () => {
  return request.get('/sys/permission')
}

// 新增权限点
export const addPermission = (data) => {
  return request.post('/sys/permission', data)
}

// 删除接口
export const delPermission = (id) => {
  return request.delete(`/sys/permission/${id}`)
}

// 获取权限详情
export const getPermissionDetail = (id) => {
  return request.get(`/sys/permission/${id}`)
}

// 修改权限详情
export const updatePermission = (data) => {
  return request.put(`/sys/permission/${data.id}`, data)
}
