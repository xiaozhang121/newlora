<template>
  <div
          class="keyMonitor"
          :style="{width:width}"
          :class="[{isAlarm: isAlarmOption},{noButton: noButton}]"
  >
    <div
            class="camera"
            :style="{'paddingBottom': paddingBottom}"
            @mouseenter="enter()"
            @mouseleave="leave()"
            style="position: relative"
    >
      <div v-if="isLive" class="main vjsLive" id="videoPlayer" :class="{'topStyle': configType == '2'}"   @contextmenu.prevent="toPrevent">
        <video-player
                :class="{'infraredList':routeName == 'infraredList'}"
                ref="videoPlayer"
                class="vjs-custom-skin videoPlayer"
                :options="playerOptionsL"
                :playsinline="true"
                @play="onPlayerPlay($event)"
                @playing="onPlayerPlaying($event)"
                @ready="toPlay"
                @waiting="onPlayerWaiting($event)"
                @mousedown.native="clickNative"
                @error="onPlayerError($event)"
        ></video-player>
      </div>
      <div v-else class="main" id="videoPlayer" :class="{'topStyle': configType == '2'}"   @contextmenu.prevent="toPrevent">
        <video-player
                :style="{display:'none'}"
                :class="{'infraredList':routeName == 'infraredList'}"
                v-if="isPlayback"
                ref="videoPlayerD"
                class="vjs-custom-skin"
                :options="playerOptions"
                :playsinline="true"
                @loadstart="loadstart"
                @seeking="seeking"
                @seeked="seeked"
                @pause="onPlayerPause"
                @ended="onPlayerEnded"
                @loadeddata="onPlayerLoadeddata"
                @waiting="onPlayerWaiting"
                @canplay="onPlayerCanplay"
                @canplaythrough="onPlayerCanplaythrough"
                @play="onPlayerPlay"
                @ready="toPlay"
                @mousedown.native="clickNative"
                @playing="onPlayerPlaying($event)"
                @error="onPlayerError($event)"
        ></video-player>
        <video-player
                v-loading="loading"
                element-loading-background="rgba(0, 0, 0, 0)"
                element-loading-text="请稍后，正在加载数据…"
                :class="{'infraredList':routeName == 'infraredList'}"
                v-if="showView && !isPic"
                ref="videoPlayer"
                class="vjs-custom-skin"
                :options="playerOptions"
                :playsinline="true"
                @play="onPlayerPlay($event)"
                @playing="onPlayerPlaying($event)"
                @ready="toPlay"
                @waiting="onPlayerWaiting($event)"
                @mousedown.native="clickNative"
                @error="onPlayerError($event)"
        ></video-player>
        <img v-else class="cameraImg" :src="picUrl" />
        <div class="backImgK" id="backImgK">
          <div class="back_child">
            <slot></slot>
          </div>
        </div>
      </div>
      <div v-if="isIniializa" class="Initialization">
        <!--<p>
          点击按钮，完成标定初始化设置
          <span @click="changeinit">初始化</span>
        </p>-->
      </div>
      <transition v-if="isNavbar" name="el-zoom-in-bottom">
        <div v-show="showBtm" class="explain iconList">
          <template v-if="!onlyCanel">
            <div
                    :style="isShowNone"
                    class="block"
                    :class="{'hidden': isPic}"
                    v-if="second && !isCamera"
            >
              <span class="demonstration">-15s</span>
              <el-slider :min="-15" :max="0" v-model="value2" :step="15" @change='sliderChange'></el-slider>
              <span class="nowNR">当前</span>
            </div>
            <div class="block" v-else  v-show="!isCamera"></div>
            <div class="block" v-if="isCamera">
              视频录制 {{timeIncreateD}}
              <!--<i  class="iconfont icon-zanting" v-if="!isStop" @click="toStop(true)"></i> <i v-else @click="toStop(false)" class="iconfont icon-bofang"></i>-->
              <i style="margin-left: 10px" @click="videotape()" class="iconfont icon-tingzhi"></i>
            </div>
          </template>
          <span @click="videotape()" v-if="videoCut && isAux">
            <i class="iconfont icon-luxiang" v-if="!isCamera"></i>
            <span v-else class="redPoint"></span>录像
          </span>
          <span @click="isSample(1)" v-if="!onlyCanel && picCut && isAux">
            <i class="iconfont icon-jietu"></i>截图
          </span>
          <!--  <span @click="fullScreen()">
            <i class="iconfont icon-quanping"></i>全屏
          </span>-->
          <span @click="getMainstream()" v-if="!onlyCanel">
            <i class="iconfont icon-quanping"></i>全屏
          </span>
          <span @click="pushMov()" v-if="!onlyCanel && pushCamera">
            <i class="iconfont icon-tuisong"></i>推送
          </span>
          <span class="closeWeb" @click="toClose()" v-if="onlyCanel">
            <i class="iconfont icon-tubiaozhizuomoban"></i>退出网页全屏
          </span>
        </div>
      </transition>
      <el-tooltip effect="dark" :content="contentTip" placement="top">
        <div v-if="isSecond" @click="getJump" class="explain iconList detailIcon" :style="bottom">
          <div class="text">
            <span>{{kilovolt}}</span>
            <span>{{patrolMt}}</span>
          </div>
          <span>
            <i class="iconfont icon-jiantou"></i>
          </span>
        </div>
      </el-tooltip>
    </div>
    <push-mov
            ref="pushMov"
            :pic="cameraPic"
            @on-push="onPushReal"
            @on-close="onClose"
            :visible="pushMovVisable"
    />
    <screenshot
            v-if="isShow"
            :isShow="isShow"
            :isVideo='isVideo'
            :taskId='taskId'
            :shotData="shotData"
            @closeShot="closeShot"
            :monitorInfo="monitorInfo"
            :monitorDeviceId="monitorInfoR['monitorDeviceId']"
    />
  </div>
</template>

<script>
  import "video.js/dist/video-js.css";
  import videojs from "video.js";
  import pushMov from "_c/duno-m/pushMov";
  import { mapState } from "vuex";
  import { postAxiosData, getAxiosData } from "@/api/axiosType";
  import { videoPlayer } from "vue-video-player";
  import "videojs-flash";
  import { editConfig } from "@/api/currency/currency.js";
  import { setTimeout } from "timers";
  import screenshot from "_c/duno-c/screenshot";
  import SWF_URL from "videojs-swf/dist/video-js.swf";
  videojs.options.flash.swf = SWF_URL;
  import "videojs-contrib-hls.js/src/videojs.hlsjs";
  import { snapshoot } from "@/api/configuration/configuration.js";
  export default {
    name: "KeyMonitor",
    components: {
      videoPlayer,
      pushMov,
      screenshot
    },
    props: {
      showType: {},
      powerDeviceId: {},
      isRobot: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      isAux: {//是否为多个视频的辅码流
        type: Boolean,
        default: () => {
          return false;
        }
      },
      isLive: {//是否为直播视频流
        type: Boolean,
        default: () => {
          return true;
        }
      },
      isRecord: {
        type: Boolean,
        default: () => {
          return true;
        }
      },
      pushCamera: {
        type: Boolean,
        default: () => {
          return true;
        }
      },
      onlyCanel: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      bottom: {
        type: Object,
        default() {
          return {};
        }
      },
      isPic: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      noButton: {
        type: Boolean,
        default: () => {
          return true;
        }
      },
      isAlarm: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      configType: {},
      routeName: {},
      Initialization: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      autoplay: {
        type: Boolean,
        default: () => {
          return true;
        }
      },
      imgAdress: {
        type: String,
        default() {
          return "";
        }
      },
      monitorInfo: {
        type: Object | Array,
        default() {
          return {};
        }
      },
      streamAddr: {
        type: String,
        default: ""
      },
      paddingBottom: {
        type: String,
        default: "56%"
      },
      width: {
        type: String,
        default: "50%"
      },
      optionWidth: {
        type: String,
        default: ""
      },
      optionHeight: {
        type: String,
        default: ""
      },
      kilovolt: {
        type: String,
        default: " "
      },
      showBtmOption: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      patrol: {
        type: [String, Number],
        default: " "
      },
      isNav: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      aggregate: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      areaId: {
        type: String,
        default: () => {
          return "";
        }
      }
    },
    watch: {
      isPic: {
        handler(now) {
          if(now){
            this.picTurn()
          }
        },
        deep: true,
        immediate: true
      },
      isAlarmG: {
        handler(now) {
          if (!now) {
            clearInterval(this.sTimer);
            this.isAlarmOption = false;
          }
        },
        deep: true,
        immediate: true
      },
      isAlarm: {
        handler(now) {
          this.isAlarmOption = now;
          if (now) {
            clearInterval(this.sTimer);
            this.sTimer = setInterval(() => {
              this.isAlarmOption = !this.isAlarmOption;
            }, 500);
          }
        },
        deep: true,
        immediate: true
      },
      isNav(now) {
        this.isNavbar = now;
      },
      monitorInfo: {
        handler(now) {
          this.monitorInfoR = now;
        },
        deep: true,
        immediate: true
      },
      streamAddr: {
        handler(now) {
          if (now) {
            if (now.indexOf("mp4") > -1 || now.indexOf("MP4") > -1) {
              this.playerOptions["sources"][0]["type"] = "video/mp4";
              this.playerOptionsL["sources"][0]["type"] = "video/mp4";
            } else {
              this.playerOptions["sources"][0]["type"] = "application/x-mpegURL";
              this.playerOptionsL["sources"][0]["type"] = "application/x-mpegURL";
            }
            this.getHLS(now);
            this.playerOptionsL["sources"][0]["src"] = now;
            this.playerOptionsD["sources"][0]["src"] = now;
            this.playerOptions["sources"][0]["src"] = now;
            this.monitorSrc = now;
            this.showView = true;
            clearTimeout(this.timer);
            this.$nextTick(() => {
              setTimeout(() => {
                try{
                  if(this.autoplay && this.$refs.videoPlayer && this.$refs.videoPlayer.player)
                    this.$refs.videoPlayer.player.play()
                  this.initVideo()
                  this.loading = false;
                }catch (e) {}
              }, 1500);
            });
          }
        },
        immediate: true
      },
      showBtmOption: {
        handler(now) {
          this.isSecond = now;
        },
        immediate: true
      },
      imgAdress: {
        handler(now) {
          if (now) {
            this.playerOptions.poster = now;
            this.playerOptionsD.poster = now;
            this.playerOptionsL.poster = now;
          }
        },
        immediate: true
      },
      width(now) {
        if (now == "calc(25% - 15px)" && document.documentElement.clientWidth > 3000) {
          this.isShowNone = {
            display: "none"
          };
        }else{
          this.isShowNone = {
            // visibility: "hidden"
          };
        }
      },
      kilovolt(now){
        this.judgeIp()
      }
    },
    data() {
      return {
        videoCut:false,//录像是否未指定类的摄像头
        picCut:false,//截图是否未指定类的摄像头
        mainstream:"",
        monitorDeviceType: false,
        isPlayback:false,
        second:false,
        picTurnTimer: null,
        picUrl: require('@/assets/transperant.png'),
        taskId: 0,
        passTime: 0,
        timeSeed: null,
        isStop: false,
        timerTime: null,
        timeIncreateD: "0:00:00",
        monitorId: "",
        isCamera: false,
        isVideo:true,
        isAlarmOption: false,
        sTimer: null,
        timer: null,
        isShow: false,
        loading: false,
        monitorSrc: "",
        monitorInfoR: "",
        cameraPic: "",
        pushMovVisable: false,
        showView: false,
        value2: 15,
        isIniializa: false,
        isNavbar: true,
        showBtm: false,
        shotData: [],
        //   isChange: true,
        isShowNone: {
          // visibility: "hidden"
        },
        isSecond: false,
        playerOptions: {
          sources: [
            {
              type: "rtmp/flv",
              type: "application/x-mpegURL",
              /* type: "video/ogg",
              type: "video/webm",
              type: "video/mp4",*/
              src: ""
              // src: "rtmp://live.hkstv.hk.lxdns.com/live/hks2"
              // src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
            }
          ],
          aspectRatio: "16:9",
          fluid: true,
          // width:document.getElementsById("videoPlayer").offsetWidth,
          techOrder: ["flash"],
          autoplay: true,
          controls: true,
          notSupportedMessage: "此视频暂无法播放，请稍后再试",
          poster: ""
        },
        playerOptionsD: {
          sources: [
            {
              type: "rtmp/flv",
              type: "application/x-mpegURL",
              src: ""
            }
          ],
          aspectRatio: "16:9",
          fluid: true,
          techOrder: ["flash"],
          autoplay: true,
          controls: true,
          notSupportedMessage: "此视频暂无法播放，请稍后再试",
          poster: ""
        },
        playerOptionsL: {
          sources: [
            {
              type: "rtmp/flv",
              type: "application/x-mpegURL",
              src: ""
            }
          ],
          aspectRatio: "16:9",
          fluid: true,
          techOrder: ["flash"],
          autoplay: false,
          controls: true,
          notSupportedMessage: "此视频暂无法播放，请稍后再试",
          poster: "",
          controlBar: {
            timeDivider: false,
            durationDisplay: false,
            remainingTimeDisplay: false,
            currentTimeDisplay: true, // 当前时间
            volumeControl: true, // 声音控制键
            playToggle: true, // 暂停和播放键
            progressControl: true, // 进度条
            fullscreenToggle: true // 全屏按钮
          }
        },
        maxSecond: 0
      };
    },
    computed: {
      ...mapState(["user"]),
      player() {
        return this.$refs.videoPlayer.player;
      },
      isAlarmG() {
        return this.$store.state.user.isAlarm;
      },
      contentTip(){
        // let str = '点击查看摄像头详情'
        let str = ''
        if(this.kilovolt)
          str+=this.kilovolt+' '
        if(this.patrol){
          let pat=this.patrol
          // console.log(this.patrol)
          // pat=pat.replace(new RegExp(/-/g),'.');
          pat=pat.replace(/至/,'-');
          // pat=pat.substring(0,22) + pat.substring(27,pat.length);
          // pat=pat.substring(0,19) + pat.substring(21,pat.length);
          // pat=pat.substring(0,pat.length-2);
          this.patrolMt=pat
        }
        str+='点击查看摄像头详情'
        return str
      }
    },
    methods: {
      onPlayerWaiting(player){
        console.log(this.playerOptions["sources"][0]["src"] + '   player waiting')
        if (this.autoplay && this.$refs.videoPlayer.player) {
          this.$refs.videoPlayer.player.pause()
          this.$refs.videoPlayer.player.play()
        }
        /*  debugger
         */
      },
      onPlayerPlaying(player) {
        // alert('clear')
        console.log(this.playerOptions["sources"][0]["src"] + '   player Playing!')
        clearInterval(this.waitTimer)
        this.waitTimer = null
      },
      onPlayerError(player){
        console.log(this.playerOptions["sources"][0]["src"] +'   player error')
        clearInterval(this.waitTimer)
        this.waitTimer = null
        // this.$refs.videoPlayer.player.load()
      },
      toPlay(){
        try {
          console.log(this.playerOptions["sources"][0]["src"] + '   player ready')
          if (this.autoplay && this.$refs.videoPlayer.player){
            this.$refs.videoPlayer.player.pause()
            this.$refs.videoPlayer.player.play()
          }
        }catch(e){}
        try {
          // console.log('ready')
          this.$nextTick(()=>{
            if (this.autoplay && this.$refs.videoPlayer.player){
              this.$refs.videoPlayer.player.play()
            }
          })
        }catch(e){}
        setTimeout(()=>{
          try{
            if (this.autoplay && this.$refs.videoPlayer.player)
              this.$refs.videoPlayer.player.play()
          }catch (e) {}
        },8000)
      },
      judgeIp(){
        let kilovolt;
        if(this.kilovolt==' '){
          kilovolt=this.$route.query.monitorDeviceName
        }else{
          kilovolt=this.kilovolt;
        }
        let str = kilovolt.slice(-2);
        let array = ['47','48','49','50','51','52','53','54','55','57','58','59'];
        array.forEach(item=>{
          if(str==item){
            this.second=true
          }
        })
      },
      toPrevent(event){
      },
      clickNative(event){
        if(event.button == 2){
          this.$emit('change-video', this.monitorInfo, event)
        }
      },
      getHLS(now){
        if (now.indexOf("mp4") > -1 || now.indexOf("MP4") > -1) {
          this.playerOptions["sources"][0]["type"] = "video/mp4";
          this.playerOptionsL["sources"][0]["type"] = "video/mp4";
        } else {
          this.playerOptions["sources"][0]["type"] = "application/x-mpegURL";
          this.playerOptionsL["sources"][0]["type"] = "application/x-mpegURL";
        }
        if(now.indexOf("m3u8") > -1){
          delete this.playerOptions['techOrder'];
          delete this.playerOptionsL['techOrder'];
        }else{
          this.playerOptions['techOrder']=["flash"]
          this.playerOptionsL['techOrder']=["flash"]
        }
        this.playerOptions["sources"][0]["src"] = now;
        this.playerOptionsL["sources"][0]["src"] = now;
      },
      sliderChange(item){
        let url = '/lenovo-device/api/stream/videoMove';
        if(item == 0){
          let nowRtmp = this.monitorSrc;
          this.isPlayback = false;
          this.getHLS(nowRtmp)
          this.$forceUpdate()
        }else{
          let query = {
            rtmpUrl:this.playerOptions["sources"][0]["src"],
            second:'15',
            orientation:'1'
          }
          postAxiosData(url,query).then(res=>{
            let now = res.data.hlsUrl;
            this.isPlayback = true;
            this.getHLS(now)
          })
        }
      },
      picTurn() {
        const that = this;
        this.picTurnTimer = setInterval(() => {
          getAxiosData(
              `/lenovo-iir/device/video/new-frame/${this.monitorInfoR["monitorDeviceId"]}`
          ).then(res => {
            // that.$store.state.app.picSrc = res.data;
            that.picUrl = res.data
          });
        }, 200);
      },
      toClose() {
        this.$emit("on-close");
      },
      toStop(flag) {
        this.isStop = flag;
        if (this.isStop) {
          // 暂停录像
          clearInterval(this.timerTime);
        } else {
          // 继续录像
          this.timeIncreate(true);
        }
      },
      timeIncreate(flag) {
        this.timeSeed = new Date().getTime();
        if (flag) this.timeSeed -= this.passTime;
        else {
          this.passTime = 0;
        }
        this.timerTime = setInterval(() => {
          console.log(new Date().getTime());
          let times = new Date().getTime() - this.timeSeed;
          this.passTime += 1000;
          this.timeIncreateD = this.formatDuring(times);
          let rest = times / 1000;
          if (rest >= this.maxSecond) {
            this.videotape();
          }
        }, 1000);
      },
      formatDuring(mss) {
        let days = parseInt(mss / (1000 * 60 * 60 * 24));
        let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        minutes = minutes < 10 ? "0" + minutes : minutes;
        let seconds = parseInt((mss % (1000 * 60)) / 1000);
        return (
            hours +
            ":" +
            minutes +
            ":" +
            (Number(seconds) < 10 ? "0" + seconds : seconds)
        );
      },
      videotape() {
        this.isCamera = !this.isCamera;
        if (this.isCamera) {
          // 开始录像
          postAxiosData("/lenovo-device/api/stream/startRecord", {
            rtmpUrl: this.playerOptions["sources"][0]["src"],
            monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
            type: "1"
          }).then(res => {
            this.$message.info(res.msg);
            this.taskId = res.data.taskId;
            this.maxSecond = res.data.maxRecordTime;
            this.timeIncreate();
          });
        } else {
          // 结束录像
          postAxiosData("/lenovo-device/api/stream/endRecord", {
            rtmpUrl: this.playerOptions["sources"][0]["src"],
            taskId: this.taskId
          }).then(res => {
            clearInterval(this.timerTime);
            this.timeIncreateD = "0:00:00";
            this.$message.info(res.msg);
            this.isSample(0);
          });
        }
      },
      webFullScreen() {
        if (self.frameElement && self.frameElement.tagName == "IFRAME") {
          parent.webFullScreen(this.mainstream, this.isPic);
        } else {
          this.$store.state.app.isPic = this.isPic;
          if(this.isPic){
            this.$store.state.app.monitorInfo = this.monitorInfoR
          }
          this.$store.state.app.webFullVisable = !this.$store.state.app
              .webFullVisable;
          this.$store.state.app.webFull = this.mainstream;
        }
      },
      getMainstream(){
        let type=this.monitorDeviceType
        let url
        if(type==1||type==3||type==6){
          url = `/lenovo-visible/api/visible-equipment/sdk/rtmp/${this.monitorInfoR["monitorDeviceId"]}`
        }else if(type==2){
          url = `/lenovo-iir/device/video/url/rtmp/${this.monitorInfoR["monitorDeviceId"]}`
        }
        getAxiosData(url).then(res=>{
          this.mainstream=res.result ||res.data
          this.webFullScreen()
        })
      },
      onPlayerPlay(player) {
        console.log(this.playerOptions["sources"][0]["src"] +'   player play')
        //   alert("play");
      },
      onPlayerPause(player) {
        console.log(this.playerOptions["sources"][0]["src"] +'   player pause')
        //   alert("pause");
      },
      onPlayerEnded(){
        console.log(this.playerOptions["sources"][0]["src"] +'   player ended')
      },
      loadstart(){
        console.log(this.playerOptions["sources"][0]["src"] +'   player loadstart')
      },
      seeking(){
        console.log(this.playerOptions["sources"][0]["src"] +'   player seeking')
      },
      seeked(){
        console.log(this.playerOptions["sources"][0]["src"] +'   player seeked')
      },
      onPlayerLoadeddata(){
        console.log(this.playerOptions["sources"][0]["src"] +'   player loadeddata')
      },
      onPlayerCanplay(){
        console.log(this.playerOptions["sources"][0]["src"] + '   player canplay')
      },
      onPlayerCanplaythrough(){
        console.log(this.playerOptions["sources"][0]["src"] + '   player canplaythrough')
      },
      onPushReal(index) {
        const that = this;
        let query = {
          ["cameraPos0" + index]: this.monitorInfoR["monitorDeviceId"],
          userId: this.$store.state.user.configInfo["userId"],
          id: this.$store.state.user.configInfo.id
        };
        editConfig(query).then(res => {
          that.$store.state.app.isPush = true;
          if (res.data.isSuccess) that.$message.success(res.msg);
          else that.$message.error(res.msg);
          this.pushMovVisable = false;
        });
      },
      onClose() {
        this.pushMovVisable = false;
      },
      pushMov() {
        this.$refs.pushMov.initData();
        // this.$emit("on-push", this.monitorInfoR);
        this.pushMovVisable = true;
        if (this.monitorInfoR) {
          if ("pic" in this.monitorInfoR) {
            // this.cameraPic = this.monitorInfoR["pic"];
            this.cameraPic = "";
          } else {
            this.cameraPic = "";
            /*getAxiosData("/lenovo-device/api/pic/url", {
              rtmpUrl: this.monitorSrc
            }).then(res => {
              this.cameraPic = res.data.pic;
            });*/
          }
        } else {
          this.cameraPic = "";
        }
      },
      fullScreen() {
        let ele = this.$refs.videoPlayer.$el
            .getElementsByClassName("vjs-fullscreen-control")[0]
            .click();
      },
      enter() {
        this.showBtm = true;
      },
      leave() {
        this.showBtm = false;
      },
      initCamera(){
        getAxiosData("/lenovo-device/api/preset/type", {
          monitorDeviceId: this.monitorInfoR["monitorDeviceId"]
        }).then(res => {
          this.monitorDeviceType = res.data["monitorDeviceType"];
          let type=this.monitorDeviceType;
          if(this.isRobot||type=='1'||type=='4'||type=='5'||type=='9'){
            this.picCut=true
          }
          if(type=='3'||type=='9'||type=='9'){
            this.videoCut=true
          }
        })
      },
      getJump() {
        if (this.aggregate) {
          this.$router.push({
            path: "/surveillancePath/areaVideo",
            query: {
              areaId: this.areaId,
              showType: this.showType,
              powerDeviceId: this.powerDeviceId
            }
          });
          return;
        }
        getAxiosData("/lenovo-device/api/preset/type", {
          monitorDeviceId: this.monitorInfoR["monitorDeviceId"]
        }).then(res => {
          let supportPreset = res.data["supportPreset"];
          let monitorDeviceType = res.data["monitorDeviceType"];
          /* if('isBox' in res.data){
               this.$router.push({
                   path: "/surveillancePath/detailEnvC",
                   query: {
                       monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
                       monitorDeviceName: this.monitorInfoR["monitorDeviceName"]
                   }
               });
           }
           else */if (monitorDeviceType == 1  || monitorDeviceType == 5) {
            if (supportPreset) {
              this.$router.push({
                path: "/surveillancePath/detailLight",
                query: {
                  monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
                  monitorDeviceName: this.monitorInfoR["monitorDeviceName"]
                }
              });
            } else {
              this.$router.push({
                path: "/surveillancePath/detailLightN",
                query: {
                  monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
                  monitorDeviceName: this.monitorInfoR["monitorDeviceName"]
                }
              });
            }
          } else if (monitorDeviceType == 2) {
            if (supportPreset) {
              this.$router.push({
                path: "/surveillancePath/detailRed",
                query: {
                  monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
                  monitorDeviceName: this.monitorInfoR["monitorDeviceName"],
                  typeId: res.data["typeId"]
                }
              });
            }else{
              this.$router.push({
                path: "/surveillancePath/detailRedN",
                query: {
                  monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
                  monitorDeviceName: this.monitorInfoR["monitorDeviceName"],
                  typeId: res.data["typeId"]
                }
              });
            }
          } else if (monitorDeviceType == 3 || monitorDeviceType == 9) {
            this.$router.push({
              path: "/surveillancePath/detailEnv",
              query: {
                monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
                monitorDeviceName: this.monitorInfoR["monitorDeviceName"]
              }
            });
          }else if (monitorDeviceType == 6) {
            this.$router.push({
              path: "/surveillancePath/detailUbiquitou",
              query: {
                monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
                monitorDeviceName: this.monitorInfoR["monitorDeviceName"]
              }
            });
          }
        });
        /* this.$router.push({
          path: "/surveillancePath/detailLight",
          query: {
            monitorDeviceId: this.monitorInfoR["monitorDeviceId"]
          }
        });*/
      },
      changeinit() {
        this.$message({
          message: "初始化成功",
          type: "success"
        });
        this.isIniializa = false;
        this.isNavbar = true;
      },
      //获取图片
      isSample(index) {
        if(index){
          this.isVideo = true;
        }else{
          this.isVideo = false;
        }
        this.monitorId = this.monitorInfoR["monitorDeviceId"];
        this.isShow = true;
        if (!this.isPic) {
          let url = "/lenovo-device/api/stream/snapshoot";
          let query = {
            rtmpUrl: this.streamAddr
          };
          postAxiosData(url, query).then(res => {
            this.shotData = res.data;
          });
        } else {
          getAxiosData(
              `/lenovo-iir/device/image/get/output-image/${
                  this.monitorInfoR["monitorDeviceId"]
                  }`
          ).then(res => {
            this.shotData = res.data.data;
          });
        }
      },
      closeShot() {
        this.isShow = false;
      },
      destory(){
        if(this.$refs.videoPlayer && this.$refs.videoPlayer.player){
          // this.$refs.videoPlayer.player.reset()
          this.$refs.videoPlayer.player.dispose()
        }
        if(this.$refs.videoPlayerD && this.$refs.videoPlayerD.player){
          // this.$refs.videoPlayerD.player.reset()
          this.$refs.videoPlayerD.player.dispose()
        }
      },
      initVideo(){
        const that = this
        clearInterval(this.waitTimer)
        this.waitTimer = null
        if(!this.waitTimer && !this.isPic && !this.imgAdress){
          this.waitTimer = setInterval(() => {
            console.log('reload')
            that.$refs.videoPlayer.player.reset()
            that.$refs.videoPlayer.player.src({type: this.playerOptions["sources"][0]["type"], src: this.playerOptions["sources"][0]["src"]})
            that.$refs.videoPlayer.player.load()
            that.$refs.videoPlayer.player.play()
            // try{
            //   that.$refs.videoPlayer.player.dispose()
            //   this.showView = false
            //   that.$nextTick(()=>{
            //     setTimeout(()=>{
            //       this.showView = true
            //       if (this.autoplay && this.$refs.videoPlayer.player)
            //         that.$refs.videoPlayer.player.play()
            //     },6000)
            //   })
            // }catch (e) {}
          }, 20000)
        }
      }
    },
    mounted() {
      this.loading = true;
      this.timer = setTimeout(() => {
        this.loading = false;
      }, 1000000000);
      this.isIniializa = this.Initialization;
      this.isNavbar = this.isNav;
      this.initCamera()
      // console.log(document.getElementsById("videoPlayer").offsetWidth);
    },
    destroyed(){
      this.showView = false
      this.isPlayback = false
    },
    beforeDestroy() {
      try{
        if(this.picTurnTimer){
          clearInterval(this.picTurnTimer)
          this.picTurnTimer = null
        }
        clearInterval(this.waitTimer)
        this.$store.state.app.isPic = false;
      }catch (e) {}
      this.playerOptionsD["sources"][0]["src"] = ''
      this.playerOptions["sources"][0]["src"] = ''
      this.destory()
      this.showView = false
      this.isPlayback = false
      this.$forceUpdate()
    },
    created() {
      try{
        this.judgeIp()
      }catch (e) {}
      this.playerOptions.autoplay = this.autoplay;
      this.playerOptionsD.autoplay = this.autoplay;
      /* if(this.optionWidth && this.optionHeight){
            this.playerOptions.width = this.optionWidth
            this.playerOptions.height = this.optionHeight
        }else{
        }*/
    }
  };
</script>

<style lang="scss">
  .closeWeb {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-right: 3%;
  }
  .pushMov {
    .el-dialog.el-dialog--center {
      margin-top: 15vh !important;
      width: 500px !important;
      height: inherit !important;
      /* align-items: center; */
      margin: 0 auto;
    }
    .el-dialog__header {
      display: block !important;
    }
  }
  .keyMonitor {
    .backImgK{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      pointer-events: none;
      .back_child{
        width: 100%;
        height: 100%;
        position: relative;
      }
    }
    .cameraImg{
      background: black;
      z-index: 0 !important;
    }
    .el-dialog.el-dialog--center {
      margin-top: 15vh !important;
      width: 500px !important;
      height: inherit !important;
      /* align-items: center; */
      margin: 0 auto;
    }
    .el-dialog__header {
      display: block !important;
    }
    .hidden {
      visibility: hidden;
    }
    .cameraImg {
      width: 100%;
      height: 100%;
    }
    .el-slider__button-wrapper .el-tooltip {
      vertical-align: middle;
      display: inline-block;
      border-radius: 100%;
      width: 16px;
      height: 16px;
    }
    .el-slider__runway {
      background-color: #ee183b;
    }
    .el-slider__bar {
      background-color: white;
    }
    .redPoint {
      position: absolute;
      background: red;
      width: 12px;
      height: 12px;
      margin-left: -19px !important;
      border-radius: 300px;
    }
    &.noButton {
      .vjs-big-play-button {
        display: none;
      }
      .video-js .vjs-big-play-button {
        display: none;
      }
    }
    &.isAlarm {
      border: 1px solid red;
    }
    .el-loading-text {
      color: #969696 !important;
    }
    .topStyle {
      background: black;
      .vjs-big-play-button {
        height: 2em !important;
        width: 2em;
        line-height: 2em;
        border-radius: 1em;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0 !important;
        left: 0;
        margin: auto;
      }
    }
    /* .infraredList {
       transform: scale(1, 0.75);
      transform-origin: left top;
    }*/
    .video-player.vjs-custom-skin {
      width: 100%;
    }
    .video-js .vjs-big-play-button {
      /*
       播放按钮换成圆形
      */
      height: 2em;
      width: 2em;
      line-height: 2em;
      border-radius: 1em;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
    .vjsLive:hover{
      .vjs-control-bar {
        display: flex!important;
      }
    }
    .camera {
      width: 100%;
      height: 0;
      padding-bottom: 56%;
      position: relative;
      .main {
        position: absolute;
        width: 100%;
        height: 100%;
        .vjs-control-bar {
          display: none;
        }
      }
      .iconList {
        position: absolute;
        bottom: -3px;
        display: flex;
        justify-content: space-between;
        line-height: 32px !important;
        background-color: rgba(43, 51, 63, 0.7);
        font-size: 12px;
        padding-left: 10px;
        padding-right: 10px;
        width: 100%;
        /*z-index: 1;*/
        span {
          display: flex;
          margin-left: 2%;
          flex: none !important;
          align-items: center;
          text-align: right !important;
        }
        .demonstration {
          margin-left: 0;
          margin-right: 2%;
        }
        i {
          font-size: 15px;
          margin-right: 10px;
        }
      }
      .explain {
        display: flex;
        color: white;
        span {
          text-align: center;
          flex: 1;
          cursor: pointer;
        }
        .block {
          display: flex;
          justify-content: flex-start;
          width: 100%;
          padding-right: 11%;
          .nowNR {
            position: relative;
            left: 9px;
          }
          .icon-zanting,
          .icon-bofang {
            position: relative;
            left: 6px;
          }
          .iconfont {
            cursor: pointer;
          }
          span {
            font-size: 12px;
          }
          .el-slider {
            flex: 1;
          }
        }
        .text {
          overflow: hidden;
          display: block!important;
          // flex:none;
          // justify-content: flex-start;
          width: 100%;
          span {
            padding-right: 10px;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            white-space: nowrap;
            text-align: left !important;
          }
          // span:nth-child(2) {
          //   padding-right: 10px;
          //   font-size: 12px;
          //   color: #a0a0a0;
          // }
        }
      }
      .detailIcon {
        bottom: -33px;
        background-color: #213848;
        cursor: pointer;
      }
    }
    .camera:hover {
      .main {
        .iconList {
          bottom: -1px !important;
          z-index: 2;
        }
      }
    }
    .Initialization {
      position: absolute;
      bottom: 0;
      line-height: 32px;
      width: 100%;
      background-color: rgba(43, 51, 63, 0.7);
      text-align: right;
      color: #fff;
      p {
        font-size: 14px;
        padding-right: 10px;
        span {
          display: inline-block;
          line-height: 24px;
          box-sizing: border-box;
          text-align: center;
          margin-left: 10px;
          cursor: pointer;
          width: 60px;
          border: 1px solid #fff;
        }
      }
    }

  }
</style>
