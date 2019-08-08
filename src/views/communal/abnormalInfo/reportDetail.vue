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
        case "abnormalInfoList-report":
          this.dataBread = [
            { path: "/abnormalInfoPath/home", name: "功能卡片" },
            { path: "/abnormalInfoPath/home", name: "报表" },
            { path: "", name: "报表详情" },
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


