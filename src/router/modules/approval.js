import layout from '@/layout/index.vue'
export default {
  path: '/approval',
  name: 'approval',
  component: layout,
  children: [{
    path: '',
    name: 'capproval',
    component: () => import('@/views/approval/index.vue'),
    meta: {
      title: '审批',
      icon: 'tree-table'
    }
  },
  {
    path: '/approvals/securitySetting',
    name: 'security',
    component: () => import('@/views/approval/security.vue'),
    hidden:true,
    meta: {
      title: '审批'
    }
  },
  {
    path: '/approvals/salaryApproval/:id',
    name: 'salary',
    component: () => import('@/views/approval/salary.vue'),
    hidden:true,
    meta: {
      title: '薪水'
    }
  },
  {
    path: '/approvals/enterApproval/:id',
    name: 'enter',
    component: () => import('@/views/approval/enter.vue'),
    hidden:true,
    meta: {
      title: '入职'
    }
  },
  {
    path: '/approvals/leaveApproval/:id',
    name: 'leave',
    component: () => import('@/views/approval/leave.vue'),
    hidden:true,
    meta: {
      title: '请假'
    }
  },
  {
    path: '/approvals/quitApproval/:id',
    name: 'quit',
    component: () => import('@/views/approval/quit.vue'),
    hidden:true,
    meta: {
      title: '离职'
    }
  },
  {
    path: '/approvals/overtimeApproval/:id',
    name: 'overtime',
    component: () => import('@/views/approval/overtime.vue'),
    hidden:true,
    meta: {
      title: '加班'
    }
  }
]
}
