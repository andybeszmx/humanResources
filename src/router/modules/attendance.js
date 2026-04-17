import layout from '@/layout/index.vue'
export default {
  path: '/attendance',
  name: 'attendance',
  component: layout,
  children: [{
    path: '',
    name: 'cattendance',
    component: () => import('@/views/attendance/index.vue'),
    meta: {
      title: '考勤',
      icon: 'excel'
    }
  },
  {
    path: '/attendances/archiving',
    name: 'attendancesHistorical',
    component: () => import('@/views/attendance/historical.vue'),
    hidden: true,    
    meta: {
      title: '历史归档'
    }
  },
  {
    path: '/attendances/report/:yearMonth?',
    name: 'attendancesReport',
    component: () => import('@/views/attendance/report.vue'),
    hidden: true,    
    meta: {
      title: '报表'
    }
  }
]
}
