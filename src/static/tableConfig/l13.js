import Vue from 'vue'
import { mergeCol, mergeRow } from '@/static/tableUtil/util'
export let columns = require(`@/static/tableData/l13.js`).default
export let topName = '主变'
export let bottomName = '时间-日期'
export let reMark = true
export let reMarkInfo = '状态识别显示"表计读数异常"/"表计读数正常"/"无法识别"；油温显示"正常"/"过高"/"过低"'
Vue.nextTick(()=>{
  let trSet = document.getElementsByClassName('MainTable')[0].getElementsByTagName('tr')
  let count = 0
  for(let i=0; i<trSet.length; i++){
    if(trSet[i].classList.contains('ivu-table-row')){
      if(count % 8 == 0){
        mergeRow(0, count, 8)
      }
      count++
    }
  }
  // mergeRow(0, 0, 2)
})