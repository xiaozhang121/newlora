<template>
  <div class="historyfourth">
    <h4 class="title">{{title}}</h4>
    <div class="historyfourthBox">
      <div :class="['historyfourthItem', mouseNum == index ? 'activeItem':'']" @mouseenter.stop="mouseNum = index" @mouseleave.stop="mouseNum = -1" v-for="(item, index) in alarmHistoryData" :key="index">
        <div>{{item.alarmTime}}</div>
        <div><span>温度：{{item.alarmValue}}℃</span><span class="threshold">超出阈值：{{item.threshold}}</span>缺陷评估：<span :class="[item.alarmLevel == '1'?'general':(item.alarmLevel == '2'?'warning':'alarm')]">{{item.alarmLevelName}}</span></div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAxiosData } from '@/api/axiosType'
import { error } from 'util';
export default {
  name: 'historyfourth',
  components: {},
  data () {
    return {
      alarmHistoryData: [],
      mouseNum: -1
    }
  },
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    itemId: {
      type: String | Number,
      default: () => {
        return 0
      }
    },
    itemData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    itemId(now) {
      if (now) {
        this.getData()
      }
    }
  },
  methods: {
    getData () {
      const that = this
      const url = '/lenovo-alarm/api/alarm/history'
      let query = {
          monitorDeviceId: this.itemId,
          pageIndex: 1,
          pageRows: 44321
      }
      if (that.itemData.monitorDeviceType) {
        query.deviceType = that.itemData.monitorDeviceType
      }
      getAxiosData(url, query).then(res=>{
          console.log(res.data.tableData)
          if (res.code == 200) {
            that.alarmHistoryData = res.data.tableData
          } else {
            that.alarmHistoryData = []
          }
      })
    }
  },
  mounted() {
    if (this.itemId) {
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.historyfourth {
  .title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }
  &Box {
    width: 100%;
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &Item {
    color: #fff;
    font-size: 18px;
    padding: 10px;
    background: rgba(32, 54, 68, 0.7);
    margin-bottom: 10px;
    border-radius: 4px;

    .threshold {
      margin: 0 1.5em;
    }
    .alarm {
      color: #d7203f;
    }
    .warning {
      color: #ff8300;
    }
    .general {
      color: #ffe828;
    }
  }
  .activeItem {
    background: #444a5a;
  }
}
</style>
