<template>
  <div>
    <analysisDetail :dataBread="dataBread" :downloadURL="downloadURL" />
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
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/report/list", name: "所有报表" },
        { path: "/report/list", name: "巡检任务报表" },
        { path: "", name: "查看报告" }
      ],
      downloadURL: "/lenovo-plan/api/statistics/plan/download"
    };
  },
  methods: {}
};
</script>

<style lang="scss">
</style>


