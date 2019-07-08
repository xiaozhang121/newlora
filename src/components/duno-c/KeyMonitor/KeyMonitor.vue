<template>
  <div class="keyMonitor" :style="{width:width}">
    <div class="camera" @mouseenter="enter()" @mouseleave="leave()">
      <div class="main" id="videoPlayer">
        <video-player ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
      </div>
      <transition name="el-zoom-in-bottom">
        <div v-show="showBtm" v-if="isSecond" class="explain iconList">
          <div class="block">
            <span class="demonstration">-15s</span>
            <el-slider v-model="value2"></el-slider>
            <span>当前</span>
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
          <span>
            <i class="iconfont icon-tuisong"></i>推送
          </span>
        </div>
        <div v-show="showBtm" v-else class="explain iconList">
          <div class="text">
            <span>{{kilovolt}}</span>
            <span>{{patrol}}</span>
            <i class="iconfont icon-jiantou"></i>
          </div>
          <span @click="fullScreen()">
            <i class="iconfont icon-quanping"></i>
          </span>
        </div>
      </transition>
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
    width: {
      type: String,
      default: "50%"
    },
    kilovolt: {
      type: String,
      default: "机器人一"
    },
    patrol: {
      type: String,
      default: "正在巡视中"
    }
  },
  data() {
    return {
      paddingBottom: "",
      value2: 15,
      showBtm: false,
      isSecond: false,
      playerOptions: {
        // width: "100%",
        sources: [
          {
            type: "rtmp/flv",
            src: "rtmp://live.hkstv.hk.lxdns.com/live/hks2"
          }
        ],
        aspectRatio: "16:9",
        techOrder: ["flash"],
        autoplay: true,
        controls: true
      }
    };
  },
  methods: {
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
  }
};
</script>

<style lang="scss">
.keyMonitor {
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
      bottom: -2px;
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
        span:nth-child(2){
          padding-right: 10px;
          font-size: 12px;
        }
      }
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
