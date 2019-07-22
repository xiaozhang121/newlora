<template>
  <div class="statisticsCom">
    <div class="mapStatistics">
      <gis-map
        ref="gisMapObj"
        :small="true"
        :isDiagram="3"
        :deviceList="deviceList"
        fillColor="#0f1b21"
        :zoom="13"
        :minZoom="13"
        :kind="mapKind"
        :controlBtn="false"
      />
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
import gisMap from "_c/duno-m/gisMap";
import mixinViewModule from "@/mixins/view-module";
import { deviceLocation } from "@/api/currency/currency.js";
export default {
  mixins: [mixinViewModule],
  name: "statistics",
  components: {
    gisMap
  },
  data() {
    return {
      deviceList: [],
      tempDeviceList: [],
      mapKind: 0,
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
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    mapKind(now) {
      this.initPoint();
    },
    $route(to) {
      this.routeName = to.name;
    },
    routeName(now) {
      if (now == "environmental1000KVList") {
        this.mapKind = 1000;
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress));
      } else if (now == "environmental500KVList") {
        this.mapKind = 500;
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress1));
      } else if (now == "environmental220KVList") {
        this.mapKind = 220;
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress2));
      } else if (now == "environmental110KVList") {
        this.mapKind = 110;
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress3));
      } else if (now == "environmental35KVList") {
        this.mapKind = 35;
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress4));
      } else if (now == "environmental10KVList") {
        this.mapKind = 10;
        this.imgSrc = JSON.parse(JSON.stringify(this.imgAddress));
      }
    }
  },
  methods: {
    initPoint() {
      let now = this.mapKind;
      if (now == 1000) {
        this.filterPoint("1");
      } else if (now == 500) {
        this.filterPoint("2");
      } else if (now == 220) {
        this.filterPoint("3");
      } else if (now == 110) {
        this.filterPoint("4");
      } else if (now == 35) {
        this.filterPoint("5");
      } else if (now == 10) {
        this.filterPoint("6");
      }
    },
    filterPoint(areaId) {
      let data = JSON.parse(JSON.stringify(this.tempDeviceList));
      if (this.tempDeviceList) {
        data.map(item => {
          if (item["areaId"] == areaId) {
            item["show"] = true;
          } else {
            item["show"] = false;
          }
        });
        this.deviceList = data;
      }
      this.$forceUpdate();
    },
    getDeviceList() {
      const that = this;
      deviceLocation().then(res => {
        let data = res.data;
        data.map(item => {
          if (
            item["monitorDeviceType"] == 1 ||
            item["monitorDeviceType"] == 99
          ) {
            if (item.deviceMessage.supportPreset) {
              item["src"] = that.light;
            } else {
              item["src"] = that.lightNoCamera;
            }
          } else if (item["monitorDeviceType"] == 2) {
            item["src"] = that.redLight;
          }
          item["show"] = true;
          item["isShow"] = true;
        });
        that.deviceList = data;
        that.tempDeviceList = data;
        that.initPoint();
      });
    }
  },
  created() {
    this.getDeviceList();
  },
  mounted() {
    try{
    document
      .querySelector("#map")
      .setAttribute("style", "height:100% !important");
    }catch (e) {
    }
   this.routeName = this.$route.name;
  },
  beforeDestroy() {
    try{
    document
      .querySelector("#map")
      .setAttribute("style", "height:calc( 100vh - 166px) !important");
    }catch (e) {}
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
    background-color: #0f1b21;
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
      max-width: 980px;
      display: flex;
      flex-wrap: wrap;
      &>div:first-child{
          margin-left: 0;
      }
      & > div {
        margin-left: 10px;
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

