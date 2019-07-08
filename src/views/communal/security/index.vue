<template>
  <div class="duno-security">
    <div class="breadcrumb">
      <Breadcrumb />
    </div>
    <div class="dunoDrap">
      <div>重点检测区域</div>
      <div>
        <!-- <dunoBtnTop :showBtnList="showBtnList" :top="top" :right="right_r" /> -->
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
      <div>
        <!-- <dunoBtnTop :showBtnList="showBtnList" :top="top" :right="right_l" /> -->
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
    </div>
    <div class="monitorArea">
      <KeyMonitor
        v-for="(item,index) in dataMonitor"
        :class="{'noMargin': (index+1) % active == 0}"
        :key="index"
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
      <AlarmLog />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import AlarmLog from "_c/duno-c/AlarmLog";

export default {
  name: "security",
  components: {
    Breadcrumb,
    dunoBtnTop,
    KeyMonitor,
    AlarmLog
  },
  data() {
    return {
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
      numberCameras: [
        {
          circleColor: "#00B4FF",
          describeName: "两个摄像头",
          // widthType: 'calc(50% - 20px)',
          widthType: 2,
          isActive: true
        },
        {
          circleColor: "#FF5EB9",
          describeName: "四个摄像头",
          // widthType: 'calc(50% - 20px)',
          widthType: 2,
          isActive: true
        },
        {
          circleColor: "#4FF2B7",
          describeName: "六个摄像头",
          // widthType: 'calc(100%/3 - 40px)',
          widthType: 3,
          isActive: true
        },
        {
          circleColor: "#FF9000",
          describeName: "八个摄像头",
          // widthType: 'calc(25% - 60px)',
          widthType: 4,
          isActive: true
        }
      ],
      active: 4
    };
  },
  methods: {
    onSelect(item) {
      this.titleValueL = item.describeName;
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
  .dunoDrap {
    overflow: hidden;
    & > div:first-child {
      float: left;
      margin-top: 20px;
      color: #ffffff;
    }
    & > div:not(:first-child) {
      float: right;
      margin-top: 27px;
    }
    & > div:nth-child(2) {
      margin-left: 500px;
    }
    & > div:nth-child(3) {
      margin-left: 300px;
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
      margin: 20px 0;
    }
    & > div:last-child {
      line-height: 40px;
      width: 146px;
      background-image: url(../../../assets/images/btn/btnanfang.png);
      padding-left: 13px;
    }
  }
  .alarmLogIn {
    box-sizing: border-box;
    width: 100%;
    min-height: 491px;
    background-color: #142838;
    opacity: 0.8;
    padding: 21px 27px;
  }
}
</style>
