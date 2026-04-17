import layout from '@/layout/index.vue'
export default {
  path: '/salary',
  name: 'salary',
  component: layout,
  children: [{
    path: '',
    name: 'csalary',
    component: () => import('@/views/salary/index.vue'),
    meta: {
      title: '工资',
      icon: 'money'
    }
  },
  {
    path: '/salarys/setting',
    name: 'salarysSetting',
    component: () => import('@/views/salary/setting.vue'),
    hidden:true,
    meta: {
      title: '设置'
    }
  }, {
    path: '/salarys/monthStatement/:yearMonth?',
    name: 'salarysMonthStatement',
    component: () => import('@/views/salary/month.vue'),
    hidden:true,
    meta: {
      title: '报表'
    }
  },
  {
    
    path: '/salarys/details/:yearMonth/:id',
    name: 'salarysDetail',
    component: () => import('@/views/salary/detail.vue'),
    hidden:true,
    meta: {
      title: '明细'
    }
  }
]
}
