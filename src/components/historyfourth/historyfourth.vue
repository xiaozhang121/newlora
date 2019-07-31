<template>
  <div class="historyfourth">
    <h4 class="title">4号主变01#枪机</h4>
    <div class="historyfourthBox">
      <div :class="['historyfourthItem', mouseNum == index ? 'activeItem':'']" @mouseenter.stop="mouseNum = index" @mouseleave.stop="mouseNum = -1" v-for="(item, index) in alarmHistoryData" :key="index">
        <div>{{item.alarmTime}}</div>
        <div>
          <span>当前状态：{{item.status}}</span>
          <span class="threshold">缺陷评估：<span :class="[item.alarmLevel == '1'?'general':(item.alarmLevel == '2'?'warning':'alarm')]">{{item.alarmLevelName}}</span></span>
          <el-button class="showDetail" type="text" @click="showDetail(item.alarmFileAddress)">详细</el-button>
        </div>
      </div>
    </div>
    <div>
      <historical-documents :isShowTab="false" title="详情" :dialogTableVisible="visible" @close="visible = !visible">
        <div class="viewBox">
          <img :src="fileAddress" class="viewContent">
        </div>
      </historical-documents>
    </div>
  </div>
</template>
<script>
import { getAxiosData } from '@/api/axiosType'
import HistoricalDocuments from "_c/duno-c/HistoricalDocuments"
export default {
  name: 'historyfourth',
  components: {HistoricalDocuments},
  data () {
    return {
      alarmHistoryData: [],
      mouseNum: -1,
      visible: false,
      fileAddress: ''
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
    showDetail(url) {
      console.log('详情：', url)
      this.fileAddress = url
      this.visible = true
    },
    getData () {
      const that = this
      const url = '/lenovo-alarm/api/alarm/unhandel-list'
      let query = {
          monitorDeviceId: this.itemId,
          pageIndex: 1,
          pageRows: 10
      }
      if (that.itemData.monitorDeviceType) {
        query.deviceType = that.itemData.monitorDeviceType
      }
      getAxiosData(url, query).then(res=>{
          console.log(res.data)
          if (res.code == 200) {
            that.alarmHistoryData = res.data
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
  .showDetail {
    padding: 5px 10px;
  }
  .viewContent {
    width: 100%;
    display: block;
  }
}
</style>
