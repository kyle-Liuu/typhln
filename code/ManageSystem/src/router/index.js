import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

/* 
  1. 创建路由实例由 createRouter 实现
  2. 路由模式
    1. history 模式使用 createWebHistory() 地址不带#
    2. hash 模式使用 createWebHashHistory() 地址带#
    3. 参数 import.meta.env.BASE_URL 是基础路径，会加入到地址栏中去，默认为 / 
  创建一个路由实例，路由模式是history模式，路由的基础地址是 vite.config.js中的 base 配置项的值
*/

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      redirect: '/article/manage',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      children: [
        {
          path: 'article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: 'article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: 'user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: 'user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: 'user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') return '/login'
})

export default router
