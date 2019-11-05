import Vue from 'vue'
import { mergeCol, mergeRow } from '@/static/tableUtil/util'
export let columns = require(`@/static/tableData/hh1.js`).default
export let topName = '变压器'
export let bottomName = '日期'
export let reMark = true
export let reMarkInfo = '正常显示温度数值；异常显示温度数值和缺陷类型（一般缺陷/严重缺陷/危急缺陷）'
Vue.nextTick(()=>{
  // mergeCol(1, 1, 3)
})