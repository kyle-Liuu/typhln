import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/views/layout'
import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'

import store from '@/store'
import { Toast } from 'vant'

// 路由懒加载，打包优化
// 只有路由被访问时才会加载对应组件
const Search = () => import('@/views/search')
const SearchList = () => import('@/views/search/list')
const ProDetail = () => import('@/views/prodetail')
const Login = () => import('@/views/login')
const Pay = () => import('@/views/pay')
const MyOrder = () => import('@/views/myorder')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      name: 'layout',
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          name: 'home',
          path: 'home',
          component: Home
        },
        {
          name: 'category',
          path: 'category',
          component: Category
        },
        {
          name: 'cart',
          path: 'cart',
          component: Cart
        },
        {
          name: 'user',
          path: 'user',
          component: User
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'search',
      path: '/search',
      component: Search
    },
    {
      name: 'searchlist',
      path: '/searchlist',
      component: SearchList
    },
    {
      name: 'prodetail',
      path: '/prodetail/:id',
      component: ProDetail
    },
    {
      name: 'pay',
      path: '/pay',
      component: Pay
    },
    {
      name: 'myorder',
      path: '/myorder',
      component: MyOrder
    }
  ]
})

// 全局前置守卫
// 定义一个数组，用来存放需要鉴权的页面
const authUrls = ['/pay', '/myorder']
router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  if (!authUrls.includes(to.path)) {
    next()
    return
  }
  const token = store.getters.token
  if (!token) {
    Toast.fail('登录后查看')
    next('/login')
  } else {
    next()
  }
})
export default router
