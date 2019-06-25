<template>
  <div class="alarmInfoBox">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(item, index) in dataList" :key="index">
        <alarm-item :options="item.options" :dataList="item.dataList" :volt="item.volt" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import alarmItem from '_c/AlarmModule'
import { getAxiosData } from '@/api/axiosType'
export default {
  name: 'alarmInfoIndex',
  components: {alarmItem},
  data() {
    return {
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
  methods: {
    getData () {
      const url = ''
      const query = {}
      getAxiosData(url, query).then(res => {
        const dataList = JSON.parse(JSON.stringify(this.dataList))
        if (res.code !== 200) {
          for (let item in dataList) {
            dataList[item].dataList = []
            dataList[item].options = []
          }
          this.dataList = dataList
        }
        const resData = res.data
        console.log('返回的值：', resData)
        // for (let item in dataList) {
        //   for (let j in resData) {

        //   }
        // }
      })
    }
  },
  mounted() {
    // this.getData()
  }
}
</script>
<style lang="scss" scoped>
  .alarmInfoBox {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    background: #1d2027;
  }
</style>
