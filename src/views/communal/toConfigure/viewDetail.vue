<template>
  <div>
    <analysisDetail :dataBread="dataBread" />
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
      dataBread: []
    };
  },
  methods: {
    handleroute() {
      let name = this.$route.name;
      switch (name) {
        case "configure-view":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/configuration/list", name: "配置管理" },
            { path: "/configuration/list", name: "任务配置" },
            { path: "", name: "查看报告" }
          ];
          break;
        case "detection-report":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/detection/list", name: "配置管理" },
            { path: "/detection/list", name: "任务配置" },
            { path: "", name: "查看报告" }
          ];
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


