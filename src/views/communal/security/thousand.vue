<template>
  <div class="thousand">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div>1000千伏安防警告</div>
    <div class="number"></div>
    <div class="thRecord">
      <HisRecords />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import HisRecords from "_c/duno-c/HisRecords";
export default {
  name: "thousand",
  components: {
    Breadcrumb,
    HisRecords
  },
  data() {
    return {
      dataBread: {
        "/": "操作中台",
        "/environmental": "安防监测",
        "/environmental/list": "1000千伏"
      }
    };
  }
};
</script>

<style lang="scss">
.thousand {
  & > div:nth-child(2) {
    font-size: 22px;
    line-height: 60px;
    color: #ffffff;
  }
  .number {
    height: 311px;
    background-color: #142838;
  }
  .thRecord{
      margin-top: 20px;
  }
}
</style>

