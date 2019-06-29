import "babel-polyfill"
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import config from '@/config'
import ElementUI from 'element-ui'
import 'iview/dist/styles/iview.css'
import './style/theme/index.css'
import VueI18n from 'vue-i18n'

Vue.config.productionTip = false

// 实际打包时应该不引入mock
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(VueI18n)

Vue.use(ElementUI, { size: 'small', zIndex: 3000, transfer: true })
Vue.prototype.$config = config

/* 全局引入iview ui组件中的Poptip组件，并且以 el-poptip使用 */
import { Poptip, Input }  from 'iview'
Vue.component('el-poptip', Poptip)
Vue.component('i-input', Input)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
