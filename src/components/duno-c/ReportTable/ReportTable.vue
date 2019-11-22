<template>
  <div class="reportTable">
    <div>
      <img v-if="imageVisible" :src="reportData.pic" :onerror="defaultImg" />
    </div>
    <div class="content">
      <el-tooltip class="item" effect="dark" :content="reportData.planName" placement="top">
        <h3 v-if="kind != 'robot'">
          <span class="taskid">{{reportData.planName}}</span>
        </h3>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="reportData.planName" placement="top">
        <h3 v-if="kind == 'robot'">
          {{ reportData.planName }}
          <!-- <span class="taskid">{{reportData.planId}}</span> -->
        </h3>
      </el-tooltip>
      <p v-if="kind != 'robot'">
        类型: {{reportData.planType}}
        <!-- <span>{{reportData.planType}}</span> -->
      </p>
      <p>
        日期: {{reportData.date}}
        <!-- <span>{{reportData.date}}</span> -->
      </p>
      <p v-if="isAllInfo">
        时长: {{reportData.timeLong}}
        <!-- <span>{{reportData.timeLong}}</span> -->
      </p>
      <p>
        异常信息数量: {{reportData.alarmNum}}
        <!-- <span>{{reportData.alarmNum}}</span> -->
      </p>
      <p v-if="isAllInfo">
        <!-- <i>来源:</i> -->
        来源:
        <span
          v-for="(item,index) in reportData.monitorDeviceList"
          :key="index"
          @click="getJump(item)"
          :style="{cursor:'pointer'}"
        >{{item.monitorDeviceName}}<i v-if="index*1+1 != reportData.monitorDeviceList.length">,</i></span>
      </p>
    </div>
    <div class="btn">
      <!-- <div @click="clickExcel">
        <i class="iconfont icon-xiazai"></i>
        <span>下载报告</span>
      </div> -->
      <div @click="viewReports">
        <i class="iconfont icon-chakan"></i>
        <span>查看报告</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import qs from "qs";
import {
  reportDownload,
  getViewreport
} from "@/api/configuration/configuration.js";
import mixinViewModule from "@/mixins/view-module";
export default {
  name: "ReportTable",
  mixins: [mixinViewModule],
  data() {
    const that = this;
    return {
      mixinViewModuleOptions: {
        exportURL: "/lenovo-plan/api/statistics/plan/download"
      },
      defaultImg: 'this.src="' + require("@/assets/transperant.png") + '"',
      imageVisible: true,
      queryForm: {},
      baseUrl:
        process.env.NODE_ENV === "development"
          ? that.$config.baseUrl.dev
          : that.$config.baseUrl.pro
    };
  },
  props: {
    taskRunHisId: {},
    taskCurreny: {},
    path: {
      type: String,
      default: ""
    },
    kind: {},
    reportData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    url: {
      type: String,
      default: () => {
        return "/lenovo-plan/api/statistics/plan/download";
      }
    },
    isAllInfo: {
      type: [Boolean, String],
      default: () => {
        return "true";
      }
    }
  },
  methods: {
    onError(error) {
      this.imageVisible = false;
    },
    clickExcel() {
      const that = this;
      if (this.taskRunHisId) {
        that.queryForm.taskRunHisId = this.taskRunHisId;
      }
      that.queryForm.planId = that.reportData.planId;
      that.queryForm.isRobot = that.reportData.isRobot;
      that.queryForm.batchId = that.reportData.batchId;
      that.queryForm.startTime = that.reportData.realStartTime;
      that.queryForm.endTime = that.reportData.realEndTime;
      that.exportHandle();
    },
    viewReports() {
      console.log(this.reportData)
      if (this.path) {
        this.$router.push({
          path: this.path,
          query: {
            taskDeviceId: this.taskCurreny.taskDeviceId,
            planId: this.reportData.planId,
            taskRunHisId: this.reportData.ID,
            planType: this.reportData.taskType,
            executeTime: this.reportData.date,
            path: "/robot-one/reportList?substationId=1&robotId=1",
            name: "最新巡视报告"
          }
        });
        return;
      }
      if (
        this.$route.name == "visiblelightList" ||
        this.$route.name == "light-info"
      ) {
        this.$router.push({
          name: "light-report",
          query: {
            planId: this.reportData.planId,
            planType: this.reportData.planType,
            batchId: this.reportData.batchId,
            executeTime: this.reportData.date,
            url: "/lenovo-plan/api/plan/visible-report/view/detail"
          }
        });
      } else if (
        this.$route.name == "infraredList" ||
        this.$route.name == "infrared-info"
      ) {
        this.$router.push({
          name: "infrared-report",
          query: {
            planId: this.reportData.planId,
            planType: this.reportData.planType,
            batchId: this.reportData.batchId,
            executeTime: this.reportData.date,
            url: "/lenovo-plan/api/plan/iir-report/view/detail"
          }
        });
      } else if (this.$route.name == "reportList") {
        this.$router.push({
          name: "report-view",
          query: {
            planId: this.reportData.planId,
            planType: this.reportData.planType,
            batchId: this.reportData.batchId,
            executeTime: this.reportData.date,
            url: "/lenovo-plan/api/statistics/plan/view"
          }
        });
      } else if (
        this.$route.name == "taskForm" ||
        this.$route.name == "reportFrom"
      ) {
        this.$router.push({
          path: "/abnormalInfoPath/taskForm/detail",
          query: {
            planId: this.reportData.planId,
            planType: this.reportData.planType,
            batchId: this.reportData.batchId,
            executeTime: this.reportData.date,
            url: "/lenovo-plan/api/statistics/plan/view"
          }
        });
      } else if (this.$route.name == "configure-report") {
        this.$router.push({
          name: "configure-view",
          query: {
            planId: this.reportData.planId,
            planType: this.reportData.planType,
            batchId: this.reportData.batchId,
            executeTime: this.reportData.date,
            url: "/lenovo-plan/api/statistics/plan/view"
          }
        });
      } else if (this.$route.name == "abnormalInfoList") {
        this.$router.push({
          name: "abnormalInfoList-report",
          query: {
            planId: this.reportData.planId,
            planType: this.reportData.planType,
            batchId: this.reportData.batchId,
            executeTime: this.reportData.date,
            url: "/lenovo-plan/api/statistics/plan/view"
          }
        });
      } else if (
        this.$route.name == "overviewList" ||
        this.$route.name == "overview-info"
      ) {
        this.$router.push({
          name: "overview-report",
          query: {
            planId: this.reportData.planId,
            planType: this.reportData.planType,
            isRobot: this.reportData.isRobot,
            batchId: this.reportData.batchId,
            executeTime: this.reportData.date,
            url: "/lenovo-plan/api/information/overview/plan/report/detail"
          }
        });
      }
    },
    getJump(item) {
      getAxiosData("/lenovo-device/api/preset/type", {
        monitorDeviceId: item.monitorDeviceId
      }).then(res => {
        let supportPreset = res.data["supportPreset"];
        let monitorDeviceType = res.data["monitorDeviceType"];
        if (monitorDeviceType == 1) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailLight",
              query: {
                monitorDeviceId: item.monitorDeviceId
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailLightN",
              query: {
                monitorDeviceId: item.monitorDeviceId
              }
            });
          }
        } else if (monitorDeviceType == 2) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailRed",
              query: {
                monitorDeviceId: item.monitorDeviceId,
                typeId: res.data["typeId"]
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailRedN",
              query: {
                monitorDeviceId: item.monitorDeviceId,
                typeId: res.data["typeId"]
              }
            });
          }
        } else if (monitorDeviceType == 3) {
          this.$router.push({
            path: "/surveillancePath/detailEnv",
            query: {
              monitorDeviceId: item.monitorDeviceId
            }
          });
        }
      });
    }
  },
  created() {
    console.log(this.$route.name);
    this.mixinViewModuleOptions.exportURL = this.url;
  }
};
</script>

<style lang="scss">
.reportTable {
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
  background-color: #213848;
  opacity: 0.8;
  color: #ffffff;
  position: relative;
  & > div:first-child {
    height: 200px;
    width: 100%;
    background-image: url("../../../assets/images/placeholder.png");
    background-size: 100% 100%;
    img {
      height: 100% !important;
      width: 100%;
      display: block;
    }
  }
  .content {
    padding: 10px 20px 10px 20px;
    h3 {
      font-size: 14px;
      font-weight: normal;
    }
    p {
      font-size: 14px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      white-space: nowrap;
      span {
        padding-left: 10px;
      }
    }
    & > p:last-child {
      word-wrap: break-word;
      margin-top: 5px;
      span {
        color: #3baddf;
        padding-left: 0;
      }
    }
    .taskid {
      font-size: 13px;
      font-weight: normal;
      width: 100%;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item {
      cursor: pointer;
    }
  }
  .btn {
    overflow: hidden;
    position: absolute;
    bottom: 0;
    width: 100%;
    & > div {
      white-space: nowrap;
      cursor: pointer;
      box-sizing: border-box;
      float: left;
      // width: calc(50% - 1px);
      width: 100%;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      background-color: #2b516f;
      @media screen and (min-width: 3500px) {
        font-size: 14px;
      }
      span {
        padding-left: 5px;
      }
    }
    // & > div:first-child {
    //   border-right: 2px solid #ffffff;
    //   @media screen and (min-width: 3500px) {
    //     border-right: 1px solid #ffffff;
    //   }
    // }
  }
}
</style>

