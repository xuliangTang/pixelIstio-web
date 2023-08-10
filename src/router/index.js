import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },


  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/vs',
    component: Layout,
    redirect: '/vs/vslist',
    meta: { title: '虚拟服务管理', icon: 'el-icon-s-help' },
    children: [
      {
      path: 'vslist',
      name: 'Vslist',
      component: () => import('@/views/vs/vslist'),
      meta: { title: '虚拟服务列表', icon: 'dashboard' }
    },
      {
        path: 'vscreate',
        name: 'Vscreate',
        component: () => import('@/views/vs/vscreate'),
        meta: { title: '创建虚拟服务', icon: 'dashboard' }
      },
    ]
  },
  {
    path: '/gw',
    component: Layout,
    redirect: '/gw/gwlist',
    meta: { title: '网关管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'gwlist',
        name: 'Gwlist',
        component: () => import('@/views/gw/gwlist'),
        meta: { title: '网关列表', icon: 'dashboard' }
      },
      {
        path: 'gwcreate',
        name: 'Gwcreate',
        component: () => import('@/views/gw/gwcreate'),
        meta: { title: '创建网关', icon: 'dashboard' }
      },
    ]
  },

  {
    path: '/ds',
    component: Layout,
    redirect: '/ds/dslist',
    meta: { title: '目标规则管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'dslist',
        name: 'Dslist',
        component: () => import('@/views/ds/dslist'),
        meta: { title: '目标规则列表', icon: 'dashboard' }
      },
      {
        path: 'dscreate',
        name: 'Dscreate',
        component: () => import('@/views/ds/ds-create'),
        meta: { title: '创建目标规则', icon: 'el-icon-eleme' },

      },
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
