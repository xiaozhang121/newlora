import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'

import store from '@/store'
import { getToken, canTurnTo } from '@/libs/util'
Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes
})
const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  if('kind' in to.meta){
      store.state.app.kilovolt = to.meta.kind
  }
  if(from.name && to.name != from.name){
      if(to.meta.topNav == '1'){
          store.state.app.topNav = 1
      }else if(to.meta.topNav == '2'){
          store.state.app.topNav = 2
      }else if(to.meta.topNav == '3'){
          store.state.app.topNav = 3
      }
  }
  let token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME && !to.meta.isLogin) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if ((!token && to.name === LOGIN_PAGE_NAME) || to.meta.isLogin) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: 'realEnvList' // 跳转到home页
    })
  } else {
      if (store.state.user.userId) {
          if (canTurnTo(to.name, store.state.user.access, routes)) {
              if (to.name == 'ticketList') {
                  window.location.href = 'http://10.0.10.45/ar/cardManage'
              } else if (to.name == 'inspectionList') {
                  window.location.href = 'http://10.0.10.45/ar/taskManage'
              } else if (to.name == 'videoList') {
                  window.location.href = 'http://10.0.10.45/ar/videoRecord'
              } else {
                  next() // 有权限，可访问
              }
          } else next({replace: true, name: 'error_401'}) // 无权限，重定向到401页面
      } else {
          if (store.state.user.userId) {
              if (canTurnTo(to.name, store.state.user.access, routes)) {
                  if (to.name == 'ticketList') {
                      window.location.href = 'http://10.0.10.45/ar/cardManage'
                  } else if (to.name == 'inspectionList') {
                      window.location.href = 'http://10.0.10.45/ar/taskManage'
                  } else if (to.name == 'videoList') {
                      window.location.href = 'http://10.0.10.45/ar/videoRecord'
                  } else {
                      next() // 有权限，可访问
                  }
              } else next({replace: true, name: 'error_401'}) // 无权限，重定向到401页面
          } else {
              store.dispatch('getUserInfo').then(user => {
                  store.dispatch('setConfigure').then(config => {
                      // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
                      if (canTurnTo(to.name, user.access, routes)) {
                          if (to.name == 'ticketList') {
                              window.location.href = 'http://10.0.10.45/ar/cardManage'
                          } else if (to.name == 'inspectionList') {
                              window.location.href = 'http://10.0.10.45/ar/taskManage'
                          } else if (to.name == 'videoList') {
                              window.location.href = 'http://10.0.10.45/ar/videoRecord'
                          } else {
                              next() // 有权限，可访问
                          }
                      } else next({replace: true, name: 'error_401'}) // 无权限，重定向到401页面
                  })
              })
          }
      }
  }
})

router.afterEach(to => {
    // window.scrollTo(0, 0)
})

export default router