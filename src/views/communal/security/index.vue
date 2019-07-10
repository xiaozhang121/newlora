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
        <el-select @change="selectData" class="selectSearch" v-model="valueSelect" filterable :placeholder="titleValueR">
          <el-option
                  v-for="item in optionsList"
                  :key="item.monitorDeviceId"
                  :label="item.serialNo"
                  :value="item.monitorDeviceId">
          </el-option>
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
    <push-mov @on-close="onClose" :visible="pushMovVisable"/>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import AlarmLog from "_c/duno-c/AlarmLog";
import pushMov from '_c/duno-m/pushMov'
import { getMonitorSelect, securityMonitor } from '@/api/currency/currency.js'
export default {
  name: "security",
  components: {
    Breadcrumb,
    dunoBtnTop,
    KeyMonitor,
    AlarmLog,
    pushMov
  },
  data() {
    return {
      isCenter: false,
      optionsList:[
        {
            value: '选项1',
            label: '黄金糕'
        }, {
            value: '选项2',
            label: '双皮奶'
        }, {
            value: '选项3',
            label: '蚵仔煎'
        }, {
            value: '选项4',
            label: '龙须面'
        }, {
            value: '选项5',
            label: '北京烤鸭'
      }],
      valueSelect: '',
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
    selectData(value){
        const that = this
        securityMonitor({'monitorDeviceId':value}).then(res=>{
            that.titleValueL = "监控摄像头数量"
            that.dataMonitor = res.data.tableData
            that.videoWidth = "calc(50%)";
            that.active = 1;
            that.isCenter = true
        })
    },
    onClose(){
        this.pushMovVisable = false
    },
    onPush(){
        this.pushMovVisable = true
    },
    initData(){
        const that = this
        getMonitorSelect().then(res=>{
            that.optionsList = res.data.tableData
        })
    },
    onSelect(item) {
      this.titleValueL = item["describeName"];
      console.log(item.widthType);
      switch (item.widthType) {
        case 1:
          break;
        case 2:
          this.videoWidth = "calc(50% - 10px)";
          this.active = 2;
          this.isCenter = false
          break;
        case 3:
          this.videoWidth = "calc(100%/3 - 14px)";
          this.active = 3;
          this.isCenter = false
          break;
        case 4:
          this.videoWidth = "calc(25% - 15px)";
          this.active = 4;
          this.isCenter = false
          break;
        default:
          this.active = 4;
          this.isCenter = false
      }
    }
  },
  created(){
      this.initData()
  }
};
</script>

<style lang="scss">
.el-select-dropdown{
  background:linear-gradient(210deg, rgba(48, 107, 135, 0.9), rgba(28, 50, 64, 0.7) 60%) !important;
  border: none !important;
  margin-top: 1px !important;
  margin-left: 6px;
  border-radius: 0;
  min-width: 162px;
}
.el-select-dropdown__item,.el-select-dropdown__empty,.el-select-dropdown__item.selected{
  color: white;
}
.el-select-dropdown__list{
  position: relative;
  top: -5px;
}
.el-popper[x-placement^="bottom"] .popper__arrow{
  display: none;
}
.duno-security {
  width: 100%;
  height: 100%;
  position: relative;

  .popper__arrow{
    display: none !important;
  }
  .selectSearch{
    .el-input--small .el-input__inner{
      background: #1a2f42;
      border: none;
      margin-left: 5px;
      border-radius: 0 !important;
      width: 163px;
      color: white;
      font-size: 15px;
    }
    .el-input--small .el-input__inner::-webkit-input-placeholder {
      color: white;
      font-size: 15px;
    }
    .el-input--small .el-input__inner:-moz-placeholder {
      color: white;
      font-size: 15px;
    }
    .el-input--small .el-input__inner:-ms-input-placeholder {
      color: white;
      font-size: 15px;
    }
  }
  .dunoDrap {
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      line-height: 45px;
      color: #ffffff;
    }
    .selectBtn {
      display: flex;
      justify-content: space-between;
      width: 340px;
      .dunoBtnTop {
        width: 165px;
        display: inline-flex;
        padding-bottom: 0;
        .btnList {
          top: inherit !important;
          width: 165px;
          .title {
            font-size: 15px;
          }
          .btnNr{
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
    padding: 21px 27px;
    overflow: hidden;
    &.center{
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
      margin: 10px 0;
      line-height: 40px;
    }
    & > div:last-child {
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
    overflow: hidden;
    & > div:nth-child(odd) {
      margin-left: 0 !important;
    }
  }
}
</style>
