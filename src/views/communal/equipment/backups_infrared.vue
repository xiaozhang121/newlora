<template>
  <div class="visiblelight">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="titleLight">红外测温</div>
    <div class="reportRecode">
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
        <div v-for="(item,index) in inspecReport" :key="index">
          <ReportTable :url="url" :reportData="item" />
        </div>
      </div>
    </div>
    <div class="reportRecode">
      <div class="recode">
        <div>最新24小时记录信息</div>
        <div @click="getMore">查看更多 ></div>
      </div>
      <div
        class="hours"
        v-loading="loadingOptionS"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="加载中"
      >
        <MonitorWarn
          v-for="(item,index) in lightInformation"
          :remarkData="lightInformation[index]"
          :time="item.alarmTime"
          :remarks="item.dealRecord"
          :key="index"
          @handleListData="handleData"
        />
      </div>
    </div>
    <div class="allRecodes">
      <div>所有记录</div>
      <div>
        <div @click="handleClick(item)" v-for="(item,index) in dataList.slice(0,8)" :key="index">
          <img :src="item.pic" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import ReportTable from "_c/duno-c/ReportTable";
import MonitorWarn from "./components/MonitorWarn";
import {
  infraNewReport,
  infraNewInformation,
  mainDevice
} from "@/api/configuration/configuration.js";
import moment from "moment";
export default {
  name: "visiblelight",
  components: {
    Breadcrumb,
    ReportTable,
    MonitorWarn
  },
  data() {
    return {
      loadingOptionF: true,
      timerF: null,
      loadingOptionS: true,
      timerS: null,
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
      url: "/lenovo-plan/api/plan/visible-report/download",
      timeQueryData: {},
      inspecReport: [],
      lightInformation: [],
      titleValueL: "四个摄像头",
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/visiblelight/list", name: "设备监测" },
        { path: "", name: "可见光" }
      ]
    };
  },
  methods: {
    handleClick(item) {
      //错的 暂时这样写
      this.$router.push({
        name: "allReport-detail",
        query: {
          title: "可见光监测记录信息",
          url: "/lenovo-plan/api/task/visible-result/list",
          powerDeviceId: item.deviceIdStr,
          deviceName: item.deviceName,
          flag: 0
        }
      });
    },
    getMore() {
      this.$router.push({
        name: "light-detail",
        query: {
          title: "可见光监测记录信息",
          url: "/lenovo-plan/api/task/visible-result/list"
        }
      });
    },
    getMoreReport() {
      this.$router.push({
        name: "light-info",
        query: {
          title: "可见光巡检报告",
          planType: "1",
          url: "/lenovo-plan/api/plan/visible-report/list"
        }
      });
    },
    handleData() {
      this.getDataList();
    },
    getlightData() {
      this.timerF = setTimeout(() => {
        this.loadingOptionF = false;
      }, 1000000000);
      this.timerS = setTimeout(() => {
        this.loadingOptionS = false;
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
    initImg() {
      mainDevice().then(res => {
        this.dataList = res.data;
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
      this.timeQueryData.playtype = "1";
    }
  },
  mounted() {
    this.getlightData();
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
  .titleLight {
    color: #ffffff;
    margin-top: 20px;
    margin-bottom: -20px;
  }
  .reportRecode {
    width: 100%;
    min-height: 425px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
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
        cursor: pointer;
        color: #ffffff;
      }
    }
    .inspection {
      padding: 20px 20px 0 20px;
      background-color: #142838;
      min-height: 465px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      & > div {
        width: calc(20% - 16px);
        margin-right: 20px;
        .reportTable {
          height: 425px;
          img {
            height: 100%;
          }
        }
      }
      & > div:nth-child(5n + 1) {
        margin-right: 0;
      }
    }
    .hours {
      width: 100%;
      padding: 20px 20px 14px 20px;
      background-color: #142838;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      min-height: 425px;
      .alarmLog {
        margin-left: 0;
        box-sizing: border-box;
        width: calc(50% - 10px);
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
.visiblelight .reportRecode > div {
  width: 100% !important;
}
</style>
