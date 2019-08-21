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
      dataBread: [],
      url: ""
    };
  },
  methods: {
    handleroute() {
      let name = this.$route.name;
      switch (name) {
        case "configure-report":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/configuration/list", name: "配置管理" },
            { path: "/configuration/list", name: "任务配置" },
            { path: "", name: "查看报表" }
          ];
          break;
        case "infrared-info":
          this.dataBread = [
            { path: "/realEnv/list", name: "操作中台" },
            { path: "/configuration/list", name: "配置管理" },
            { path: "/configuration/list", name: "任务配置" },
            { path: "", name: "查看报表" }
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