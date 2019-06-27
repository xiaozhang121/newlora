<template>
  <historical-documents class="popuponeinfoBox" width="400px" :title="itemData.powerDeviceName" :isShowTab="false" :dialogTableVisible="visible" @close="onClose">
    <div class="popuponeinfo">
      <el-row>
        <el-col :span="12"><p class="itemTitle">当前温度：<span>{{itemData.alarmValue}}℃</span></p></el-col>
        <el-col :span="12"><p class="itemTitle">超出阈值：<span>{{itemData.threshold}}</span></p></el-col>
        <el-col :span="24"><p class="itemTitle">缺陷评估：<span :class="[itemData.alarmLevel == '1'?'general':(itemData.alarmLevel == '2'?'warning':'alarm')]">{{itemData.alarmLevelName}}</span></p></el-col>
      </el-row>
      <div>
        <div class="imgBox">
          <img :src="itemData.alarmFileAddress">
          <p class="itemTitle itemBottomTitle">位置：{{itemData.deviceAddress}}</p>
        </div>
      </div>
      <el-row>
        <el-col :span="15"><h5 class="itemTitle time">{{itemData.alarmTime}}</h5></el-col>
        <el-col :span="9"><div class="buttonAll"><el-button type="info" round @click="restoration('1')">复位</el-button><el-button type="success" round @click="restoration('0')">保存</el-button></div></el-col>
      </el-row>
    </div>
  </historical-documents>
</template>
<script>
import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
import { getAxiosData, postAxiosData } from '@/api/axiosType'
export default {
  name: 'popuponeinfo',
  components: {HistoricalDocuments},
  data () {
    return {
      itemData: {}
    }
  },
  props: {
    itemId: {
      type: String | Number
    },
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  watch: {
    visible (now) {
      if (now) this.getData()
    }
  },
  created () {
    if (this.visible) this.getData()
  },
  methods: {
    restoration (type) {
      console.log(type == '1'?'复位':'保存')
      const url = type == '1' ? "/lenovo-alarm/api/alarm/reset" : '/lenovo-alarm/api/alarm/save'
      const query = {
        alarmId: this.itemData.alarmId
      }
      postAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.$emit('onRestoration', type)
        this.onClose(false)
        this.$message.success(res.msg)
      })
    },
    getData () {
      const that = this
      const url = '/lenovo-alarm/api/alarm/list'
      const query = {
        pageIndex: 1,
        pageRows: 1,
        isDeal: '0',
        powerDeviceId: that.itemId
      }
      getAxiosData(url, query).then(res => {
        if (res.code !== 200 || (res.data.tableData && res.data.tableData.length == 0)) {
          that.onClose(false)
          return that.$message.error(res.msg)
        }
        that.itemData = res.data.tableData[0]
      })
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
<style lang="scss">
.popuponeinfoBox .el-dialog__body {
  padding: 0 20px;
}
</style>
