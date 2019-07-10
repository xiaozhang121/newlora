<template>
  <div class="securityNum">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div>{{title}}</div>
    <div class="number">
      <statistics />
    </div>
    <div class="thRecord">
      <PageHisRecords />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import PageHisRecords from "_c/duno-c/PageHisRecords";
import statistics from "_c/duno-j/statistics";
export default {
  name: "securityNum",
  components: {
    Breadcrumb,
    PageHisRecords,
    statistics
  },
  props: {
    title: {
      type: String,
      default: "1000千伏安防警告"
    }
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
.securityNum {
  & > div:nth-child(2) {
    font-size: 22px;
    line-height: 60px;
    color: #ffffff;
  }
  .number {
    height: 310px;
    padding: 20px;
    background-color: #142838;
    & > div {
      height: 100%;
    }
  }
  .thRecord {
    margin-top: 20px;
  }
}
</style>

