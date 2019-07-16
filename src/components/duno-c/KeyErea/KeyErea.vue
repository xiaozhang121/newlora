<template>
  <div class="keyErea">
    <div class="dunoDrap">
      <div>重点监测区域</div>
      <div class="selectBtn">
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="numberCameras"
            :title="titleValueL"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <el-select
            @change="selectData"
            class="selectSearch"
            v-model="valueSelect"
            filterable
            :placeholder="titleValueR"
          >
            <el-option
              v-for="item in optionsList"
              :key="item.monitorDeviceId"
              :label="item.serialNo"
              :value="item.monitorDeviceId"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="monitorArea" :class="{'center': isCenter}">
      <KeyMonitor
        v-for="(item,index) in dataMonitor"
        :class="{'noMargin': (index+1) % active == 0}"
        :key="index"
        :streamAddr="item['streamAddr']"
        @on-push="onPush"
        :monitorInfo="item"
        :width="videoWidth"
      />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import {
  getMonitorSelect,
  securityMonitor,
  editConfig
} from "@/api/currency/currency.js";
export default {
  name: "keyErea",
  components: {
    Breadcrumb,
    dunoBtnTop,
    KeyMonitor
  },
  data() {
    return {
      isSecond: false,
      isCenter: false,
      showBtnList: false,
      titleValueR: "监控摄像头选择",
      titleValueL: "四个摄像头",
      videoWidth: "calc(25% - 15px)",
      valueSelect: "",
      dataMonitor: [],
      active: 4,
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
      ]
    };
  },
  methods: {
    onPush(item) {
    //   this.pushMovVisable = true;
    //   this.cameraInfo = item;
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
    }
  },
  created() {
    this.initData();
    this.getCamera();
  }
};
</script>

<style lang="scss">
.keyErea {
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
}
</style>

