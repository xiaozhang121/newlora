<template>
  <div class="visiblelight">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="titleLight">可见光监测</div>
    <div class="reportRecode">
      <div class="report">
        <div>历史生成的巡检报告</div>
        <div @click="getMoreReport">查看更多 ></div>
      </div>
      <div
        v-if="isEmpty"
        class="inspection"
        v-loading="loadingOptionF"
         element-loading-background="rgba(0, 0, 0, 0)"
        element-loading-text="请稍后，正在加载数据…"
      >
        <div v-for="(item,index) in inspecReport" :key="index">
          <ReportTable :url="url" :reportData="item" />
        </div>
      </div>
      <div v-else class="empty">
        <div>
          <p>暂时没有可见光设备巡检报告</p>
          <p>
            <a href="javascript:;" @click="getMoreReport">查看更多报告</a>
          </p>
        </div>
      </div>
    </div>
    <div class="reportRecode">
      <div class="recode">
        <div>历史记录信息</div>
        <div @click="getMore">查看更多 ></div>
      </div>
      <div
        v-if="isEmptyHour"
        class="hours"
        v-loading="loadingOptionS"
         element-loading-background="rgba(0, 0, 0, 0)"
        element-loading-text="请稍后，正在加载数据…"
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
      </div>
      <div v-else class="empty">
        <div>
          <p>24小时内暂时没有可见光设备监测记录</p>
          <p>
            <a href="javascript:;" @click="getMore">查看更多记录</a>
          </p>
        </div>
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
import MonitorWarnT from "./components/MonitorWarnT";
import {
  lightNewReport,
  lightNewInformation,
  mainDevice
} from "@/api/configuration/configuration.js";
import moment from "moment";
export default {
  name: "visiblelight",
  components: {
    Breadcrumb,
    ReportTable,
    MonitorWarn,
    MonitorWarnT
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
      inspecReport: [],
      isEmpty: true,
      isEmptyHour: true,
      lightInformation: [],
      titleValueL: "四个摄像头",
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/visiblelight/list", name: "设备监测" },
        { path: "", name: "可见光监测" }
      ]
    };
  },
  methods: {
    handleClick(item) {
      this.$router.push({
        name: "allReport-detail",
        query: {
          title: "可见光监测记录信息",
          url: "/lenovo-plan/api/statistics/meter-data/list",
          powerDeviceId: item.deviceIdStr,
          deviceName: item.deviceName,
          monitorDeviceType: 1,
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
    handleListData() {
      this.getDataList();
    },
    initImg() {
      mainDevice().then(res => {
        this.dataList = res.data;
      });
    },
    getlightData() {
      this.timerF = setTimeout(() => {
        this.loadingOptionF = false;
      }, 1000000000);
      this.timerS = setTimeout(() => {
        this.loadingOptionS = false;
      }, 1000000000);
      let query = {
        playtype: "1",
        pageIndex: 1,
        pageRows: 4
      };
      lightNewReport(query).then(res => {
        this.inspecReport = res.data.tableData;
        clearTimeout(this.timerF);
        this.loadingOptionF = false;
        if (this.inspecReport.length == 0) {
          this.isEmpty = false;
        } else {
          this.isEmpty = true;
        }
      });
      let data = {
        playtype: "1",
        pageIndex: 1,
        pageRows: 4
      };
      lightNewInformation(data).then(res => {
        this.lightInformation = res.data.tableData;
        clearTimeout(this.timerS);
        this.loadingOptionS = false;
        if (this.lightInformation.length == 0) {
          this.isEmptyHour = false;
        } else {
          this.isEmptyHour = true;
        }
      });
    }
  },
  mounted() {
    this.getlightData();
    this.initImg();
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
    .empty {
      padding: 20px 20px 0 20px;
      background-color: #142838;
      min-height: 465px;
      box-sizing: border-box;
      width: 100%;
      // min-height: 491px;
      background-color: #142838;
      opacity: 0.8;
      padding-top: 10%;
      & > div {
        width: 50%;
        margin: 0 auto;
        color: #ffffff;
        text-align: center;
        p {
          padding-top: 2%;
        }
        a {
          text-decoration: underline;
        }
      }
    }
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
      flex-direction: row;
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
  .el-loading-mask {
    width: 100% !important;
  }
}
.visiblelight .reportRecode > div {
  width: 100% !important;
}
</style>
