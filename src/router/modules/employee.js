import layout from '@/layout/index.vue'
export default {
  path: '/employee',
  name: 'employee',
  component: layout,
  children: [{
    path: '',
    name: 'cemployee',
    component: () => import('@/views/employee/index.vue'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  },
  {
    path: '/employee/detail/:id?',
    name: 'employeeDetail',
    component: () => import('@/views/employee/detail.vue'),
    hidden: true,
    meta: {
      title: '员工详情'
    }
  }
  ]
}
