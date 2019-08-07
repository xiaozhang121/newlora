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
        case "meterdata-detail":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/meterdata/list", name: "所有报表" },
            { path: "/meterdata/list", name: "表计分析" },
            { path: "", name: "所有表计分析" }
          ];
          break;
        case "report-view":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/report/list", name: "所有报表" },
            { path: "/report/list", name: "巡检任务报表" },
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


