<template>
  <div>
    <allReport
      :dataBread="dataBread"
      :monitorDeviceType="monitorDeviceType"
      :downloadURL="downloadURL"
      :selectUrl="selectUrl"
      :position="position"
    />
  </div>
</template>

<script>
import allReport from "_c/duno-c/allReport";
export default {
  components: {
    allReport
  },
  data() {
    return {
      dataBread: [],
      downloadURL: "",
      selectUrl: "",
      monitorDeviceType: "",
      position: ""
    };
  },
  methods: {
    handleroute() {
      let name = this.$route.name;
      switch (name) {
        case "light-detail":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/visiblelight/list", name: "设备监测" },
            { path: "/visiblelight/list", name: "可见光监测" },
            { path: "", name: "可见光监测记录信息" }
          ];
          this.downloadURL = "/lenovo-plan/api/task/result/list/downLoad";
          this.selectUrl = "/lenovo-device/api/power/monitor";
          this.monitorDeviceType = "1";
          this.position = "2";
          break;
        case "infrared-detail":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/infrared/list", name: "设备监测" },
            { path: "/infrared/list", name: "红外监测" },
            { path: "", name: "红外监测记录信息" }
          ];
          this.downloadURL = "/lenovo-plan/api/task/result/list/downLoad";
          this.selectUrl = "/lenovo-device/api/power/monitor";
          this.monitorDeviceType = "2";
          this.position = "2";
          break;
        case "overview-detail":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/overview/list", name: "设备监测" },
            { path: "/overview/list", name: "信息总览" },
            { path: "", name: "信息总览记录信息" }
          ];
          this.downloadURL =
            "/lenovo-plan/api/information/overview/result/one/day/export";
          this.selectUrl = "/lenovo-device/api/power/monitor";
          this.position = "1";
          break;
      }
    }
  },
  created() {
    this.handleroute();
  }
};
</script>

<style lang="scss">
</style>


