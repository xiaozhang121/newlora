<template>
  <historical-documents class="popuponeinfoBox" width="400px" :title="itemData.monitorDeviceName" :isShowTab="false" :dialogTableVisible="visible" @close="onClose">
    <div class="popuponeinfo">
      <el-row>
        <el-col :span="24"><p class="itemTitle">设备名称：<span>{{itemData.powerDeviceName}}</span></p></el-col>
        <el-col :span="24"><p class="itemTitle">当前状态：<span>{{itemData.status}}</span></p></el-col>
        <el-col :span="24"><p class="itemTitle">缺陷评估：<span :class="[itemData.alarmLevel == '1'?'general':(itemData.alarmLevel == '2'?'warning':'alarm')]">{{itemData.alarmLevelName}}</span></p></el-col>
        <el-col :span="12"><p class="itemTitle"><span>{{itemData.alarmTime}}</span></p></el-col>
      </el-row>
      <div>
        <div class="imgBox">
          <img v-if="itemData['alarmFileType'] == 1" :src="itemData.alarmFileAddress" style="height: 100% !important; width: 100% !important;" />
          <video-player v-else-if="itemData['alarmFileType'] == 2" class="vjs-custom-skin realtime_video" :options="{
            width:160,
            height: 120,
            sources: [{
              type: 'rtmp/flv',
              src: itemData['alarmFileAddress']
            }],
            techOrder: ['flash'],
            autoplay: true,
            controls: false
            }">
          </video-player>
          <!--<p class="itemTitle itemBottomTitle">位置：{{itemData.deviceAddress}}</p>-->
        </div>
      </div>
      <el-row style="position: relative; top: -12px">
        <!--<el-col :span="15"><h5 class="itemTitle time">{{itemData.alarmTime}}</h5></el-col>-->
        <el-col :span="16"><div class="buttonAll"><el-button type="info" round @click="restoration('1')">复归</el-button><el-button type="success" round @click="restoration('0')">保存</el-button></div></el-col>
      </el-row>
    </div>
  </historical-documents>
</template>
<script>
import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
import { getAxiosData, postAxiosData } from '@/api/axiosType'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-flash'
export default {
  name: 'popuponeinfo',
  components: {HistoricalDocuments, videoPlayer},
  data () {
    return {
      itemData: {}
    }
  },
  props: {
    itemDataOption:{},
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
    itemDataOption:{
        handler(now){
            this.itemData = now
            this.$forceUpdate()
          /*  if(now){
                this.getData()
            }*/
        },
        deep: true,
        immediate: true
    },
    visible (now) {
    /*  if (now)
          this.getData()*/
    }
  },
  created () {
    // if (this.visible) this.getData()
  },
  methods: {
    restoration (type) {
      this.$store.state.user.isAlarm = false
      console.log(type == '1'?'复归':'保存')
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
      const url = '/lenovo-alarm/api/alarm/unhandel-list'
      const query = {
        pageIndex: 1,
        pageRows: 1,
        isDeal: '0',
        powerDeviceId: that.itemData['powerDeviceId']
      }
      getAxiosData(url, query).then(res => {
        // if (res.code !== 200 || (res.data.tableData && res.data.tableData.length == 0)) {
         /* that.onClose(false)
          return that.$message.error(res.msg)*/
        // }
        // that.itemData = res.data.tableData[0]
        that.itemData = res.data[0]
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
    font-size: 20px;
    font-weight: normal;
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
.popuponeinfoBox{
  .realtime_video > div{
    transform: scale(2.2095, 2.8) !important;
  }
}
.popuponeinfoBox .el-dialog__body {
  padding: 0 20px;

}
</style>
