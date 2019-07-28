<template>
  <div class="realtime">
    <h3 class="title">{{title}}</h3>
    <el-row :gutter="20">
      <el-col :span="monitorDeviceType == 1?24:12" :class="{'lightPanel': monitorDeviceType == 1}">
        <div class="itemImgBox">
          <video-player
            @mousemove.native="pointerPos($event)"
            @mouseout.native="clearTimer()"
            ref="videoPlayer"
            class="vjs-custom-skin realtime_video"
            :options="playerOptiond"
          ></video-player>
        </div>
      </el-col>
      <el-col :span="12" v-if="monitorDeviceType != 1">
        <div class="itemImgBox">
          <video-player
            @mousemove.native="pointerPos($event)"
            @mouseout.native="clearTimer()"
            ref="videoPlayerd"
            class="vjs-custom-skin realtime_video"
            :options="playerOptions"
          ></video-player>
        </div>
      </el-col>
    </el-row>
    <div class="progress">
      <el-progress
        type="circle"
        :percentage="tepmNum"
        :width="80"
        color="#87CEEB"
        :format="format"
      />
      <p>温度℃</p>
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
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";
export default {
  name: "realtimeTem",
  components: { videoPlayer },
  data() {
    return {
      tepmNum: 0,
      timer: null,
      offsetX: null,
      offsetY: null,
      playerOptions: {
        width: 160,
        height: 120,
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
        width: 160,
        height: 120,
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
    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.tepmNum = 0;
    },
    pointerPos(event) {
      const that = this;
      // console.log('x:'+event.offsetX)
      // console.log('y:'+event.offsetY)
      that.offsetX = event.offsetX;
      that.offsetY = event.offsetY;
      if (!this.timer) {
        this.timer = setInterval(() => {
          getAxiosData(
            "/lenovo-iir/device/temperature/get/probe/" + this.deviceId,
            { x: that.offsetX, y: 118 - that.offsetY, r: 1 }
          ).then(res => {
            // console.log('data:'+res.data)
            that.tepmNum = res.data / 1000;
          });
        }, 200);
      }
    },
    format(percentage) {
      percentage = percentage ? percentage : 0;
      return `${percentage}`;
    },
    initCamera() {
      const that = this;
      const url = "/lenovo-iir/device/video/url/rtmp/" + that.deviceId;
      getAxiosData(url, {}).then(res => {
        that.playerOptions.sources[0].src = res.data.data;
        that.$forceUpdate();
      });
      const urld = "/lenovo-iir/device/visible/url/rtmp/" + that.deviceId;
      getAxiosData(urld, {}).then(res => {
        that.playerOptiond.sources[0].src = res.data.data;
        that.$forceUpdate();
      });
    }
  },
  created() {
    this.initCamera();
  },
  mounted() {
    if (this.classifyData && this.isClassify) {
      console.log("初始化加载：", this.classifyData, "相");
    }
    getAxiosData("/lenovo-iir/device/video/isplaying/" + this.deviceId).then(
      res => {
        let isPlay = res.data.data;
        if (isPlay) {
          return;
        } else {
          putAxiosData("/lenovo-iir/device/video/play/" + this.deviceId);
        }
      }
    );
  }
  //关闭视频接口
  // destroyed() {
  //   putAxiosData("/lenovo-iir/device/video/stop/" + this.deviceId);
  // }
};
</script>
<style lang="scss">
.realtime_video > div {
  transform: scale(1.355, 1.2);
  transform-origin: left top;
}
.el-progress__text {
  color: white;
}
</style>
<style lang="scss">
.realtime {
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
    p {
      font-size: 16px !important;
    }
  }
}
</style>
