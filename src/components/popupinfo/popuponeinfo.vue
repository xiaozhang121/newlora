<template>
  <historical-documents width="400px" :title="title" :isShowTab="false" :dialogTableVisible="visible" @close="onClose">
    <div class="popuponeinfo">
      <el-row>
        <el-col :span="12"><p class="itemTitle">当前温度：<span>{{itemData.alarmValue}}℃</span></p></el-col>
        <el-col :span="12"><p class="itemTitle">超出阈值：<span>{{itemData.threshold}}</span></p></el-col>
        <el-col :span="24"><p class="itemTitle">缺陷评估：<span :class="[itemData.alarmLevel == '1'?'general':(itemData.alarmLevel == '2'?'warning':'alarm')]">{{itemData.alarmLevelName}}</span></p></el-col>
      </el-row>
      <div>
        <div class="imgBox">
          <img :src="imgSrc">
          <p class="itemTitle itemBottomTitle">位置：{{itemData.deviceAddress}}</p>
        </div>
      </div>
      <el-row>
        <el-col :span="15"><h5 class="itemTitle time">{{itemData.alarmTime}}</h5></el-col>
        <el-col :span="9"><div class="buttonAll"><el-button type="info" round @click="restoration()">复位</el-button><el-button type="success" round @click="retain()">保存</el-button></div></el-col>
      </el-row>
    </div>
  </historical-documents>
</template>
<script>
import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
export default {
  name: 'popuponeinfo',
  components: {HistoricalDocuments},
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    imgSrc: {
      type: String,
      default: () => {
        return ''
      }
    },
    itemData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  methods: {
    restoration () {
      console.log('复位')
      const url = "/lenovo-alarm/api/alarm/reset"
      const query = {
        alarmId: itemData.alarmId
      }
    },
    retain () {
      console.log('保存')
      const url = "/lenovo-alarm/api/alarm/save"
      const query = {
        alarmId: itemData.alarmId
      }
    },
    onClose (data) {
      this.$emit('onClose', data)
    }
  }
}
</script>
<style lang="scss" scoped>
  .popuponeinfo {
    .itemTitle {
      color: #fff;
      font-size: 18px;
      padding: 5px 0;
      .alarm {
        color: #d7203f;
        font-size: 22px;
      }
      .warning {
        color: #ff8300;
        font-size: 22px;
      }
      .general {
        color: #ffe828;
        font-size: 22px;
      }
    }
    .itemBottomTitle {
      font-size: 16px !important;
      padding: 5px 10px;
      background: rgba(0,0,0,0.5);
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .time {
      font-size: 16px;
    }
    .imgBox {
      width: 100%;
      height: 0;
      margin: 20px auto;
      padding-bottom: 100%;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
      }
    }
    .buttonAll {
      text-align: right;
    }
  }
</style>
