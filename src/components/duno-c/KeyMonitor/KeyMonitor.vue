<template>
  <div class="keyMonitor" :style="{width:width}">
    <div
      class="camera"
      :style="{'paddingBottom': paddingBottom}"
      @mouseenter="enter()"
      @mouseleave="leave()"
    >
      <div class="main" id="videoPlayer">
        <video-player v-if="showView" ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
      </div>
      <transition name="el-zoom-in-bottom">
        <div v-show="showBtm" class="explain iconList">
          <div class="block">
            <!-- <span class="demonstration">-15s</span>
            <el-slider v-model="value2"></el-slider>
            <span>当前</span>-->
          </div>
          <span>
            <i class="iconfont icon-luxiang"></i>录像
          </span>
          <span>
            <i class="iconfont icon-jietu"></i>截图
          </span>
          <span @click="fullScreen()">
            <i class="iconfont icon-quanping"></i>全屏
          </span>
          <span @click="pushMov()">
            <i class="iconfont icon-tuisong"></i>推送
          </span>
        </div>
      </transition>
      <div v-if="isSecond" class="explain iconList detailIcon">
        <div class="text">
          <span>{{kilovolt}}</span>
          <span>{{patrol}}</span>
          <i class="iconfont icon-jiantou"></i>
        </div>
        <span @click="fullScreen()">
          <i class="iconfont icon-quanping"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";
import { setTimeout } from "timers";
export default {
  name: "KeyMonitor",
  components: {
    videoPlayer
  },
  props: {
    monitorInfo:{
        type: Array,
        default () {
            return []
        }
    },
    streamAddr:{
        type: String,
        default: ''
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
    }
  },
  watch: {
    streamAddr(now){
        this.playerOptions['sources'][0]['src'] = now
        if(now){
            this.showView = true
        }
    },
    showBtmOption: {
      handler(now) {
        this.isSecond = now;
      },
      immediate: true
    }
  },
  data() {
    return {
      showView: false,
      value2: 15,
      showBtm: false,
      isSecond: false,
      playerOptions: {
        sources: [
          {
            type: "rtmp/flv",
            src: "rtmp://live.hkstv.hk.lxdns.com/live/hks2"
          }
        ],
        fluid: true,
        techOrder: ["flash"],
        autoplay: true,
        controls: true
      }
    };
  },
  methods: {
    pushMov() {
      this.$emit("on-push", this.monitorInfo);
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
    }
  },
  created() {
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
  .video-player.vjs-custom-skin {
    width: 100%;
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
    .detailIcon{
      bottom: -33px;
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
}
</style>
