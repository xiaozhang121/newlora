<template>
  <div>
    <allReport :dataBread="dataBread" :downloadURL="downloadURL" :selectUrl="selectUrl" />
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
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/meterdata/list", name: "所有报表" },
        { path: "/meterdata/list", name: "表计分析" },
        { path: "", name: "所有表计分析" }
      ],
      downloadURL: "/lenovo-plan/api/statistics/meter-data/list/downLoad",
      selectUrl: "/lenovo-device/api/statistics/meter-data/select-list"
    };
  },
  methods: {}
};
</script>

<style lang="scss">
</style>


