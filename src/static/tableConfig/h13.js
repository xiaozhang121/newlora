import Vue from 'vue'
import { mergeCol, mergeRow } from '@/static/tableUtil/util'
export let columns = require(`@/static/tableData/h13.js`).default
export let topName = '电压互感器'
export let bottomName = '日期'
Vue.nextTick(()=>{
  // mergeCol(1, 1, 3)
})