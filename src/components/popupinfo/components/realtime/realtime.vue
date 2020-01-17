<template>
  <div class="realtime">
    <h3 class="title">{{title}}</h3>
    <el-row :gutter="20">
      <el-col :span="(isShowClassify || monitorDeviceType == 1 || monitorDeviceType == 3 || monitorDeviceType == 5)?24:12" :class="{'lightPanel': (isShowClassify || monitorDeviceType == 1 || monitorDeviceType == 3)}">
        <div class="itemImgBox" ref="mapContain" v-if="(isShowClassify || monitorDeviceType == 1 || monitorDeviceType == 3  || monitorDeviceType == 5)">
          <key-monitor
            :autoplay="true"
            :isLive="false"
            width="100%"
            :pushCamera="(isShowClassify || monitorDeviceType == 1 || monitorDeviceType == 3 || monitorDeviceType == 5)?true:false"
            :monitorInfo="{monitorDeviceId: deviceId}"
            :isNav="true"
            :videoAbsolute='true'
            :streamAddr="streamAddrD"
            :showBtmOption="false"
          ></key-monitor>
        </div>
        <div class="itemImgBox" ref="mapContain"  style="width: 226px; height: 150px;transform-origin: left top;" v-else>
          <key-monitor
            :autoplay="true"
            :isLive="false"
            width="100%"
            :pushCamera="(isShowClassify || monitorDeviceType == 1 || monitorDeviceType == 3 || monitorDeviceType == 5)?true:false"
            :videoAbsolute='true'
            :monitorInfo="{monitorDeviceId: deviceId}"
            :isNav="true"
            :streamAddr="playerOptionf.sources[0].src"
            :showBtmOption="false"
          ></key-monitor>
        </div>
      </el-col>
      <el-col :span="12" v-if="monitorDeviceType != 1 && monitorDeviceType != 3  && monitorDeviceType != 5 && !isShowClassify">
        <div class="itemImgBox"
             style="width: 228px; height: 150px"
        >
          <div class="picVideo" ref="mapContain" v-if="itemData['deviceMessage']['typeId'] == 3">
            <key-monitor
              :autoplay="true"
              :isLive="false"
              width="100%"
              :isNav="true"
              :monitorInfo="{monitorDeviceId: deviceId}"
              :isPic="true"
              @mousemove.native="pointerPos($event)"
              @mouseout.native="clearTimer()"
              :streamAddr="streamAddrD"
              :showBtmOption="false"
            ></key-monitor>
          </div>
          <key-monitor
              v-else
              :autoplay="true"
              :isLive="false"
              width="100%"
              @mousemove.native="pointerPos($event)"
              @mouseout.native="clearTimer()"
              :monitorInfo="{monitorDeviceId: deviceId}"
              :isNav="true"
              :streamAddr="playerOptions.sources[0].src"
              :showBtmOption="false"
          ></key-monitor>
        </div>
      </el-col>
    </el-row>
    <div v-if="monitorDeviceType == 2">
      <div class="progress">
        <div class="first">
          鼠标移到红外视频流任一处，可查看此处设备温度数值
        </div>
        <div class="second">
          <el-progress
                  type="circle"
                  :percentage="tepmNum"
                  :width="80"
                  :format="format"
          />
          <p>温度℃</p>
        </div>
      </div>
    </div>
    <div v-else style="display: flex">
      <!--<div class="progress" v-for="(item, index) in templateList" :key="index">-->
        <!--<el-progress-->
                <!--type="circle"-->
                <!--:percentage="item['realValue']"-->
                <!--:width="80"-->
                <!--:format="format"-->
        <!--/>-->
        <!--<p>温度℃</p>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script>
  import {
      getAxiosData,
      deleteDataId,
      postAxiosData,
      putAxiosData
  } from "@/api/axiosType";
  import screenfull from "screenfull";
  import KeyMonitor from "_c/duno-c/KeyMonitor";
  import videojs from 'video.js'
  import "video.js/dist/video-js.css";
  import { videoPlayer } from "vue-video-player";
  import "videojs-flash";
  import SWF_URL from 'videojs-swf/dist/video-js.swf'
  videojs.options.flash.swf = SWF_URL
  export default {
    name: "realtimeTem",
    components: { videoPlayer , KeyMonitor },
    data() {
        return {
            picTimer: null,
            streamAddrD:"",
            cameraPic: '',
            templateList: [],
            demoImage: require('@/assets/images/clock.png'),
            tepmNum: 0,
            timer: null,
            offsetX: null,
            offsetY: null,
            playerOptions: {
                fluid: true,
                aspectRatio: '16:9',
                sources: [
                    {
                        type: "rtmp/flv",
                        src: ""
                    }
                ],
                techOrder: ["flash"],
                autoplay: true,
                controls: false
            },
            playerOptiond: {
                fluid: true,
                aspectRatio: '16:9',
                sources: [
                    {
                        type: "rtmp/flv",
                        src: ""
                    }
                ],
                techOrder: ["flash"],
                autoplay: true,
                controls: false
            },
            playerOptionf: {
                fluid: true,
                aspectRatio: '16:9',
                sources: [
                    {
                        type: "rtmp/flv",
                        src: ""
                    }
                ],
                techOrder: ["flash"],
                autoplay: true,
                controls: false
            }
        };
    },
    computed: {
        deviceId() {
            return this.itemData["monitorDeviceId"].toString();
        }
    },
    props: {
        deviceOptionId:{
            type: [String, Number],
            default: ''
        },
        isShowClassify:{},
        monitorDeviceType: {},
        itemData: {},
        title: {
            type: String,
            default: () => {
                return "";
            }
        },
        imgList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        classifyData: {
            type: String
        },
        isClassify: {
            type: Boolean,
            default: () => {
                return false;
            }
        }
    },
    watch: {
        isShowClassify(now){
            // debugger
        },
        isClassify(now) {
            if (now && this.classifyData) {
                console.log("显示：", now, "相");
            }
        },
        classifyData(now) {
            if (now && this.isClassify) {
                console.log("当前相变化,变化为：", now, "相");
            }
        }
    },
    methods: {
        changeFullScreen(target) {
            const that = this;
            screenfull.toggle(target);
            },
        clearTimer() {
            clearInterval(this.timer);
            this.timer = null;
            this.tepmNum = 0;
        },
        pointerPos(event) {
            const that = this;
            if(this.monitorDeviceType == 2){
                // console.log('x:'+event.offsetX)
                // console.log('y:'+event.offsetY)
                let pannelWidth = 227
                let pannelHeight = 125
                that.offsetX = event.offsetX;
                that.offsetY = event.offsetY;
                if (!this.timer) {
                    this.timer = setInterval(() => {
                        let x = ''
                        console.log(this.itemData['deviceMessage']['typeId'])
                        if(this.itemData['deviceMessage']['typeId'] == 3){
                            x = that.offsetX
                        }else{
                            x = that.offsetX-29<0?0:that.offsetX-29
                            if(that.offsetX > 227-29){
                                x = 227-29*2
                            }
                            pannelWidth = 169
                        }
                        getAxiosData(
                            "/lenovo-iir/device/temperature/get/location/" + this.deviceId,
                            { x: x, y: that.offsetY, r: 1, pannelWidth: pannelWidth, pannelHeight:pannelHeight }
                        ).then(res => {
                            // console.log('data:'+res.data)
                            that.tepmNum = Number(res.data.data);
                        });
                    }, 200);
                }
            }
        },
        format(percentage) {
            percentage = percentage ? percentage : 0;
            return `${percentage}`;
        },
        initCamera() {
            const that = this;
            if(this.isShowClassify && this.deviceOptionId){
                getAxiosData('lenovo-device/api/device/rtmp',{'powerDeviceId': this.deviceOptionId}).then(res=>{
                    // that.playerOptiond.sources[0].src = res.data.addr;
                    that.streamAddrD = res.data.addr;
                    that.$forceUpdate();
                })
                return
            }
            if(this.monitorDeviceType==1 || this.monitorDeviceType == 5){
               /* getAxiosData('/lenovo-plan/api/yinshi/device/real-data',{'monitorDeviceId': that.deviceId}).then(res=>{
                    this.templateList = res.data
                    this.$forceUpdate()
                })*/
            }
            if (this.monitorDeviceType == 1 || this.monitorDeviceType == 3 || this.monitorDeviceType == 5) {
                const url =
                    '/lenovo-visible/api/visible-equipment/sdk/rtmp/' + that.deviceId;
                getAxiosData(url, {}).then(res => {
                    // that.playerOptiond.sources[0].src = res.data;
                    that.streamAddrD = res.data;
                    that.$forceUpdate();
                });
                //先隐藏  勿删
                // getAxiosData('/lenovo-device/api/multi/value',{'monitorDeviceId': that.deviceId}).then(res=>{
                //     this.templateList = res.data
                //     this.$forceUpdate()
                // })
            } else if (this.monitorDeviceType == 2) {
               /* const urld = "/lenovo-iir/device/video/url/rtmp/" + that.deviceId;
                getAxiosData(urld, {}).then(res => {
                    that.playerOptions.sources[0].src = res.data;
                    that.$forceUpdate();
                });*/
                getAxiosData("/lenovo-iir/device/video/isplaying/" + that.deviceId).then(
                    res => {
                        let isPlay = res.data.data;
                        if (isPlay) {
                            return;
                        } else {
                            putAxiosData("/lenovo-iir/device/video/play/" + that.deviceId);
                        }
                    }
                );
                const urldd = "/lenovo-iir/device/video/url/rtmp/" + that.deviceId;
                getAxiosData(urldd, {}).then(res => {
                    let urlPlay = res.data.data
                    console.log(that.itemData['deviceMessage']['typeId'])
                    if(that.itemData['deviceMessage']['typeId'] == 3){
                        getAxiosData(`/lenovo-iir/device/video/new-frame/${that.deviceId}`).then(res=>{
                            that.cameraPic = res.data
                          // that.playerOptiond.sources[0].src = urlPlay;
                          that.streamAddrD = urlPlay;
                          that.playerOptionf.sources[0].src = urlPlay;
                        })
                        that.picTimer = setInterval(()=>{
                            getAxiosData(`/lenovo-iir/device/video/new-frame/${that.deviceId}`).then(res=>{
                                  that.cameraPic = res.data
                              // that.playerOptiond.sources[0].src = urlPlay;
                              that.streamAddrD = urlPlay;
                              that.playerOptionf.sources[0].src = urlPlay;
                            })
                        },200)
                    }
                    that.playerOptions.sources[0].src = res.data.data;
                    that.$forceUpdate();
                });
                if(that.itemData['deviceMessage']['typeId'] != 3){
                  const urld = "/lenovo-iir/device/visible/url/rtmp/" + that.deviceId;
                  getAxiosData(urld, {}).then(res => {
                    that.playerOptionf.sources[0].src = res.data.data;
                    that.$forceUpdate();
                  });
                }
            }
        }
    },
    created() {
        this.initCamera();
        // videojs.options.flash.swf = this.videoTarget
    },
    beforeDestroy(){
        try{
          this.$refs.videoPlayer.player.dispose()
        }catch (e) {}
        try{
          this.$refs.videoPlayerd.player.dispose()
        }catch (e) {}
        clearInterval(this.picTimer)
    },
    mounted() {
        if (this.classifyData && this.isClassify) {
            console.log("初始化加载：", this.classifyData, "相");
        }
    }
    //关闭视频接口
    // destroyed() {
    //   putAxiosData("/lenovo-iir/device/video/stop/" + this.deviceId);
    // }
  };
</script>
<style lang="scss">
@import './realtime.css';
  .realtime_video > div {
    /*transform: scale(1.355, 1.2);*/
    /*transform-origin: left top;*/
  }
  .el-progress__text {
    color: white;
  }
</style>
<style lang="scss">
  .realtime {
    position: relative;
    left: -5px;
    .picVideo{
      width: 100%;
      height: 128px;
      background: black;
      & img{
        width: 100%;
        height: 128px !important;
      }
    }
    .lightPanel {
      .realtime_video > div {
        width: 100%;
        height: 289px;
        transform: scale(1);
      }
    }
    .title {
      margin-bottom: 20px;
      font-size: 22px;
      font-weight: bold;
    }
    .itemImgBox {
      width: 100%;
      height: 0;
      padding-bottom: 56%;
      margin-bottom: 15px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
      }
      .fullScreen{
          position: absolute;
          bottom: 20px;
          right: 0;
      }
    }
    .progress {
      display: flex;
      justify-content: flex-start;
      .first{
        width: 70%;
        font-size: 12px;
        color: #aaa;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .second{
        flex: 1;
        text-align: center;
        margin-top: 20px;
        font-size: 18px;
        p {
          font-size: 16px !important;
        }
      }
    }
  }

</style>
