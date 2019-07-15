<template>
  <div class="statisticsCom">
    <div class="mapStatistics">
      <img :src="imgSrc" />
    </div>
    <div class="warningStatistics">
      <p class="allWraning" style="margin-bottom:16px">
        月度统计警告
        <span class="warningCount">{{warningList.monthStatistics}}</span>
        条
      </p>
      <div class="warnTtype">
        <div class="circle" v-for="(item, index) in warningList.alarmList" :key="index">
          <div class="typeCircle">{{item.alarmNum}}</div>
          <p>{{item.alarmType}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "statistics",
  data() {
    return {
      imgSrc: "",
      imgAddress: require("@/assets/demo/1000kv.png"),
      imgAddress1: require("@/assets/demo/500kv.png"),
      imgAddress2: require("@/assets/demo/220kv.png"),
      imgAddress3: require("@/assets/demo/110kv.png"),
      imgAddress4: require("@/assets/demo/35.png"),
      routeName: "",
      alarmData: []
    };
  },
  props: {
    warningList: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  watch: {
    $route(to) {
      this.routeName = to.name;
    },
    routeName(now) {
      if (now == "environmental1000KVList") {
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress));
      } else if (now == "environmental500KVList") {
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress1));
      } else if (now == "environmental220KVList") {
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress2));
      } else if (now == "environmental110KVList") {
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress3));
      } else if (now == "environmental35KVList") {
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress4));
      } else if (now == "environmental10KVList") {
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress));
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
      .circle {
        float: left;
        width: 100px;
        .typeCircle {
          margin: 10px auto;
          border-radius: 50%;
          width: 88px;
          height: 88px;
          line-height: 88px;
          text-align: center;
          font-size: 28px;
        }
        p {
          text-align: center;
          font-size: 14px;
        }
      }
    }
    .warningCount {
      font-size: 34px;
      padding-left: 10px;
      padding-right: 10px;
    }
    .warnTtype :nth-child(-n + 3) {
      .typeCircle {
        border: 4px solid #f00;
      }
    }
    .warnTtype :nth-child(n + 4) {
      .typeCircle {
        border: solid 4px #f5a623;
      }
    }
    .warnTtype :nth-child(n + 7) {
      .typeCircle {
        border: solid 4px #5fafff;
      }
    }
  }
}
</style>

