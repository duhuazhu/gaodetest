/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: "*",
    redirect: "/index",
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/index/index.vue'),
    meta: {
      title: '首页',
      keepAlive: true,
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
    meta: {
      title: '登录',
      keepAlive: false
    }
  },
]
