<template>
  <div class="duno-progress">
    <div>{{dataList.name}}</div>
    <div :style="{background:dataList.color,flex:dataList.flex}"></div>
    <div>{{dataList.num}}张</div>
  </div>
</template>

<script>
export default {
  name: "progressD",
  props: {
    dataList: {
      type: Object,
      default: () => {
        return {};
      }
    },
    background: {
      type: String,
      default: () => {
        return "#fff";
      }
    }
  }
};
</script>

<style lang='scss'>
.duno-progress {
  display: flex;
  justify-content: flex-start;
  line-height: 18px;
  color: #fff;
  margin-bottom: 20px;
  & > div:first-child {
    text-align: right;
    width: 90px;
    color: #aaaaaa;
  }
  & > div:nth-child(2) {
    margin: 0 20px;
  }
}
</style>
