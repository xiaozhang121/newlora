<template>
  <div class="statisticsCom">
    <div class="mapStatistics">
      <img :src="imgSrc" />
    </div>
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
    return {
      imgSrc:'',
      imgAddress: require("@/assets/demo/1000kv.png"),
      imgAddress1: require("@/assets/demo/500kv.png"),
      imgAddress2: require("@/assets/demo/220kv.png"),
      imgAddress3: require("@/assets/demo/110kv.png"),
      imgAddress4: require("@/assets/demo/35.png"),
      routeName: ""
    };
  },
  props: {
    allWarningCount: {
      type: Number
    },
    warningList: {
      type: Array
    },
    img: {
      type: String
    }
  },
  watch: {
    $route(to) {
      this.routeName = to.name;
    },
    routeName(now){
      if(now =='environmental1000KVList'){
        this.imgSrc= JSON.parse(JSON.stringify(this.imgAddress))
      }else if(now =='environmental500KVList'){
        this.imgSrc= JSON.parse(JSON.stringify(this.imgAddress1))
      }else if(now =='environmental220KVList'){
        this.imgSrc= JSON.parse(JSON.stringify(this.imgAddress2))
      }else if(now =='environmental110KVList'){
        this.imgSrc= JSON.parse(JSON.stringify(this.imgAddress3))
      }else if(now =='environmental35KVList'){
        this.imgSrc= JSON.parse(JSON.stringify(this.imgAddress4))
      }else if(now =='environmental10KVList'){
        this.imgSrc= JSON.parse(JSON.stringify(this.imgAddress))
      }
    }
  },
  mounted() {
    this.routeName = this.$route.name;
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
    img {
      width: 100%;
      display: block;
    }
  }
  .warningStatistics {
    width: 70%;
    float: left;
    padding-left: 30px;
    & > p {
      padding-left: 15px;
    }
    .warnTtype {
      margin-top: 40px;
      overflow: hidden;
      & > div {
        margin-right: 10px;
      }
    }
    .warningCount {
      font-size: 34px;
      padding-left: 10px;
      padding-right: 10px;
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

