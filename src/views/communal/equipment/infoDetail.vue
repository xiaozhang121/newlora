<template>
  <div>
    <patrolDetail :dataBread="dataBread" :downloadURL="downloadURL" />
  </div>
</template>

<script>
import patrolDetail from "_c/duno-c/patrolDetail";
export default {
  components: {
    patrolDetail
  },
  data() {
    return {
      dataBread: [],
      downloadURL: ""
    };
  },
  methods: {
    handleroute() {
      let name = this.$route.name;
      switch (name) {
        case "light-info":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/visiblelight/list", name: "设备监测" },
            { path: "/visiblelight/list", name: "可见光" },
            { path: "", name: "可见光巡检报告" }
          ];
          this.downloadURL = "/lenovo-plan/api/plan/visible-report/downLoad";
          break;
        case "infrared-info":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/infrared/list", name: "设备监测" },
            { path: "/infrared/list", name: "红外监测" },
            { path: "", name: "红外监测巡检报告" }
          ];
          this.downloadURL = "/lenovo-plan/api/plan/iir-report/downLoad";
          break;
      }
    }
  },
  mounted() {
    console.log(this.$route.name);
    this.handleroute();
  }
};
</script>

<style lang="scss">
</style>