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
      <PageHisRecords :titleCode="titleData.securityRecord" />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import PageHisRecords from "_c/duno-c/PageHisRecords";
import statistics from "_c/duno-j/statistics";
import { getAxiosData } from "@/api/axiosType";
import { mapState } from "vuex";
import { type } from "os";
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
      titleCode: "",
      deviceList: [],
      circleData: [],
      areaId: "",
      routeName: "",
      titleData: {}
    };
  },
  watch: {
    $route(to) {
      this.routeName = to.name;
    },
    routeName(now) {
      switch (now) {
        case "environmental1000KVList":
          this.areaId = "1";
          this.titleData = {
            title: "1000千伏安防警告",
            securityRecord: "1000千伏安防记录",
            navBar: ["操作中台", "安防监测", "1000千伏"]
          };
          break;
        case "environmental500KVList":
          this.areaId = "2";
          this.titleData = {
            title: "500千伏安防警告",
            securityRecord: "500千伏安防记录",
            navBar: ["操作中台", "安防监测", "500千伏"]
          };
          break;
        case "environmental220KVList":
          this.areaId = "3";
          this.titleData = {
            title: "220千伏安防警告",
            securityRecord: "220千伏安防记录",
            navBar: ["操作中台", "安防监测", "220千伏"]
          };
          break;
        case "environmental110KVList":
          this.areaId = "4";
          this.titleData = {
            title: "110千伏安防警告",
            securityRecord: "110千伏安防记录",
            navBar: ["操作中台", "安防监测", "110千伏"]
          };
          break;
        case "environmental35KVList":
          this.areaId = "5";
          this.titleData = {
            title: "35千伏安防警告",
            securityRecord: "35千伏安防记录",
            navBar: ["操作中台", "安防监测", "350千伏"]
          };
          break;
        case "environmental10KVList":
          this.areaId = "6";
          this.titleData = {
            title: "10千伏安防警告",
            securityRecord: "10千伏安防记录",
            navBar: ["操作中台", "安防监测", "10千伏"]
          };
          break;
        default:
      }
    }
  },
  methods: {
    getAreaData() {
      getAxiosData("/lenovo-alarm/api/security/statistics", this.areaId).then(
        res => {
          if (res.code !== 200) {
            that.dataList = [];
            that.totalNum = 0;
            return that.$message.error(res.msg);
          }
          this.circleData = res.data;
        }
      );
    }
  },
  mounted() {
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

