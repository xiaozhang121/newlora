<template>
  <div>
    <analysisDetail :downloadURL="downloadURL" :dataBread="dataBread" />
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
            { path: "/configuration/list", name: "任务配置" },
            { path: `/configuration/configure-report?planId=${this.$route.query.planId}&planType=${this.$route.query.planType}`, name: `${this.$route.query.planType}任务详情` },
            { path: "", name: "查看报告" }
          ];
          this.downloadURL = "/lenovo-plan/api/statistics/plan/download";
          break;
        case "detection-report":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/detection/list", name: "任务配置" },
            { path: "", name: "查看报告" }
          ];
          this.downloadURL = "/lenovo-plan/api/statistics/plan/download";
          break;
      }
    }
  },
  created(){
    console.log(this.$route.name);
    this.handleroute();
  },
  mounted() {

  }
};
</script>

<style lang="scss">
</style>


