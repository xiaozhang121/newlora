<template>
  <div class="detailUbiquitou">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="topTitle">泛在盒子</div>
    <div class="video">
      <div class="contain">
        <key-monitor
          :monitorInfo="{ monitorDeviceId: dataForm.monitorDeviceId }"
          paddingBottom="56%"
          class="monitor"
          :autoplay="playerOptions.autoplay"
          :streamAddr="playerOptions.streamAddr"
          :showBtmOption="false"
          :Initialization="true"
        ></key-monitor>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
import moment from "moment";
export default {
  name: "detailUbiquitou",
  components: {
    Breadcrumb,
    KeyMonitor
  },
  data() {
    return {
      dataBread: [{ name: "摄像头详情" }]
    };
  }
};
</script>

<style lang='scss'>
.detailUbiquitou {
  .topTitle {
    margin-top: 10px;
    color: #fff;
    font-size: 18px;
  }
}
</style>
