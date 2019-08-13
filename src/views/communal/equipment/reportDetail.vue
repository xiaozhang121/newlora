<template>
  <div>
    <analysisDetail
      :dataBread="dataBread"
      :monitorDeviceType="monitorDeviceType"
      :downloadURL="downloadURL"
    />
  </div>
</template>

<script>
import analysisDetail from "_c/duno-c/analysisDetail";
export default {
  components: {
    analysisDetail
  },
  data() {
    return {
      dataBread: [],
      downloadURL: "",
      monitorDeviceType: ""
    };
  },
  methods: {
    handleroute() {
      let name = this.$route.name;
      switch (name) {
        case "light-report":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/visiblelight/list", name: "设备监测" },
            { path: "/visiblelight/list", name: "可见光" },
            { path: "", name: "可见光监测记录信息" }
          ];
          this.downloadURL = "/lenovo-plan/api/plan/visible-report/download";
          this.monitorDeviceType = "1";
          break;
        case "infrared-report":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/infrared/list", name: "设备监测" },
            { path: "/infrared/list", name: "红外监测" },
            { path: "", name: "红外监测记录信息" }
          ];
          this.downloadURL = "/lenovo-plan/api/plan/iir-report/download";
          this.monitorDeviceType = "2";
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


