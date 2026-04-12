import request from '@/utils/request'

// 获取组织架构数据
export const getDepartment = () => {
  return request.get('/company/department')
}

// 获取部门负责人数据
export const getManagerList = () => {
  return request({
    url: '/sys/user/simple'
  })
}

// 新增部门
export const addDepartment = (data) => {
  return request.post('/company/department', data)
}

// 获取部门详情
export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 修改更新部门详情
export function updateDepartment(data) {
  return request({
    method: 'put',
    url: `/company/department/${data.id}`,
    data
  })
}

// 删除部门
export function delDepartment(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}

