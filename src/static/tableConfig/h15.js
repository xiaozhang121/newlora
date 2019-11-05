import Vue from 'vue'
import { mergeCol, mergeRow } from '@/static/tableUtil/util'
export let columns = require(`@/static/tableData/h15.js`).default
export let topName = '套管'
export let bottomName = '日期'
Vue.nextTick(()=>{
  // mergeCol(1, 1, 3)
})