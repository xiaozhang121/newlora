import Vue from 'vue'
import { mergeCol, mergeRow } from '@/static/tableUtil/util'
export let columns = require(`@/static/tableData/l20.js`).default
export let topName = '电压互感器'
export let bottomName = '时间-日期'
export let reMark = true
export let reMarkInfo = '填入正常/过高/过低'
Vue.nextTick(()=>{
  // mergeRow(0, 0, 2)
})