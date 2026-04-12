import layout from '@/layout/index.vue'
export default {
  path: '/permission',
  name: 'permission',
  component: layout,
  children: [{
    path: '',
    name: 'cpermission',
    component: () => import('@/views/permission/index.vue'),
    meta: {
      title: '权限',
      icon: 'lock'
    }
  }]
}
