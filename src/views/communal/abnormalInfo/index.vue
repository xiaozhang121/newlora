<template>
  <div class="abnormalInfo">
    列表
  </div>
</template>

<script>
import dunoBtnTop  from '_c/duno-m/duno-btn-top'
import KeyMonitor from '_c/duno-c/KeyMonitor'
export default {
  name: "abnormalInfo",
  components: {
      dunoBtnTop,
      KeyMonitor
  },
  data() {
    return {

    }
  },
  methods:{
      onSelect(item, index){
          this.layoutType = item['describeName']
      }
  }
};
</script>

<style lang="scss">
.abnormalInfo {
  width: 100%;
  .dunoBtnTop{
    width: 134px;
    display: inline-flex;
    padding-bottom: 0;
    .btnList{
      top: inherit !important;
      width: 134px;
      .title{
        font-size: 15px;
      }
    }
  }
}
</style>
