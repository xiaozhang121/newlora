<template>
  <div class="realtime">
    <h3 class="title">{{title}}</h3>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="itemImgBox">
            <video-player @mousemove.native="pointerPos($event)" @mouseout.native="clearTimer()"  ref="videoPlayer" class="vjs-custom-skin realtime_video" :options="playerOptions"></video-player>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="itemImgBox">
          <video-player @mousemove.native="pointerPos($event)" @mouseout.native="clearTimer()"  ref="videoPlayerd" class="vjs-custom-skin realtime_video" :options="playerOptions"></video-player>
        </div>
      </el-col>
    </el-row>
    <div class="progress">
      <el-progress type="circle" :percentage="tepmNum" :width="100" color="#87CEEB" :format="format" />
      <p>温度℃</p>
    </div>
  </div>
</template>
<script>
import { getAxiosData, deleteDataId, postAxiosData, putAxiosData } from '@/api/axiosType'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-flash'
export default {
  name: 'realtimeTem',
  components: { videoPlayer },
  data(){
      return {
          tepmNum: 0,
          timer: null,
          offsetX: null,
          offsetY: null,
          playerOptions:{
              width:160,
              height: 120,
              sources: [{
                  type: "rtmp/flv",
                  src: 'rtmp://122.96.115.82:1935/live/infrared'
              }],
              techOrder: ['flash'],
              autoplay: true,
              controls: false
          }
      }
  },
  computed:{
      deviceId(){
          return this.itemData['monitorDeviceId'].toString()
      }
  },
  props: {
    itemData: {},
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    imgList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    clearTimer(){
        clearInterval(this.timer)
        this.timer = null
        this.tepmNum = 0
    },
    pointerPos(event){
      const that = this
      console.log('x:'+event.offsetX)
      console.log('y:'+event.offsetY)
      that.offsetX = event.offsetX
      that.offsetY = event.offsetY
      if(!this.timer){
        this.timer = setInterval(()=>{
          getAxiosData('/lenovo-iir/device/temperature/get/probe/'+ this.deviceId,{x: that.offsetX, y: 118-that.offsetY, r: 1}).then(res=>{
              console.log('data:'+res.data)
              that.tepmNum = res.data/1000
          })
        },200)
      }
    },
    format(percentage) {
      return `${percentage}`;
    }
  },
  mounted(){
      putAxiosData('/lenovo-iir/device/video/play/'+this.deviceId)
  },
 destroyed(){
      putAxiosData('/lenovo-iir/device/video/stop/'+this.deviceId)
  }
}
</script>
<style lang="scss">
  .realtime_video > div{
    transform: scale(1.2);
    transform-origin: left top;
  }
  .el-progress__text{
    color: white;
  }
</style>
<style lang="scss" scoped>
.realtime {
  .title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }
  .itemImgBox {
    width: 100%;
    height: 0;
    padding-bottom: 60%;
    margin-bottom: 15px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
  .progress {
    width: 100%;
    text-align: center;
    margin-top: 20px;
    font-size: 18px;
  }
}
</style>
