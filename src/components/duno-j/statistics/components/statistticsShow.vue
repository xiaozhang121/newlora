<template>
  <div class="statisticsCom">
    <div class="mapStatistics"></div>
    <div class="warningStatistics">
      <p class="allWraning" style="margin-bottom:16px">
        月度统计警告
        <span class="warningCount">{{allWarningCount}}</span>
        条
      </p>
      <div class="warnTtype">
        <type-statistics v-for="(item, index) in warningList" :key="index" :oneTypeInfo="item" />
      </div>
    </div>
  </div>
</template>
<script>
import typeStatistics from "./typeStatistics";
export default {
  components: {
    typeStatistics
  },
  data() {
    return {};
  },
  props: {
    allWarningCount: {
      type: Number
    },
    warningList: {
      type: Array
    }
  }
};
</script>
<style lang="scss">
.statisticsCom {
  height: 100%;
  overflow: hidden;
  color: #fff;
  .mapStatistics {
    width: 30%;
    height: 270px;
    float: left;
    background-color: #000;
  }
  .warningStatistics {
    width: 70%;
    float: left;
    padding: 10px 26px;
    & > p {
      padding-left: 15px;
    }
    .warnTtype {
      margin-top: 20px;
      overflow: hidden;
    }
    .warningCount {
      font-size: 20px;
    }
    .warnTtype :nth-child(-n + 3) {
      .typeStatisticsCircle {
        border: 4px solid #f00;
      }
    }
    .warnTtype :nth-child(n + 4) {
      .typeStatisticsCircle {
        border: solid 4px #f5a623;
      }
    }
    .warnTtype :nth-child(n + 7) {
      .typeStatisticsCircle {
        border: solid 4px #5fafff;
      }
    }
  }
}
</style>

