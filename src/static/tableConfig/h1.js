import Vue from 'vue'
import { mergeCol, mergeRow } from '@/static/tableUtil/util'
export let columns = require(`@/static/tableData/h1.js`).default
export let topName = '变压器'
export let bottomName = '日期'
Vue.nextTick(()=>{
  // mergeCol(1, 1, 3)
})