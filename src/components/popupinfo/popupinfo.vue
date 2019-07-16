<template>
  <div class="popupinfo">
    <historical-documents :showHeader="true" title="4号主变01#枪机" width="500px" :itemId="deviceId" :isClassify="isShowClassify" :tabPaneData="tabPaneData" @clickClassify="clickClassify" @on-show="onShow" :dialogTableVisible="visible" @close="onClose">
      <div>
        <realtime :itemData="itemData" :classifyData="classifyData" :isClassify="isShowClassify" v-if="activeName == 'first'" />
        <historicalwarning :title="title" :dataList="alarmHistoryData" v-if="activeName == 'fourth'" />
        <polygonal @onChange="setTime" :legendData="legendData" :xAxisData="xAxisData" :seriesData="seriesData" :isChange="isChange" v-if="activeName == 'fifth'" />
      </div>
    </historical-documents>
  </div>
</template>
<script>
import moment from 'moment'
import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
import realtime from './components/realtime'
import Polygonal from '_c/duno-c/Polygonal'
import { getAlarmHistory, getPlanHistory } from '@/api/currency/currency.js'
import historicalwarning from './components/historicalwarning'
export default {
  name:'popupinfo',
  components: {HistoricalDocuments, realtime, historicalwarning,Polygonal},
  data() {
    return {
      alarmHistoryData: [],
      activeName: 'first',
      tabPaneData: [
        {
          label: "实时信息",
          name: "first"
        },
        {
          label: "历史告警",
          name: "fourth"
        },
        {
          label: "历史数据",
          name: "fifth"
        },
      ],
      startTime: '',
      endTime: '',
      isChange: true,
      isShowClassify: false,
      legendData: [],
      xAxisData: [],
      seriesData: [],
      classifyData: 'A'
    }
  },
  props: {
    itemData:{},
    index: {},
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    deviceId: {
      type: [Number, String],
      default: 1
    },
    monitorDeviceType:{
        type: [Number, String],
        default: '1'
    },
    typeProp: {                    // 两种类型monitor(监控)  power(电网)
      type: String,
      default: 'monitor'
    }
  },
  computed: {
    deviceType(){
      switch (this.typeProp){
        case 'monitor':
          return 'monitorDeviceId'
        case 'power':
          return 'powerDeviceId'
      }
    }
  },
  methods: {
    clickClassify(data, flag) {
      console.log('当前为：', data, '相')
      this.classifyData = data
      if (flag) this.initData()
    },
    onShow (data) {
      this.activeName = data
      this.initData()
    },
    onClose (data) {
      this.$emit('onClose', data, this.index, 'popupinfoVisable')
    },
    initData() {
      if (this.activeName == 'fourth') {
        this.getFourthData()
      } else if (this.activeName == 'fifth') {
        this.getFifthData()
      }
    },
    getFourthData () {
      const that = this
      let query = {
        [this['deviceType']]:this.deviceId,
        pageIndex: 1,
        pageRows: 44321
      }
      getAlarmHistory(query).then(res=>{
        res.data.tableData.map(item=>{
            item['show'] = false
        })
        console.log(res.data.tableData)
        that.alarmHistoryData = res.data.tableData
      })
    },
    getFifthData () {
      const that = this
      let queryT = {
          [this['deviceType']]:this.deviceId,
          'monitorDeviceType': this.monitorDeviceType,
          'startTime': `${this.startTime} 00:00:00`,
          'endTime': `${this.endTime} 23:59:59`
      }
      getPlanHistory(queryT).then(res=>{
        const dataList = res.data.dataList
        const legendData = []
        const xAxisData = []
        const seriesData = []
        for (let i = 0; i < dataList.length; i++) {
          legendData.push(dataList[i].itemName)
          const itemDataList = dataList[i].itemDataList
          const obj = {
            name: dataList[i].itemName,
            type:'line',
            data: []
          }
          for (let item in itemDataList) {
            if (i == 0) {
              xAxisData.push(itemDataList[item].time)
            }
            obj.data.push(Number(itemDataList[item].data))
          }
          seriesData.push(obj)
        }
        that.legendData = legendData
        that.xAxisData = xAxisData
        that.seriesData = seriesData
        that.isChange = !that.isChange
      })
    },
    setTime(target){
      this.startTime = moment(target[0]).format('YYYY-MM-DD')
      this.endTime = moment(target[1]).format('YYYY-MM-DD')
      this.initData()
    }
  },
  created (){
    this.startTime = moment().format('YYYY-MM-DD')
    this.endTime = moment().format('YYYY-MM-DD')
    console.log('设备类型：', this.itemData.monitorDeviceType == '1'? '可见光': this.itemData.monitorDeviceType == '2'? '红外': '参数没对上')
    if (this.itemData && this.itemData.monitorDeviceType && this.itemData.monitorDeviceType == '1') {
      this.isShowClassify = true
    }
    this.initData()
  }
}
</script>
<style lang="scss">
  .time > div{
      margin-bottom: 10px;
  }
  .popupinfo{
    .historicalwarning, .realtime,.polygonal{
      position: relative;
      top: -13px;
    }
    .HistoricalDocuments{
      .titleBtn{
        margin-right: 53px;
        margin-top: -40px;
      }
    }
  }
</style>
