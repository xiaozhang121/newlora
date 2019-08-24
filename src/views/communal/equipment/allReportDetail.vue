<template>
  <div>
    <allReport
      :dataBread="dataBread"
      :monitorDeviceType="monitorDeviceType"
      :downloadURL="downloadURL"
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
      monitorDeviceType: ""
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
            { path: "/visiblelight/list", name: "可见光" },
            { path: "", name: "可见光监测记录信息" }
          ];
          this.downloadURL = "/lenovo-plan/api/task/result/list/downLoad";
          this.monitorDeviceType = "1";
          break;
        case "infrared-detail":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/infrared/list", name: "设备监测" },
            { path: "/infrared/list", name: "红外监测" },
            { path: "", name: "红外监测记录信息" }
          ];
          this.downloadURL = "/lenovo-plan/api/task/result/list/downLoad";
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


