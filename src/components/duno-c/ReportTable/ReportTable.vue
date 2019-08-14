<template>
  <div class="reportTable">
    <div>
      <img v-if="imageVisible" :src="reportData.pic" :onerror="defaultImg"/>
    </div>
    <div class="content">
      <el-tooltip class="item" effect="dark" :content="reportData.planId" placement="top">
        <h3 v-if="kind != 'robot'">
          <span class="taskid">任务ID:{{reportData.planId}}</span>
        </h3>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="reportData.planId" placement="top">
        <h3 v-if="kind == 'robot'">
          {{ reportData.name }}
          <span class="taskid">任务ID:{{reportData.planId}}</span>
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
      <p>
        时长: {{reportData.timeLong}}
        <!-- <span>{{reportData.timeLong}}</span> -->
      </p>
      <p>
        异常信息数量: {{reportData.alarmNum}}
        <!-- <span>{{reportData.alarmNum}}</span> -->
      </p>
      <p>
        <!-- <i>来源:</i> -->
        来源:
        <span
          v-for="(item,index) in reportData.monitorDeviceList"
          :key="index"
          @click="getJump(item)"
          :style="{cursor:'pointer'}"
        >{{item.monitorDeviceName}},</span>
      </p>
    </div>
    <div class="btn">
      <!-- <div @click="clickDownload">
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
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import qs from "qs";
import {
  reportDownload,
  getViewreport
} from "@/api/configuration/configuration.js";
import { constants } from "crypto";
export default {
  name: "ReportTable",
  data() {
    const that = this;
    return {
      defaultImg: 'this.src="' + require('@/assets/transperant.png')  + '"',
      imageVisible: true,
      baseUrl:
        process.env.NODE_ENV === "development"
          ? that.$config.baseUrl.dev
          : that.$config.baseUrl.pro
    };
  },
  props: {
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
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    onError(error){
        this.imageVisible = false
    },
    clickDownload() {
      let url = this.url.downloadUrl;
      let params = qs.stringify({
        taskRunHisId: this.reportData.taskRunHisId,
        planId: this.reportData.planId,
        t: this.$store.state.user.token
      });
      window.location.href = `${this.baseUrl}${url}?${params}`;
      /* getAxiosData(url, query).then(res => {
        this.$message({
          message: "开始下载",
          type: "success"
        });
      });*/
    },
    viewReports() {
      if (this.path) {
        this.$router.push({
          path: this.path,
          query: {
            taskDeviceId: this.taskCurreny.taskDeviceId,
            planId: this.reportData.planId,
            taskRunHisId: this.reportData.ID,
            //   planId: '603610399709396992',
            planType: this.reportData.taskType
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
            url: this.url.viewUrl
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
            url: this.url.viewUrl
          }
        });
      } else if (this.$route.name == "reportList") {
        this.$router.push({
          name: "report-view",
          query: {
            planId: this.reportData.planId,
            planType: this.reportData.planType,
            url: this.url.viewUrl
          }
        });
      } else if (this.$route.name == "configure-report") {
        this.$router.push({
          name: "configure-view",
          query: {
            planId: this.reportData.planId,
            planType: this.reportData.planType,
            url: this.url.viewUrl
          }
        });
      } else if (this.$route.name == "abnormalInfoList") {
        this.$router.push({
          name: "abnormalInfoList-report",
          query: {
            planId: this.reportData.planId,
            planType: this.reportData.planType,
            url: this.url.viewUrl
          }
        });
      }
    },
    getJump(item) {
      if (this.$route.name == "infraredList" || item.monitorDeviceType == "1") {
        this.$router.push({
          path: "/surveillancePath/detailRed",
          query: {
            monitorDeviceId: item.monitorDeviceId
          }
        });
      } else if (
        this.$route.name == "visiblelightList" ||
        item.monitorDeviceType == "2"
      ) {
        this.$router.push({
          path: "/surveillancePath/detailLight",
          query: {
            monitorDeviceId: item.monitorDeviceId
          }
        });
      }
    }
  },
  mounted() {
    console.log(this.$route.name);
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
      cursor: pointer;
      box-sizing: border-box;
      float: left;
      width: 100%;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      background-color: #2b516f;
      span {
        padding-left: 5px;
      }
    }
  }
}
</style>

