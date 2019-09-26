<template>
  <div class="duno-service">
    <p>Service</p>
    <div class="tabData" :style="{height:height}">
      <div v-for="(item,index) in dataList" :key="index">
        <div class="square">
          <span></span>
          config-service
        </div>
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
  //   height: 100%;
  p {
    text-align: center;
    font-size: 20px;
    color: #fff;
    margin-bottom: 20px;
  }
  .tabData {
    border: 1px solid #414f58;
    overflow-y: auto;

    & > div {
      color: #fff;
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
    }
    .square {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span {
        display: block;
        height: 16px;
        width: 16px;
        border-radius: 5px;
        background-color: #7ed321;
        margin-right: 10px;
      }
    }
  }
}
</style>