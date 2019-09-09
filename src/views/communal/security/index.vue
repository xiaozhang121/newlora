<template>
  <div class="duno-security">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div>
      <KeyErea />
    </div>
    <div class="mainContamin">
       <div class="item">
        <div class="alarmTitle">
          <div>24小时监测记录</div>
          <div>
            <div @click="clickToDetail(1)">查看更多 ></div>
          </div>
        </div>
        <div class="monitorContain">
            <div class="monitorItem" :class="{marginRight: index%2 == 0}" v-for="(item, index) in safeList"  :key="index">
              <key-monitor
                  class="monitorRecord"
                  :showBtmOption="true"
                  :pushCamera="false"
                  :noButton="false"
                  configType="2"
                  :monitorInfo="item"
                  :imgAdress="item['pic']"
                  :streamAddr="item['streamAddr']"
                  :kilovolt="item['monitorDeviceName']"
                  :patrol="`${item['startTime']}至${item['endTime']}`"
              />
            </div>
            <div style="clear: both"></div>
        </div>
      </div>
       <div class="item">
        <div class="alarmTitle">
          <div>3天内动态环境异常记录</div>
          <div>
            <div @click="clickToDetail(2)">查看更多 ></div>
          </div>
        </div>
        <div
          class="alarmLogIn"
          :class="{'canelLoading': !loading}"
          v-loading="loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          element-loading-text="加载中"
        >
          <AlarmLog
            v-for="(item,index) in dataList"
            :remarkData="dataList[index]"
            :time="item.alarmTime"
            :remarks="item.dealList"
            :key="index"
            @handleListData="handleData"
          />
        </div>
      </div>
    </div>

    <!-- <push-mov :pic="cameraPic" @on-push="onPushReal" @on-close="onClose" :visible="pushMovVisable" /> -->
  </div>
</template>

<script>
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import KeyErea from "_c/duno-c/KeyErea";
import AlarmLog from "_c/duno-c/AlarmLog";
import mixinViewModule from "@/mixins/view-module";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
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
    KeyMonitor,
    Breadcrumb,
    AlarmLog,
    KeyErea
  },
  data() {
    return {
      safeList: [],
      timer: null,
      loading: false,
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
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/environmental/list", name: "动态环境监测" },
        { path: "", name: "动态环境总览" }
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
      ],
      cameraInfo: null,
      active: 4
    };
  },
  watch: {
    dataList: {
      handler(now) {
        if (now.length || now.length == 0) {
          this.loading = false;
          clearTimeout(this.timer);
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    oneDayAgo(){
        let curDate = new Date();
        let preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
        return preDate
    },
    initData(){
        const that = this
        let date = this.oneDayAgo()
        let query = {
            pageIndex: 1,
            pageRows: 6,
            startTime: moment(date).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        }
        getAxiosData('/lenovo-device/device/video/record/videos',query).then(res=>{
            this.safeList = res.data.tableData
            for(let i=0; i<this.safeList.length; i++){
                postAxiosData("/lenovo-device/device/video/record/video/pic",{positionIndex: i, videoPath: res.data.tableData[i]['streamAddr']}).then(res=>{
                    let data = res.data
                    that.$set(that.safeList[data['positionIndex']],'pic',data['pic'])
                    that.$forceUpdate()
                })
            }
            // this.safeList = [{},{},{}]
        })
    },
    handleData() {
      this.getDataList();
    },
    clickToDetail(flag) {
      if (flag == 2) {
        this.$router.push({
          name: "security-all"
        });
      } else {
        this.$router.push({
          name: "record-all"
        });
      }
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
    this.initData();
    this.loading = true;
    this.timer = setTimeout(() => {
      this.loading = false;
    }, 10000);
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
  .el-loading-text {
    color: #969696 !important;
  }
  .icon-xiala {
    /*  width: 12px;
    height: 14px;*/
  }
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
      font-size: 20px;
    }
    & > div:last-child {
      line-height: 40px;
      padding-left: 10px;
      padding-right: 10px;
      cursor: pointer;
      background-size: 100% 100%;
      background-image: url(../../../assets/images/btn/btnanfang.png);
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
    .alarmLog{
        width: 100%;
        margin-left: 0;
        height: inherit;
    }
    &.canelLoading{
      opacity: 1 !important;
    }
    & > div:nth-child(even) {
      margin-left: 0 !important;
    }
  }
  .mainContamin {
    display: flex;
    .keyMonitor .camera .explain .text{
      display: flex;
    }
    .monitorContain {
      background: rgba(20, 40, 56, 0.8);
      padding: 20px;
      min-height: 491px;
    }
    .monitorItem {
      width: 49%;
      float: left;
      &.marginRight {
        margin-right: 2%;
      }
      .monitorRecord {
        width: 100% !important;
        height: 100%;
        margin: 0 0px 50px 0;
      }
    }
    .item {
      flex-grow: 1;
      flex-basis: 0;
    }
    .item:last-child {
      margin-left: 20px;
    }
  }
}
</style>
