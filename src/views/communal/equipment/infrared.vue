<template>
  <div class="visiblelight">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div>
      <KeyErea configType="2" />
    </div>
    <div class="reportRecode">
      <div class="right not-print">
        <div class="report">
          <div>最新生成的巡检报告</div>
          <div @click="getMoreReport">查看更多 ></div>
        </div>
        <div
          class="inspection"
          v-loading="loadingOptionF"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          element-loading-text="加载中"
        >
          <div v-for="(item,index) in inspecReport.slice(0,6)" :key="index">
            <ReportTable :url="url" :reportData="item" />
          </div>
        </div>
      </div>
      <div class="left">
        <div class="recode not-print">
          <div>最新24小时记录信息</div>
          <div @click="getMore">查看更多 ></div>
        </div>
        <div
          class="hours"
          v-loading="loadingOptionS"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          element-loading-text="加载中"
        >
          <template v-for="(item,index) in lightInformation">
            <MonitorWarn
              v-if="item['isPhaseAlarm']!= 1"
              :remarkData="lightInformation[index]"
              :time="item.alarmTime"
              :remarks="item.dealList"
              :key="index"
              @handleListData="handleListData"
            />
            <monitor-warn-t
              v-else
              :remarkData="lightInformation[index]"
              :time="item.alarmTime"
              :remarks="item.dealList"
              :key="index"
              @handleListData="handleListData"
            />
          </template>

          <!-- <monitor-warn-t></monitor-warn-t>
          <monitor-warn-t></monitor-warn-t>-->
        </div>
      </div>
    </div>
    <div class="allRecodes">
      <div>所有记录</div>
      <div>
        <div @click="handleClick(item)" v-for="(item,index) in dataList" :key="index">
          <img :src="item.pic" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import ReportTable from "_c/duno-c/ReportTable";
import KeyErea from "_c/duno-c/KeyErea";
import mixinViewModule from "@/mixins/view-module";
import MonitorWarn from "./components/MonitorWarn";
import MonitorWarnT from "./components/MonitorWarnT";
import {
  infraNewReport,
  infraNewInformation,
  mainDevice
} from "@/api/configuration/configuration.js";
import moment from "moment";
export default {
  mixins: [mixinViewModule],
  name: "visiblelight",
  components: {
    Breadcrumb,
    dunoBtnTop,
    KeyMonitor,
    ReportTable,
    KeyErea,
    MonitorWarn,
    MonitorWarnT
  },
  name: "visiblelightTep",
  data() {
    return {
      loadingOptionF: false,
      timerF: null,
      loadingOptionS: false,
      timerS: null,
      // mixinViewModuleOptions: {
      //   activatedIsNeed: true,
      //   getDataListURL: "/lenovo-device/api/main-device/list"
      // },
      dataList: [
        {
          pic: require("../../../assets/demo/001.png")
        },
        {
          pic: require("../../../assets/demo/002.png")
        },
        {
          pic: require("../../../assets/demo/003.png")
        },
        {
          pic: require("../../../assets/demo/004.png")
        },
        {
          pic: require("../../../assets/demo/005.png")
        },
        {
          pic: require("../../../assets/demo/006.png")
        },
        {
          pic: require("../../../assets/demo/007.png")
        },
        {
          pic: require("../../../assets/demo/008.png")
        }
      ],
      isCenter: false,
      valueSelect: "",
      dataMonitor: [],
      url: "/lenovo-plan/api/plan/iir-report/download",
      timeQueryData: {},
      inspecReport: [],
      lightInformation: [],
      titleValueR: "监控摄像头选择",
      titleValueL: "四个摄像头",
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/visiblelight/list", name: "设备监测" },
        { path: "", name: "红外测温" }
      ]
    };
  },
  methods: {
    handleClick(item) {
      this.$router.push({
        name: "allReport-detail",
        query: {
          title: "红外监测记录信息",
          url: "/lenovo-plan/api/statistics/meter-data/list",
          // url: "/lenovo-plan/api/task/iir-result/list",
          parentDeviceId: item.deviceIdStr,
          deviceName: item.deviceName
        }
      });
    },
    getMore() {
      this.$router.push({
        name: "infrared-detail",
        query: {
          title: "红外监测记录信息",
          url: "/lenovo-plan/api/task/iir-result/list"
        }
      });
    },
    getlightData() {
      this.loadingOptionF = true;
      this.timerF = setTimeout(() => {
        this.loadingOptionF = false;
      }, 1000000000);
      let query = {
        ...this.timeQueryData,
        pageIndex: 1,
        pageRows: 4
      };
      infraNewReport(query).then(res => {
        this.inspecReport = res.data.tableData;
        clearTimeout(this.timerF);
        this.loadingOptionF = false;
      });
    },
    getlightInfo() {
      this.loadingOptionS = true;
      this.timerS = setTimeout(() => {
        this.loadingOptionS = false;
      }, 1000000000);
      let data = {
        ...this.timeQueryData,
        pageIndex: 1,
        pageRows: 4
      };
      infraNewInformation(data).then(res => {
        this.lightInformation = res.data.tableData;
        clearTimeout(this.timerS);
        this.loadingOptionS = false;
      });
    },
    getInit() {
      let startTime = "";
      let endTime = "";
      endTime = moment().format("YYYY-MM-DD HH:mm:ss");
      startTime = moment()
        .add(-1, "days")
        .format("YYYY-MM-DD HH:mm:ss");
      this.timeQueryData.startTime = startTime;
      this.timeQueryData.endTime = endTime;
    },
    getMoreReport() {
      this.$router.push({
        name: "infrared-info",
        query: {
          title: "红外监测巡检报告",
          url: "/lenovo-plan/api/plan/iir-report/list",
          planType: "2"
        }
      });
    },
    handleListData() {
      this.getlightInfo();
    },
    initImg() {
      mainDevice().then(res => {
        this.dataList = res.data;
      });
    }
  },
  mounted() {
    this.getlightData();
    this.getlightInfo();
    this.initImg();
  },
  created() {
    this.getInit();
  }
};
</script>
<style lang="scss">
.el-select-dropdown {
  background: linear-gradient(
    210deg,
    rgba(48, 107, 135, 0.9),
    rgba(28, 50, 64, 0.7) 60%
  ) !important;
  border: none !important;
}
.el-select-dropdown__item,
.el-select-dropdown__empty,
.el-select-dropdown__item.selected {
  color: white;
}
.el-select-dropdown__list {
  position: relative;
  top: -5px;
}
.visiblelight {
  .el-loading-mask {
    width: 100% !important;
  }
  .el-loading-text {
    color: #969696 !important;
  }
  .icon-xiala {
    /*width: 12px;
    height: 15px;*/
  }
  .selectSearch {
    .el-input--small .el-input__inner {
      background: #1a2f42;
      height: 40px;
      border: none;
      margin-left: 5px;
      border-radius: 0 !important;
      width: 180px;
      color: white;
      font-size: 16px;
    }
    .el-input--small .el-input__inner::-webkit-input-placeholder {
      color: white;
      font-size: 16px;
    }
    .el-input--small .el-input__inner:-moz-placeholder {
      color: white;
      font-size: 16px;
    }
    .el-input--small .el-input__inner:-ms-input-placeholder {
      color: white;
      font-size: 16px;
    }
  }
  .reportRecode {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    & > div {
      width: calc(50% - 10px);
    }
    .right,
    .left {
      .report,
      .recode {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        & > div:first-child {
          line-height: 40px;
          color: #ffffff;
          font-size: 20px;
        }
        & > div:nth-child(2) {
          line-height: 40px;
          width: 139px;
          background-image: url(../../../assets/images/btn/moreBtn.png);
          text-align: center;
          font-size: 18px;
          color: #ffffff;
        }
      }
    }
    .right {
      .inspection {
        height: 910px;
        padding: 20px 20px 0 20px;
        background-color: #142838;
        overflow: hidden;
        & > div {
          float: left;
          width: calc(50% - 10px);
          margin-right: 20px;
          .reportTable {
            height: 425px;
            img {
              height: 100%;
            }
          }
        }
        & > div:nth-child(2n + 1) {
          margin-right: 0;
        }
      }
    }
    .left {
      .hours {
        width: 100%;
        height: 910px;
        padding: 20px 20px 14px 20px;
        overflow: hidden;
        background-color: #142838;
        .alarmLog {
          margin-left: 0;
          box-sizing: border-box;
          width: 100%;
        }
      }
    }
  }
  .allRecodes {
    & > div:first-child {
      margin: 20px 0 30px 0;
      color: #ffffff;
      font-size: 20px;
    }
    & > div:nth-child(2) {
      background-color: #142838;
      padding: 20px;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      div {
        cursor: pointer;
        width: calc(12.5% - 17.5px);
        img {
          display: block;
          width: 100%;
        }
        p {
          text-align: center;
          color: #ffffff;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
