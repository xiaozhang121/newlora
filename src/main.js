import "babel-polyfill"
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from '@/config'
import ElementUI from 'element-ui'
import 'iview/dist/styles/iview.css'
import './style/theme/index.css'
import 'echarts/map/js/world'
import 'echarts/map/js/china'
import VueI18n from 'vue-i18n'
import Print from 'vue-print-nb'
Vue.use(Print);  //注册
Vue.config.productionTip = false

// 实际打包时应该不引入mock
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(VueI18n)

Vue.use(ElementUI, { size: 'small', zIndex: 3000, transfer: true })
Vue.prototype.$config = config

/* 全局引入iview ui组件中的Poptip组件，并且以 el-poptip使用 */
import { Poptip, Input, Dropdown, DropdownMenu, DropdownItem, Radio, RadioGroup,Select, Option,Cascader,Collapse,Panel }  from 'iview'
Vue.component('el-poptip', Poptip)
Vue.component('i-input', Input)
Vue.component('i-dropdown', Dropdown)
Vue.component('i-dropdownMenu', DropdownMenu)
Vue.component('i-dropdownItem', DropdownItem)
Vue.component('i-radio', Radio)
Vue.component('i-radioGroup', RadioGroup)
Vue.component('i-radioGroup', RadioGroup)
Vue.component('i-select', Select)
Vue.component('i-option', Option)
Vue.component('el-cascader', Cascader)
Vue.component('el-collapse', Collapse)
Vue.component('el-panel', Panel)

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header')
        const dragDom = el.querySelector('.el-dialog')
        dialogHeaderEl.style.cursor = 'move'

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

        dialogHeaderEl.onmousedown = (e) => {
            if(e.target.className.indexOf('noMove')>-1){
                return
            }
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft
            const disY = e.clientY - dialogHeaderEl.offsetTop

            // 获取到的值带px 正则匹配替换
            let styL, styT

            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (sty.left.includes('%')) {
                styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
                styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
            } else {
                styL = +sty.left.replace(/\px/g, '')
                styT = +sty.top.replace(/\px/g, '')
            }

            document.onmousemove = function(e) {
                if(e.target.className.indexOf('noMove')>-1){
                    return
                }
                // 通过事件委托，计算移动的距离
                const l = e.clientX - disX
                const t = e.clientY - disY

                // 移动当前元素
                dragDom.style.left = `${l + styL}px`
                dragDom.style.top = `${t + styT}px`

                // 将此时的位置传出去
                // binding.value({x:e.pageX,y:e.pageY})
            }

            document.onmouseup = function(e) {
                document.onmousemove = null
            }
        }
    }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
