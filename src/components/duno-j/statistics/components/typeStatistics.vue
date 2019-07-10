<template>
  <div style="float: left;width:100px">
    <div
      class="typeStatisticsCircle"
      
    >{{oneTypeInfo.count}}</div>
    <p style="text-align: center;font-size: 14px">{{oneTypeInfo.msg}}</p>
  </div>
</template>
<script>
export default {
  props: {
    oneTypeInfo: {
      type: Object
    }
    // :style="'border-color:'+oneTypeInfo.type"
  }
};
</script>
<style lang="scss">
.typeStatisticsCircle {
  margin: 10px auto;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 24px;
}
</style>
