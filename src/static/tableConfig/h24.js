import Vue from 'vue'
import { mergeCol, mergeRow } from '@/static/tableUtil/util'
export let columns = require(`@/static/tableData/h24.js`).default
export let topName = '电抗器'
export let bottomName = '日期'
Vue.nextTick(()=>{
  // mergeCol(1, 1, 3)
})