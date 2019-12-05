<template>
  <div class="demoVideo">
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
  name: "demoVideo",
  components: {
    KeyMonitor
  },
  data() {
    return {
      playerOptionList: [
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_1"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_2"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_3"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_4"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_5"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_6"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_7"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_8"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_9"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_10"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_11"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_12"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_13"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_14"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_15"
        },
        {
          streamAddr: "rtmp://10.0.10.37:10935/hls/stream_16"
        }
      ]
    };
  },
  mounted() {
    let that = this;
    if (that.$route.query.id) {
      let str = that.$route.query.id;
      let ip = that.$route.query.ip ? that.$route.query.ip : 46;
      let arr = str.split(",");
      that.playerOptionList = [];
      arr.forEach(el => {
        that.playerOptionList.push({
          streamAddr: `rtmp://10.0.10.${ip}/rtsp${el}/stream`
        });
      });
      console.log(that.playerOptionList);
    }
  }
};
</script>

<style lang='scss'>
.demoVideo {
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
