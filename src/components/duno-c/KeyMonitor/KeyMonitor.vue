<template>
  <div class="keyMonitor" :style="{width:width}">
    <div class="camera">
      <div class="main" id="videoPlayer">
        <video-player ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
      </div>
      <div class="explain iconList">
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
    </div>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";
export default {
  name: "KeyMonitor",
  components: {
    videoPlayer
  },
  props: {
    width: {
      type: String,
      default: "50%"
    }
  },
  data() {
    return {
      paddingBottom: "",
      value2: 15,
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
    .vjs-custom-skin {
      //   transform: scale(0.6);
      //   transform-origin: left top;
      //   position: relative;
    }
    .main {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .iconList {
      position: absolute;
      //   top: 187px;
      bottom: -1px;
      display: flex;
      justify-content: flex-start;
      line-height: 32px !important;
      background-color: #142838;
      font-size: 12px;
      padding-left: 10px;
      padding-right: 10px;
      width: 100%;
      z-index: 99;
      span {
        display: flex;
        margin-right: 15px;
        flex: none !important;
        align-items: center;
        text-align: right !important;
      }
      i {
        font-size: 15px;
        margin-right: 5px;
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
        // display: inline-block;
        // span{
        //   font-size: 12px;
        // }
        .el-slider {
        }
      }
    }
  }
}
</style>
