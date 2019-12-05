<template>
  <div class="demoVideoS">
    <div class="contain" v-for="(item,index) in playerOptionList" :key="index">
      <KeyMonitor
        class="monitorN"
        :isLive="false"
        :autoplay="true"
        :streamAddr="item['streamAddr']"
        width="100%"
      />
    </div>
  </div>
</template>

<script>
import KeyMonitor from "_c/duno-c/KeyMonitor";
export default {
  name: "demoVideoS",
  components: {
    KeyMonitor
  },
  data() {
    return {
      playerOptionList: [
        {
          streamAddr: "rtmp://10.0.10.46/rtsp196/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp169/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp185/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp150/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp176/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp173/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp178/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp179/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp150/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp171/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp155/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp151/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp159/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp156/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp158/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp157/stream"
        }
      ]
    };
  }
};
</script>

<style lang='scss'>
.demoVideoS {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .contain {
    width: calc(100% / 4);
    @media screen and (min-width: 3500px) {
      width: calc(100% / 8);
    }
  }
}
</style>
