<template>
  <div>
    <patrolDetail :dataBread="dataBread" :url="url" />
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
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/configuration/list", name: "任务配置" },
        { path: "", name: "查看报表" }
      ],
      url: "/lenovo-plan/api/statistics/plan/download"
    };
  },
  methods: {}
};
</script>

<style lang="scss">
</style>