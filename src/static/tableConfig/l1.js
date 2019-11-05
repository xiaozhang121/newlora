import Vue from 'vue'
import { mergeCol, mergeRow } from '@/static/tableUtil/util'
export let columns = require(`@/static/tableData/l1.js`).default
export let topName = '气室'
export let bottomName = '时间-日期'
export let reMark = true
export let reMarkInfo = '状态识别显示"表计读数异常"/"表计读数正常"/"无法识别"'
Vue.nextTick(()=>{
  // mergeCol(1, 1, 3)
})