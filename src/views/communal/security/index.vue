<template>
  <div class="duno-security">
    <div class="breadcrumb">
      <Breadcrumb />
    </div>
    <div>
      <KeyErea />
    </div>
    <div class="alarmTitle">
      <div>3天内动态环境异常记录</div>
      <div>
        <div @click="clickToDetail">
          <i class="iconfont icon-gaojingxinxi"></i>
          所有动态环境异常信息
        </div>
      </div>
    </div>
    <div class="alarmLogIn">
      <AlarmLog
        v-for="(item,index) in dataList"
        :remarkData="dataList[index]"
        :time="item.alarmTime"
        :remarks="item.dealList"
        :key="index"
        @handleListData="handleData"
      />
    </div>
    <!-- <push-mov :pic="cameraPic" @on-push="onPushReal" @on-close="onClose" :visible="pushMovVisable" /> -->
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import KeyErea from "_c/duno-c/KeyErea";
import AlarmLog from "_c/duno-c/AlarmLog";
import mixinViewModule from "@/mixins/view-module";
import { getAxiosData } from "@/api/axiosType";
import moment from "moment";
import {
  getMonitorSelect,
  securityMonitor,
  editConfig
} from "@/api/currency/currency.js";
export default {
  mixins: [mixinViewModule],
  name: "security",
  components: {
    Breadcrumb,
    AlarmLog,
    KeyErea
  },
  data() {
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-alarm/api/security/list"
      },
      isCenter: false,
      time: "",
      remarks: [],
      dataForm: {},
      valueSelect: "",
      showBtnList: false,
      isSecond: false,
      titleValueR: "监控摄像头选择",
      titleValueL: "四个摄像头",
      videoWidth: "calc(25% - 15px)",
      cameraSelection: [],
      dataMonitorAll: [],
      dataMonitor: [],
      numberCameras: [
        {
          circleColor: "#00B4FF",
          describeName: "两个摄像头",
          widthType: 2,
          count: 2,
          isActive: true
        },
        {
          circleColor: "#FF5EB9",
          describeName: "四个摄像头",
          widthType: 2,
          count: 4,
          isActive: true
        },
        {
          circleColor: "#4FF2B7",
          describeName: "六个摄像头",
          count: 6,
          widthType: 3,
          isActive: true
        },
        {
          circleColor: "#FF9000",
          describeName: "八个摄像头",
          count: 8,
          widthType: 4,
          isActive: true
        }
      ],
      cameraInfo: null,
      active: 4
    };
  },
  methods: {
    handleData() {
      this.getDataList();
    },
    clickToDetail() {
      this.$router.push({ name: "security-all" });
    },
    getTime() {
      let endTime = moment().format("YYYY-MM-DD HH:mm:ss");
      let startTime = moment()
        .subtract(3, "days")
        .format("YYYY-MM-DD HH:mm:ss");
      this.dataForm.startTime = startTime;
      this.dataForm.endTime = endTime;
    }
  },
  created() {
    this.getTime();
  },
  beforeDestroy() {}
};
</script>

<style lang="scss">
@import "@/style/select.scss";
.duno-security {
  width: 100%;
  height: 100%;
  position: relative;

  .popper__arrow {
    display: none !important;
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
  .dunoDrap {
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 18px;
      color: #ffffff;
    }
    .selectBtn {
      display: flex;
      justify-content: space-between;
      width: 380px;
      margin-top: 14px;
      height: 50px;
      .dunoBtnTop {
        width: 185px;
        display: inline-flex;
        padding-bottom: 0;
        height: 40px;
        .btnList {
          top: inherit !important;
          width: 185px;
          .title {
            padding: 8px 20px;
          }
          .btnNr {
            color: white;
          }
        }
      }
    }
  }
  .monitorArea {
    box-sizing: border-box;
    width: 100%;
    min-height: 491px;
    background-color: #142838;
    opacity: 0.8;
    padding: 20px 20px;
    overflow: hidden;
    &.center {
      display: flex;
      justify-content: center;
    }
    & > div {
      float: left;
      margin-bottom: 20px;
      margin-right: 20px;
    }
    .noMargin {
      margin-right: 0;
    }
  }
  .alarmTitle {
    display: flex;
    justify-content: space-between;
    & > div {
      color: #ffffff;
      margin-top: 20px;
      margin-bottom: 10px;
      // margin: 10px 0;
      font-size: 20px;
      // line-height: 40px;
    }
    & > div:last-child {
      line-height: 40px;
      width: 146px;
      background-image: url(../../../assets/images/btn/btnanfang.png);
      padding-left: 7px;
      font-size: 18px;
    }
  }
  .alarmLogIn {
    box-sizing: border-box;
    width: 100%;
    min-height: 491px;
    background-color: #142838;
    opacity: 0.8;
    padding: 21px 27px;
    overflow: hidden;
    & > div:nth-child(odd) {
      margin-left: 0 !important;
    }
  }
}
</style>
