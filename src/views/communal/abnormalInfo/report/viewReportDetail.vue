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
        { path: "", name: "所有记录" }
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


