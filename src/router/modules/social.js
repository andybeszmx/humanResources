import layout from '@/layout/index.vue'
export default {
  path: '/social',
  name: 'social',
  component: layout,
  children: [{
    path: '',
    name: 'csocial',
    component: () => import('@/views/social/index.vue'),
    meta: {
      title: '社保',
      icon: 'table'
    }
  },
  {
    path: '/social_securitys/detail/:id',
    name: 'detail',
    component: () => import('@/views/social/detail.vue'),
    hidden:true,
    meta: {
      title: '详情'
    }
  },
  {
    path: '/social_securitys/historicalArchiving',
    name: 'historicalArchiving',
    component: () => import('@/views/social/historical.vue'),
    hidden:true,
    meta: {
      title: '历史'
    }
  },
  {
    path: '/social_securitys/monthStatement/:yearMonth?',
    name: 'monthStatement',
    component: () => import('@/views/social/month.vue'),
    hidden:true,
    meta: {
      title: '报表'
    }
  }
]
}
