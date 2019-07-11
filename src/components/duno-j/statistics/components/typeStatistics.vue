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
    },
  }
};
</script>
<style lang="scss">
.typeStatisticsCircle {
  margin: 10px auto;
  border-radius: 50%;
  width: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 28px;
}
</style>
