<template>
  <div class="duno-security">
    <div class="breadcrumb">
      <Breadcrumb />
    </div>
    <div>
      <KeyErea />
    </div>
    <div class="alarmTitle">
      <div>1天内安防警告记录</div>
      <div>
        <div @click="clickToDetail">
          <i class="iconfont icon-gaojingxinxi"></i>
          所有安防警告
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
import { mapState } from "vuex";
import pushMov from "_c/duno-m/pushMov";
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
    pushMov,
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
      optionsList: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      valueSelect: "",
      pushMovVisable: false,
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
  computed: {
    ...mapState(["app"]),
    cameraPic() {
      if (this.cameraInfo) {
        return this.cameraInfo["pic"];
      } else {
        return "";
      }
    }
  },
  methods: {
    selectData(value) {
      const that = this;
      securityMonitor({ monitorDeviceId: value }).then(res => {
        that.titleValueL = "监控摄像头数量";
        that.dataMonitor = res.data;
        that.videoWidth = "calc(50%)";
        that.active = 1;
        that.isCenter = true;
      });
    },
    onClose() {
      this.pushMovVisable = false;
    },
    onPushReal(index) {
      const that = this;
      let query = {
        ["cameraPos0" + index]: this.cameraInfo["monitorDeviceId"],
        id: this.$store.state.user.configInfo
      };
      editConfig(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
      });
    },
    onPush(item) {
      this.pushMovVisable = true;
      this.cameraInfo = item;
    },
    getCamera() {
      const that = this;
      securityMonitor().then(res => {
        if (res.data && res.data.length) {
          that.dataMonitorAll = res.data;
          that.dataMonitor = res.data.slice(0, 4);
        }
      });
    },
    initData() {
      const that = this;
      getMonitorSelect().then(res => {
        that.optionsList = res.data.tableData;
      });
    },
    onSelect(item) {
      this.titleValueL = item["describeName"];
      console.log(item.widthType);
      this.dataMonitor = this.dataMonitorAll.slice(item["count"]);
      this.valueSelect = "";
      switch (item.widthType) {
        case 2:
          this.videoWidth = "calc(50% - 10px)";
          this.active = 2;
          this.isCenter = false;
          break;
        case 3:
          this.videoWidth = "calc(100%/3 - 14px)";
          this.active = 3;
          this.isCenter = false;
          break;
        case 4:
          this.videoWidth = "calc(25% - 15px)";
          this.active = 4;
          this.isCenter = false;
          break;
        default:
          this.active = 4;
          this.isCenter = false;
      }
    },
    handleData() {
      this.getDataList();
    },
    clickToDetail(){
        this.$router.push({name:"security-all"})
    }
  },
  created() {
    this.initData();
    this.getCamera();
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
  margin-top: 1px !important;
  margin-left: 6px;
  border-radius: 0;
  min-width: 179px !important;
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
.el-popper[x-placement^="bottom"] .popper__arrow {
  display: none;
}
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
