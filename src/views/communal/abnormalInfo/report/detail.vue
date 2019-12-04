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
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/taskForm", name: "报表" },
        { path: "", name: `${this.$route.query.planName} ${this.$route.query.executeTime.substring(0,10)}` }
      ],
      downloadURL: "/lenovo-plan/api/statistics/plan/download"
    };
  },
  methods: {}

};
</script>

<style lang="scss">
</style>


