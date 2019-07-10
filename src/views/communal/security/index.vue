<template>
  <div class="duno-security">
    <div class="breadcrumb">
      <Breadcrumb />
    </div>
    <div class="dunoDrap">
      <div>重点检测区域</div>
      <div class="selectBtn">
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="numberCameras"
            :top="top"
            :right="right_l"
            :title="titleValueL"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="cameraSelection"
            :top="top"
            :right="right_r"
            :title="titleValueR"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
      </div>
    </div>
    <div class="monitorArea">
      <KeyMonitor
        v-for="(item,index) in dataMonitor"
        :class="{'noMargin': (index+1) % active == 0}"
        :key="index"
        @on-push="onPush"
        :width="videoWidth"
      />
    </div>
    <div class="alarmTitle">
      <div>3天内安防警告记录</div>
      <div>
        <div>
          <i class="iconfont icon-gaojingxinxi"></i>
          所有安防警告
        </div>
      </div>
    </div>
    <div class="alarmLogIn">
      <AlarmLog v-for="(item,index) in dataAlarm" :key="index" />
    </div>
    <push-mov @on-close="onClose" :visible="pushMovVisable" />
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import AlarmLog from "_c/duno-c/AlarmLog";
import pushMov from "_c/duno-m/pushMov";
// import mixinViewModule from "@/mixins/view-module";
export default {
  name: "security",
  // mixins: [mixinViewModule],
  components: {
    Breadcrumb,
    dunoBtnTop,
    KeyMonitor,
    AlarmLog,
    pushMov
  },
  data() {
    return {
      // mixinViewModuleOptions: {
      //   activatedIsNeed: true,
      //   getDataListURL: "/lenovo-device/api/monitor/device-list"
      // },
      pushMovVisable: false,
      showBtnList: false,
      isSecond: false,
      top: "40px",
      right_r: "20px",
      right_l: "230px",
      titleValueR: "监控摄像头选择",
      titleValueL: "监控摄像头数量",
      videoWidth: "calc(25% - 15px)",
      cameraSelection: [],
      dataMonitor: [
        {
          item: ""
        },
        {
          item: ""
        },
        {
          item: ""
        },
        {
          item: ""
        },
        {
          item: ""
        },
        {
          item: ""
        },
        {
          item: ""
        },
        {
          item: ""
        }
      ],
      dataAlarm: [
        {
          item: ""
        },
        {
          item: ""
        },
        {
          item: ""
        },
        {
          item: ""
        }
      ],
      numberCameras: [
        {
          circleColor: "#00B4FF",
          describeName: "两个摄像头",
          widthType: 2,
          isActive: true
        },
        {
          circleColor: "#FF5EB9",
          describeName: "四个摄像头",
          widthType: 2,
          isActive: true
        },
        {
          circleColor: "#4FF2B7",
          describeName: "六个摄像头",
          widthType: 3,
          isActive: true
        },
        {
          circleColor: "#FF9000",
          describeName: "八个摄像头",
          widthType: 4,
          isActive: true
        }
      ],
      active: 4
    };
  },
  methods: {
    onClose() {
      this.pushMovVisable = false;
    },
    onPush() {
      this.pushMovVisable = true;
    },
    handleNum() {
      getAxiosData("/lenovo-device/api/security/monitor-select").then(res => {
        if (res.code !== 200) {
          that.dataList = [];
          that.totalNum = 0;
          return that.$message.error(res.msg);
        }
        this.TestEquipment = res.data;
      });
    },
    onSelect(item) {
      this.titleValueL = item["describeName"];
      console.log(item.widthType);
      switch (item.widthType) {
        case 2:
          this.videoWidth = "calc(50% - 10px)";
          this.active = 2;
          break;
        case 3:
          this.videoWidth = "calc(100%/3 - 14px)";
          this.active = 3;
          break;
        case 4:
          this.videoWidth = "calc(25% - 15px)";
          this.active = 4;
          break;
        default:
          this.active = 4;
      }
    }
  }
};
</script>

<style lang="scss">
.duno-security {
  width: 100%;
  height: 100%;
  position: relative;
  .dunoDrap {
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      line-height: 45px;
      font-size: 20px;
      color: #ffffff;
    }
    .selectBtn {
      display: flex;
      justify-content: space-between;
      width: 380px;
      .dunoBtnTop {
        width: 185px;
        display: inline-flex;
        padding-bottom: 0;
        .btnList {
          top: inherit !important;
          width: 185px;
          .title {
            font-size: 18px;
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
    padding: 21px 27px;
    overflow: hidden;
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
      margin: 10px 0;
      font-size: 20px;
      line-height: 40px;
    }
    & > div:last-child {
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
