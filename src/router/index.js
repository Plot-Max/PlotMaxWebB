import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'home',
    redirect: '/',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/',
        name: 'Index',
        component: () => import('../views/index/index.vue'),
      },
      {
        path: '/account',
        name: 'Account',
        component: () => import('../views/account/index.vue'),
      },
      {
        path: '/point-not-enough',
        name: 'PointNotEnough',
        component: () => import('../views/result/pointNotEnough.vue'),
      },
      {
        path: '/report',
        name: 'Report',
        component: () => import('../views/report/index.vue'),
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('../views/search/index.vue'),
      },
      {
        path: '/search/result',
        name: 'SearchResult',
        component: () => import('../views/search/result.vue'),
      },
      {
        path: '/subscribe',
        name: 'Subscribe',
        component: () => import('../views/subscribe/index.vue'),
      },
      {
        path: '/wallet',
        name: 'Wallet',
        component: () => import('../views/wallet/index.vue'),
      },
      {
        path: '/pay-success',
        name: 'PaySuccess',
        component: () => import('../views/result/paySuccess.vue'),
      },
      {
        path: '/pay-pack-success',
        name: 'PaySuccess',
        component: () => import('../views/result/payPackSuccess.vue'),
      },
      {
        path: '/subscribe-success',
        name: 'SubscribeSuccess',
        component: () => import('../views/result/subscribeSuccess.vue'),
      },
      {
        path: '/choose-service',
        name: 'ChooseService',
        component: () => import('../views/chooseService/index.vue'),
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    meta: { noAuth: true },
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    meta: { noAuth: true },
    hidden: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
