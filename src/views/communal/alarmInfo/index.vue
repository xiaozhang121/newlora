<template>
  <div class="alarmInfoBox">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(item, index) in dataList" :key="index">
        <alarm-item @onChange="onChange" :index="index" :options="item.options" :dataList="item.dataList" :volt="item.volt" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import alarmItem from '_c/AlarmModule'
import { getDeviceType, getAlarmHistory, getAreaList } from '@/api/currency/currency.js'
import { getAxiosData } from '@/api/axiosType'
export default {
  name: 'alarmInfoIndex',
  components: { alarmItem },
  data() {
    return {
      optionsList:[],
      areaList: [],
      dataList: [
        {
          options: [],
          dataList: [],
          volt: '1000千伏'
        },
        {
          options: [],
          dataList: [],
          volt: '500千伏'
        },
        {
          options: [],
          dataList: [],
          volt: '220千伏'
        },
        {
          options: [],
          dataList: [],
          volt: '100千伏'
        },
        {
          options: [],
          dataList: [],
          volt: '35千伏'
        },
        {
          options: [],
          dataList: [],
          volt: '10千伏'
        }
      ]
    }
  },
  watch:{

  },
  methods: {
    onChange(obj){
        const that = this
        let deviceType = obj.value
        let index = obj.index
        getAlarmHistory({pageIndex:1, pageRows:44321, areaId: that.areaList[index]['areaId'], deviceType: deviceType}).then(res=>{
            that.dataList[index]['dataList'] = res.data.tableData
            that.$forceUpdate()
        })
    },
    getData () {
      const that = this
      let data = []
      let methodList = []
      that.dataList = []
      getAreaList()
      .then(res=>{
        that.areaList = res.data.areaList
        that.areaList.forEach(item=>{
            let obj  = {
                options: [],
                dataList: [],
                volt: item['areaName']
            }
           obj = Object.assign(obj,item)
           data.push(obj)
        })
        for(let i=0; i<that.areaList.length; i++){
            methodList.push(
                function () {
                    return getAlarmHistory({pageIndex:1, pageRows:44321, areaId: that.areaList[i]['areaId']})
                }
            )
        }
        return that.reduce(methodList)
      })
      .then(res=>{
        for(let i=0; i<res.length; i++){
            data[i]['dataList'] = res[i].tableData
        }
        return getDeviceType()
      })
      .then(res=>{
        data.map(item=>{
            item['options'] = res.data
        })
        that.dataList = data
        that.$forceUpdate()
      })
    },
    reduce(arr) {
        let sequence = Promise.resolve()
        let res = []
        arr.forEach(function(item) {
            sequence = sequence.then(item).then(info=>{
                res.push(info.data)
                return res
            })
        })
        return sequence
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
  .alarmInfoBox {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    background: #142838;
    background: rgba(20, 40, 56, 0.8);
  }
</style>
