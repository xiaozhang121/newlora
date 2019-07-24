<template>
  <div class="reportTable">
    <div>
      <img :src="reportData.pic" />
    </div>
    <div class="content">
      <h3>
        任务ID:
        <span>{{reportData.planId}}</span>
      </h3>
      <p>
        类型:
        <span>{{reportData.planType}}</span>
      </p>
      <p>
        日期:
        <span>{{reportData.date}}</span>
      </p>
      <p>
        时长:
        <span>{{reportData.timeLong}}</span>
      </p>
      <p>
        异常信息数量:
        <span>{{reportData.alarmNum}}</span>
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
      <div @click="clickDownload">
        <i class="iconfont icon-xiazai"></i>
        <span>下载报告</span>
      </div>
      <div @click="viewReports">
        <i class="iconfont icon-chakan"></i>
        <span>查看报告</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import {
  reportDownload,
  getViewreport
} from "@/api/configuration/configuration.js";
import { constants } from "crypto";
export default {
  name: "ReportTable",
  props: {
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
    clickDownload() {
      let url = this.url.downloadUrl;
      let query = {
        planId: this.reportData.planId,
        t: this.$store.state.user.token
      };
      getAxiosData(url, query).then(res => {
        this.$message({
          message: "开始下载",
          type: "success"
        });
      });
    },
    viewReports() {
      debugger;
      this.$router.push({
        path: "/report/report-view",
        query: {
          planId: this.reportData.planId,
          //   planId: '603610399709396992',
          planType: this.reportData.planType
        }
      });
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
  img {
    width: 100%;
    display: block;
  }
  .content {
    padding: 20px 20px 10px 20px;
    h3 {
      font-size: 16px;
      margin-bottom: 10px;
      span {
        padding-left: 10px;
      }
    }
    p {
      font-size: 14px;
      span {
        padding-left: 10px;
      }
    }
    & > p:last-child {
      word-wrap: break-word;
      margin-top: 15px;
      span {
        color: #3baddf;
        padding-left: 0;
      }
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
      width: 50%;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      background-color: #2b516f;
      span {
        padding-left: 5px;
      }
    }
    & > div:first-child {
      border-right: 1px solid #ffffff;
    }
  }
}
</style>

