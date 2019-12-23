<template>
  <div class="reportTable not-print">
    <div class="not-print">
      <img v-if="imageVisible" :src="reportData.pic" :onerror="defaultImg" />
    </div>
    <div class="content not-print">
      <h3 v-if="kind != 'robot'">
        <span class="taskid">{{reportData.planName}}</span>
      </h3>
      <h3 v-if="kind == 'robot'">
        {{ reportData.planName?reportData.planName:'/' }}
      </h3>
      <p v-if="kind != 'robot' && reportData.planType">
        类型: {{reportData.planType}}
      </p>
      <p>
        日期: {{reportData.date?reportData.date:getPreWeekEnd()}}
      </p>
      <p v-if="isAllInfo && reportData.timeLong">
        时长: {{reportData.timeLong}}
      </p>
      <p>
        异常信息数量: {{reportData.alarmNum?reportData.alarmNum:0}}
      </p>
      <p v-if="isAllInfo&&kind != 'robot'">
        来源:
        <span
          v-for="(item,index) in reportData.monitorDeviceList"
          :key="index"
          :title="item.monitorDeviceName"
          style="text-decoration: underline"
          @click="getJump(item)"
          :style="{cursor:'pointer'}"
        >
          {{item.monitorDeviceName}}
          <i v-if="index*1+1 != reportData.monitorDeviceList.length">,</i>
        </span>
      </p>
    </div>
    <div class="btn not-print">
      <!-- <div @click="clickExcel">
        <i class="iconfont icon-xiazai"></i>
        <span>下载报告</span>
      </div>-->
      <div @click="viewReports">
        <i class="iconfont icon-chakan"></i>
        <span>查看报告</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
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
    queryData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    noRobot: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
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
      console.log(this.reportData);
      if (this.path) {
        let query = {};
        if (!this.noRobot) {
          query = {
            taskDeviceId: this.taskCurreny.taskDeviceId,
            planId: this.reportData.planId,
            taskRunHisId: this.reportData.ID,
            planType: this.reportData.taskType,
            executeTime: this.reportData.date,
            startTime: this.reportData.StartTime,
            planName: this.reportData.planName,
            endTime: this.reportData.EndTime,
            path: "/robot-one/reportList?substationId=1&robotId=1",
            name: "最新巡视报告"
          };
        } else {
          if (this.reportData && this.reportData.value)
            query = {
              value: this.reportData.value,
              planName: this.reportData.planName
            };
        }
        query = Object.assign(query, this.queryData)
        this.$router.push({
          path: this.path,
          query: query
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
            planName: this.reportData.planName,
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
            planName: this.reportData.planName,
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
            planName: this.reportData.planName,
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
            planName: this.reportData.planName,
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
            planName: this.reportData.planName,
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
            planName: this.reportData.planName,
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
            planName: this.reportData.planName,
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
    },
    getPreWeekEnd() {
      let dateM = moment(new Date());
      let day = dateM.day(0).format("YYYY-MM-DD HH:mm:ss"); //上周天
      return day;
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
    width: 100%;
    position: relative;
    padding-bottom: 56%;
    background-image: url("../../../assets/images/placeholder.png");
    background-size: 100% 100%;
    img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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

