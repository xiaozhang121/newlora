<template>
  <historical-documents width="500px" :tabPaneData="tabPaneData" @on-show="onShow" :dialogTableVisible="visible" @close="onClose">
    <div>
      <realtime v-if="activeName == 'first'" />
      <historicalwarning title="红外测光-RTS980" :dataList="alarmHistoryData" v-if="activeName == 'second'" />
      <polygonal @onChange="setTime" v-if="activeName == 'third'" />
    </div>
  </historical-documents>
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
          name: "second"
        },
        {
          label: "历史数据",
          name: "third"
        },
      ],
      startTime: '',
      endTime: ''
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    deviceId: {
      type: Number,
      default: 1
    },
    monitorDeviceType:{
        type: String,
        default: '1'
    },
    typeProp: {                    // 两种类型monitor(监控)  power(电网)
      type: String,
      default: 'power'
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
    /* 
      实时信息接口 
      历史告警接口  /lenovo-alarm/api/alarm/history
      图表数据接口  /lenovo-plan/api/plan/history
    */
    onShow (data) {
      this.activeName = data
    },
    onClose (data) {
      this.$emit('onClose', data)
    },
    initData(){
        // 1234567
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
            that.alarmHistoryData = res.data.tableData
        })
        let queryT = {
            [this['deviceType']]:this.deviceId,
            'monitorDeviceType': this.monitorDeviceType,
            'startTime': this.startTime,
            'endTime': this.endTime
        }
        getPlanHistory(queryT).then(res=>{
        })
    },
    setTime(target){
        this.startTime = moment(target[0]).format('YYYY-MM-DD')
        this.endTime = moment(target[1]).format('YYYY-MM-DD')
        this.initData()
    }
  },
  created (){
    this.initData()
  }
}
</script>
<style lang="scss">
  .time > div{
      margin-bottom: 10px;
  }
</style>
