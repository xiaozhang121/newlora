<template>
  <div class="visiblelight">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
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
    <div class="reportRecode">
      <div class="right">
        <div class="report">
          <div>最新生成的巡检报告</div>
          <div>查看更多 ></div>
        </div>
        <div class="inspection">
          <div>
            <ReportTable />
          </div>
          <div>
            <ReportTable />
          </div>
          <div>
            <ReportTable />
          </div>
          <div>
            <ReportTable />
          </div>
          <div>
            <ReportTable />
          </div>
          <div>
            <ReportTable />
          </div>
        </div>
      </div>
      <div class="left">
        <div class="recode">
          <div>最新24小时记录信息</div>
          <div>查看更多 ></div>
        </div>
        <div class="hours">
          <AlarmLog />
          <AlarmLog />
          <AlarmLog />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import ReportTable from "_c/duno-c/ReportTable";
import AlarmLog from "_c/duno-c/AlarmLog";
export default {
  components: { Breadcrumb, dunoBtnTop, KeyMonitor, ReportTable, AlarmLog },
  name: "visiblelightTep",
  data() {
    return {
      isCenter: false,
      valueSelect: "",
      dataMonitor: [],
      titleValueR: "监控摄像头选择",
      titleValueL: "四个摄像头",
      dataBread: ["操作中台", "设备管理", "红外测温"],
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
      ]
    };
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
    onSelect(item) {
      this.titleValueL = item["describeName"];
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
.visiblelight {
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
  .reportRecode {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    & > div {
      width: calc(50% - 10px);
    }
    .right,
    .left {
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
          color: #ffffff;
        }
      }
    }
    .right {
      .inspection {
        padding: 20px 0 20px 20px;
        background-color: #142838;
        overflow: hidden;
        & > div {
          float: left;
          width: calc(100% / 3 - 20px);
          margin-right: 20px;
        }
      }
    }
    .left {
      .hours {
        width: 100%;
        // padding: 20px 20px 20px 0;
        padding: 20px;
        overflow: hidden;
        background-color: #142838;
        .alarmLog {
          margin-left: 0;
          box-sizing: border-box;
          width: 100%;
        }
      }
    }
  }
}
</style>
