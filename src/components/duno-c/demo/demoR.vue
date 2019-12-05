<template>
  <div class="demoVideoR">
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
  name: "demoVideoR",
  components: {
    KeyMonitor
  },
  data() {
    return {
      playerOptionList: [
        {
          streamAddr: "rtmp://10.0.10.46/rtsp147/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp148/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp159/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp151/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp171/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp153/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp196/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp187/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp201/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp150/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp175/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp146/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp209/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp155/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp149/stream"
        },
        {
          streamAddr: "rtmp://10.0.10.46/rtsp153/stream"
        }
      ]
    };
  },
  mounted() {
    let that = this;
    if (that.$route.query.id) {
      let str = that.$route.query.id;
      let arr = str.split(",");
      let obj = {};
      that.playerOptionList = [];
      arr.forEach(el => {
        obj["streamAddr"] = `rtmp://10.0.10.46/rtsp${el}/stream`;
        that.playerOptionList.push(obj);
      });
    }
  }
};
</script>

<style lang='scss'>
.demoVideoR {
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
