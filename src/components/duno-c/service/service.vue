<template>
  <div class="duno-service">
    <p>Service</p>
    <div class="tabData" :style="{height:height}">
      <div class="square" v-for="(item,index) in dataList" :key="index">
        <!-- <div class="square"> -->
        <span></span>
        config-service
        <!-- </div> -->
        <div>2 passing</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "service",
  props: {
    height: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      dataList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    };
  }
};
</script>
<style lang="scss">
.duno-service {
  padding: 0 50px 0 30px;
  p {
    text-align: center;
    font-size: 20px;
    color: #fff;
    margin-bottom: 20px;
  }
  .tabData {
    overflow-y: auto;
    & > div {
      color: #fff;
      display: flex;
      justify-content: space-around;
      padding: 10px 20px;
    }
    & > div:nth-child(odd) {
      background-color: #203e52;
    }
    .square {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        display: block;
        height: 14px;
        width: 14px;
        border-radius: 50%;
        background-color: #7ed321;
        margin-right: 10px;
      }
    }
  }
}
</style>
