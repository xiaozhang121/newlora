import Vue from 'vue'
import { mergeCol, mergeRow } from '@/static/tableUtil/util'
export let columns = require(`@/static/tableData/l12.js`).default
export let topName = '避雷器'
export let bottomName = '时间-日期'
export let reMark = true
export let reMarkInfo = '状态识别显示"表计读数异常"/"表计读数正常"/"无法识别"；动作计数不做状态识别'
Vue.nextTick(()=>{
  let trSet = document.getElementsByClassName('MainTable')[0].getElementsByTagName('tr')
  let count = 0
  for(let i=0; i<trSet.length; i++){
    if(trSet[i].classList.contains('ivu-table-row')){
      if(count % 2 == 0){
        mergeRow(0, count, 2)
      }
      count++
    }
  }
  // mergeRow(0, 0, 2)
})