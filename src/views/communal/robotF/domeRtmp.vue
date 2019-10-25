<template>
  <div class="domeRtmp">
    <div>
      <KeyMonitor
        class="keyMonitor"
        :autoplay="true"
        :pushCamera="false"
        streamAddr="rtmp://10.0.10.39/rtsp91/stream"
      />
    </div>
    <div>
      <KeyMonitor
        class="keyMonitor"
        :autoplay="true"
        :pushCamera="false"
        streamAddr="rtmp://10.0.10.39/rtsp91/stream"
      />
    </div>
  </div>
</template>

<script>
import KeyMonitor from "_c/duno-c/KeyMonitor";
export default {
  name: "domeRtmp",
  components: {
    KeyMonitor
  },
};
</script>

<style>
</style>