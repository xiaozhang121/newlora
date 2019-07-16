<template>
  <div class="securityNum">
    <div class="breadcrumb">
      <Breadcrumb :dataList="titleData.navBar" />
    </div>
    <div>{{titleData.title}}</div>
    <div class="number">
      <statistics :warningList="circleData" />
    </div>
    <div class="thRecord">
      <PageHisRecords :areaId="areaId" :titleCode="titleData.securityRecord" />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import PageHisRecords from "_c/duno-c/PageHisRecords";
import statistics from "_c/duno-j/statistics";
import { getAreaList, circleMonth } from "@/api/configuration/configuration.js";
import { mapState } from "vuex";
import { async } from "q";
export default {
  name: "securityNum",
  components: {
    Breadcrumb,
    PageHisRecords,
    statistics
  },
  data() {
    return {
      dataBread: [],
      areaData: [],
      deviceList: [],
      circleData: {},
      areaId: null,
      areaName: "",
      selectAreaId: [],
      routeName: "",
      titleData: {}
    };
  },
  watch: {
    $route(to) {
      this.routeName = to.name;
    },
    routeName(now) {
      this.getAreaData();
      this.getRouteName(now);
    }
  },
  methods: {
    getRouteName(now) {
      switch (now) {
        case "environmental1000KVList":
          this.titleData = {
            title: "1000千伏安防警告",
            securityRecord: "1000千伏安防记录",
            navBar: ["操作中台", "动态环境监测", "1000千伏"]
          };
          break;
        case "environmental500KVList":
          this.titleData = {
            title: "500千伏安防警告",
            securityRecord: "500千伏安防记录",
            navBar: ["操作中台", "动态环境监测", "500千伏"]
          };
          break;
        case "environmental220KVList":
          this.titleData = {
            title: "220千伏安防警告",
            securityRecord: "220千伏安防记录",
            navBar: ["操作中台", "动态环境监测", "220千伏"]
          };
          break;
        case "environmental110KVList":
          this.titleData = {
            title: "110千伏安防警告",
            securityRecord: "110千伏安防记录",
            navBar: ["操作中台", "动态环境监测", "110千伏"]
          };
          break;
        case "environmental35KVList":
          this.titleData = {
            title: "35千伏安防警告",
            securityRecord: "35千伏安防记录",
            navBar: ["操作中台", "动态环境监测", "350千伏"]
          };
          break;
        case "environmental10KVList":
          this.titleData = {
            title: "10千伏安防警告",
            securityRecord: "10千伏安防记录",
            navBar: ["操作中台", "动态环境监测", "10千伏"]
          };
          break;
        default:
      }
    },
    getAreaData() {
      let that = this;
      getAreaList().then(res => {
        that.areaData = res.data.areaList;
        switch (that.routeName) {
          case "environmental1000KVList":
            that.areaId = res.data.areaList[0].areaId;
            break;
          case "environmental500KVList":
            that.areaId = res.data.areaList[1].areaId;
            break;
          case "environmental220KVList":
            that.areaId = res.data.areaList[2].areaId;
            break;
          case "environmental110KVList":
            that.areaId = res.data.areaList[3].areaId;
            break;
          case "environmental35KVList":
            that.areaId = res.data.areaList[4].areaId;
            break;
          case "environmental10KVList":
            that.areaId = res.data.areaList[5].areaId;
            break;
          default:
        }
        circleMonth({ areaId: that.areaId }).then(res => {
          that.circleData = res.data;
        });
      });
    }
  },
  mounted() {
    this.routeName = this.$route.name;
    this.getAreaData();
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

