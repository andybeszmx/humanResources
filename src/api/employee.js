import request from '@/utils/request'

// 获取员工列表
export const getEmployeeList = (params) => {
  return request.get('/sys/user', { params })
}

// 导出员工的execl表
export function exportEmployee() {
  return request({
    url: '/sys/user/export',

    // 传二进制流，改变格式
    responseType: 'blob'
  })
}

// 下载员工的导入模板
export function getExportTemplate() {
  return request({
    url: 'sys/user/import/template',
    responseType: 'blob'
  })
}

// 上传用户的excel
export const uploadExcel = (data) => {
  return request.post('/sys/user/import', data)
}

// 删除员工
export const delEmployee = (id) => {
  return request.delete(`/sys/user/${id}`)
}

// 新增员工
export const addEmployee = (data) => {
  return request.post('/sys/user', data)
}

// 获取员工的的数据
export const getEmployeeDetail = (id) => {
  return request.get(`/sys/user/${id}`)
}

// 修改员工具体参数
export const updateEmployee = (data) => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

// 获取已启用的角色列表

export const getEnabledRoleList = () => {
  return request.get('/sys/role/list/enabled')
}

// 修改员工角色

export const assignRoles = (data) => {
  return request.put('/sys/user/assignRoles', data)
}
