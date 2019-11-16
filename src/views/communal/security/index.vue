<template>
  <div class="duno-security">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="keyEreaContain">
      <KeyErea />
    </div>
    <div class="mainContamin">
      <div class="item">
        <div class="alarmTitle">
          <div>历史监测记录</div>
          <div>
            <div @click="clickToDetail(1)">查看更多 ></div>
          </div>
        </div>
        <div v-if="isEmptyHour" class="monitorContain">
          <div
            class="monitorItem"
            :class="{marginRight: index%2 == 0}"
            v-for="(item, index) in safeList"
            :key="index"
          >
            <key-monitor
              class="monitorRecord"
              :showBtmOption="true"
              :pushCamera="false"
              :noButton="false"
              :autoplay="false"
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
        <div v-else class="monitorContain empty">
          <div>
            <p>近期内没有监测记录</p>
            <p>
              <a href="javascript:;" @click="clickToDetail(1)">查看更多历史</a>
            </p>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="alarmTitle">
          <div>历史<span :style="{color:'#F5A623'}">异常</span>记录</div>
          <div>
            <div @click="clickToDetail(2)">查看更多 ></div>
          </div>
        </div>
        <div class="item-cons">
          <div
            v-if="isEmpty"
            class="alarmLogIn"
            :class="{'canelLoading': !loading}"
            v-loading="loading"
             element-loading-background="rgba(0, 0, 0, 0)"
            element-loading-text="请稍后，正在加载数据…"
          >
            <AlarmLog
              v-for="(item,index) in dataList"
              :remarkData="dataList[index]"
              :noButton="false"
              :time="item.alarmTime"
              :remarks="item.dealList"
              :key="index"
              @handleListData="handleData"
            />
          </div>
          <div v-else class="empty">
            <div>
              <p>近期没有人员违规、异物入侵和车辆出入记录</p>
              <p>
                <a href="javascript:;" @click="clickToDetail(2)">查看更多历史</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      isEmpty: true,
      isEmptyHour: true,
      time: "",
      remarks: [],
      pageRows: 6,
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
        { path: "/environmental/list", name: "现场安全管控" },
        { path: "", name: "信息总览" }
      ],
      getPic: false,
      cameraInfo: null,
      active: 4
    };
  },
  watch: {
    dataList: {
      handler(now) {
        let i = 0;
        if (now.length || now.length == 0) {
          this.loading = false;
          clearTimeout(this.timer);
        }
        if (!this.getPic) {
          now.forEach((item, index) => {
            this.getPic = true;
            postAxiosData("/lenovo-alarm/api/info/video/pic", {
              videoPath: item["alarmFileAddress"],
              positionIndex: index
            }).then(res => {
              try{
                this.dataList[res.data["positionIndex"]]["pic"] = res.data.pic;
                this.$forceUpdate();
              }catch (e) {

              }
            });
          });
        }
        if (now.length == 0) {
          this.isEmpty = false;
        } else {
          this.isEmpty = true;
        }
      },
      deep: true
    }
  },
  methods: {
    oneDayAgo() {
      let curDate = new Date();
      let preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
      return preDate;
    },
    initData() {
      const that = this;
      let date = this.oneDayAgo();
      let query = {
        pageIndex: 1,
        pageRows: 6
        // startTime: moment(date).format("YYYY-MM-DD HH:mm:ss"),
        // endTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
      };
      getAxiosData("/lenovo-device/device/video/record/videos", query).then(
        res => {
          try {
            this.safeList = res.data.tableData;
            for (let i = 0; i < this.safeList.length; i++) {
              postAxiosData("/lenovo-device/device/video/record/video/pic", {
                positionIndex: i,
                videoPath: res.data.tableData[i]["streamAddr"]
              }).then(res => {
                let data = res.data;
                that.$set(
                    that.safeList[data["positionIndex"]],
                    "pic",
                    data["pic"]
                );
                that.$forceUpdate();
              });
            }
            if (this.safeList.length == 0) {
              this.isEmptyHour = false;
            } else {
              this.isEmptyHour = true;
            }
          }catch (e) {
            
          }
        }
      );
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
    }
  },
  created() {
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
    min-height: 300px;
    background-color: rgba(20, 40, 56, 0.8) !important;
    opacity: 1 !important;
    padding: 20px 20px;
    overflow: hidden;
    padding-bottom: 10px;
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
    // opacity: 0.8;
    padding: 21px 27px;
    overflow: hidden;
    .alarmLog {
      width: 100%;
      margin-left: 0;
      height: inherit;
    }
    &.canelLoading {
      opacity: 1 !important;
    }
    & > div:nth-child(even) {
      margin-left: 0 !important;
    }
  }
  .keyEreaContain {
    z-index: inherit;
  }
  .mainContamin {
    // height: 560px;
    overflow: hidden;
    display: flex;
    position: relative;
    z-index: 1;
    .keyMonitor .camera .explain .text {
      display: flex;
    }
    .monitorContain {
      height: 100%;
      overflow-y: auto;
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
    .item-cons {
      height: 100%;
      overflow-y: auto;
    }
    .empty {
      box-sizing: border-box;
      width: 100%;
      min-height: 491px;
      background-color: #142838;
      opacity: 0.8;
      padding-top: 15%;
      & > div {
        width: 50%;
        margin: 0 auto;
        color: #ffffff;
        text-align: center;
        p {
          padding-top: 2%;
        }
        a {
          text-decoration: underline;
        }
      }
    }
    .item {
      width: calc(50% - 10px);
      flex-grow: 1;
      flex-basis: 0;
    }
    .item:last-child {
      margin-left: 20px;
    }
  }
}
</style>
