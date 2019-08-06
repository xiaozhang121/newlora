<template>
  <div class="keyMonitor" :style="{width:width}">
    <div
      class="camera"
      :style="{'paddingBottom': paddingBottom}"
      @mouseenter="enter()"
      @mouseleave="leave()"
    >
      <div class="main" id="videoPlayer" :class="{'topStyle': configType == '2'}">
        <video-player
          v-loading="loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          element-loading-text="加载中"
          :class="{'infraredList':routeName == 'infraredList'}"
          v-if="showView"
          ref="videoPlayer"
          class="vjs-custom-skin"
          :options="playerOptions"
          :playsinline="true"
          @play="onPlayerPlay($event)"
          @pause="onPlayerPause($event)"
        ></video-player>
      </div>
      <div v-if="isIniializa" class="Initialization">
        <!--<p>
          点击按钮，完成标定初始化设置
          <span @click="changeinit">初始化</span>
        </p>-->
      </div>
      <transition v-if="isNavbar" name="el-zoom-in-bottom">
        <div v-show="showBtm" class="explain iconList">
          <div class="block">
            <!-- <span class="demonstration">-15s</span>
            <el-slider v-model="value2"></el-slider>
            <span>当前</span>-->
          </div>
          <!-- <span>
            <i class="iconfont icon-luxiang"></i>录像
          </span>-->
          <!-- <span>
            <i class="iconfont icon-jietu"></i>截图
          </span> -->
          <span @click="fullScreen()">
            <i class="iconfont icon-quanping"></i>全屏
          </span>
          <span @click="pushMov()">
            <i class="iconfont icon-tuisong"></i>推送
          </span>
        </div>
      </transition>
      <div v-if="isSecond" class="explain iconList detailIcon">
        <div @click="getJump" class="text">
          <span>{{kilovolt}}</span>
          <span>{{patrol}}</span>
          <i class="iconfont icon-jiantou"></i>
        </div>
        <span @click="fullScreen()">
          <i class="iconfont icon-quanping"></i>
        </span>
      </div>
    </div>
    <push-mov
      ref="pushMov"
      :pic="cameraPic"
      @on-push="onPushReal"
      @on-close="onClose"
      :visible="pushMovVisable"
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
import SWF_URL from "videojs-swf/dist/video-js.swf";
videojs.options.flash.swf = SWF_URL;
export default {
  name: "KeyMonitor",
  components: {
    videoPlayer,
    pushMov
  },
  props: {
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
        return false;
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
      default: "机器人一"
    },
    showBtmOption: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    patrol: {
      type: String,
      default: "正在巡视中"
    },
    isNav: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  watch: {
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
          this.playerOptions["sources"][0]["src"] = now;
          this.monitorSrc = now;
          this.showView = true;
          this.loading = false
          clearTimeout(this.timer)
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
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      timer: null,
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
      //   isChange: true,
      isSecond: false,
      playerOptions: {
        sources: [
          {
            type: "rtmp/flv",
            /* type: "video/ogg",
            type: "video/webm",
            type: "video/mp4",*/
            // src: "rtmp://live.hkstv.hk.lxdns.com/live/hks2"
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
          }
        ],
        fluid: true,
        techOrder: ["flash"],
        autoplay: false,
        controls: true,
        notSupportedMessage: "此视频暂无法播放，请稍后再试"
        /*  poster:
          "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg"*/
      }
    };
  },
  computed: {
    ...mapState(["user"]),
    player() {
      return this.$refs.videoPlayer.player;
    }
  },
  methods: {
    onPlayerPlay(player) {
      //   alert("play");
    },
    onPlayerPause(player) {
      //   alert("pause");
    },
    onPushReal(index) {
      const that = this;
      let query = {
        ["cameraPos0" + index]: this.monitorInfoR["monitorDeviceId"],
        id: this.$store.state.user.configInfo.id
      };
      editConfig(query).then(res => {
        that.$store.state.app.isPush = true
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
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
        if ("pic" in this.monitorInfoR){
            // this.cameraPic = this.monitorInfoR["pic"];
            this.cameraPic = ''
        }
        else {
          this.cameraPic = ''
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
    getJump() {
      getAxiosData("/lenovo-device/api/preset/type", {
        monitorDeviceId: this.monitorInfoR["monitorDeviceId"]
      }).then(res => {
        let supportPreset = res.data["supportPreset"];
        let monitorDeviceType = res.data["monitorDeviceType"];
        if (monitorDeviceType == 1) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailLight",
              query: {
                monitorDeviceId: this.monitorInfoR["monitorDeviceId"]
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailLightN",
              query: {
                monitorDeviceId: this.monitorInfoR["monitorDeviceId"]
              }
            });
          }
        } else if (monitorDeviceType == 2) {
          this.$router.push({
            path: "/surveillancePath/detailRedN",
            query: {
              monitorDeviceId: this.monitorInfoR["monitorDeviceId"]
            }
          });
        } else if (monitorDeviceType == 3) {
          this.$router.push({
            path: "/surveillancePath/detailEnv",
            query: {
              monitorDeviceId: this.monitorInfoR["monitorDeviceId"]
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
    }
  },
  mounted() {
    this.loading = true
    this.timer = setTimeout(()=>{
        this.loading = false
    }, 7000)
    this.isIniializa = this.Initialization;
    this.isNavbar = this.isNav;
  },
  created() {
    this.playerOptions.autoplay = this.autoplay;
    /* if(this.optionWidth && this.optionHeight){
          this.playerOptions.width = this.optionWidth
          this.playerOptions.height = this.optionHeight
      }else{
      }*/
  }
};
</script>

<style lang="scss">
.keyMonitor {
  .topStyle {
    background: black;
    .vjs-big-play-button {
      display: none;
      height: 2.2em !important;
      width: 2em;
      line-height: 2em;
      border-radius: 1em;
      position: absolute;
      top: 0;
      right: 0;
      bottom: -26% !important;
      left: 0;
      margin: auto;
    }
  }
  .infraredList {
  /*  transform: scale(1, 0.75);
    transform-origin: left top;*/
  }
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
      z-index: 0;
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
        span {
          font-size: 12px;
        }
        .el-slider {
          flex: 1;
        }
      }
      .text {
        display: flex;
        justify-content: flex-start;
        span:first-child {
          padding-right: 10px;
          font-size: 14px;
        }
        span:nth-child(2) {
          padding-right: 10px;
          font-size: 12px;
        }
      }
    }
    .detailIcon {
      bottom: -33px;
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
