import request from '@/utils/request'

/** *
 * 获取角色列表
 * **/
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params // 查询参数
  })
}

// 新增角色功能
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 编辑现有角色
export const updateRole = (data) => {
  return request.put(`/sys/role/${data.id}`, data)
}

// 删除角色功能
export const delRole = (id) => {
  return request.delete(`/sys/role/${id}`)
}

// 获取角色详情
export const getRoleDetail = (id) => {
  return request.get(`/sys/role/${id}`)
}

/**
 * 给角色分配权限
 *
 * ***/
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
