<template>
  <section class="warningDialogN">
    <div>
      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :fullscreen="true"
        class="elDialogClass"
        :visible="true"
        width="900px"
        center
        @close="handleClose"
      >
        <div slot="title" style="text-align: left">
          <div class="title_top">
            <span>{{ dataList.title }}</span>
            <span class="iconfontList">
              <!--<i class="iconfont icon-xiazai"></i>-->
              <i class="iconfont icon-dayin" @click="toPrint($event)" v-print="target"></i>
              <!--<i class="iconfont icon-wangye" @click="openPage()"></i>-->
            </span>
          </div>
          <div class="extend">{{ dataList.alarmTypeValue }}</div>
        </div>
        <div class="main">
          <div class="monitor" ref="imgContain">
            <div>
              <img
                v-if="isImgVideo"
                :src="dataList.fileAddress?dataList.fileAddress:dataList.alarmFileAddress"
                alt
              />
              <KeyMonitor
                v-else
                width="100%"
                :autoplay="true"
                :isNav="false"
                :streamAddr="dataList.fileAddress?dataList.fileAddress:dataList.alarmFileAddress"
              />
              <i
                v-if="isImgVideo"
                class="fullScreen iconfont icon-quanping"
                @click="changeFullScreen($refs.imgContain)"
              ></i>
            </div>
          </div>
          <div class="info">
            <div class="info_top">
              <p class="monitorTitle">判定结果:</p>
              <p>{{dataList.judgeResult}}</p>
            </div>
            <div class="temperature">
              <p
                class="monitorTitle"
                :style="{color:(dataList.alarmContent || dataList.result)=='正常'?'#333':'red'}"
              >{{dataList.alarmContent?dataList.alarmContent:dataList.result}}</p>
              <p v-if="hasSelect&& popData['alarmLevel'] && dataList.result !='正常'">
                {{dataList.alarmValue?dataList.alarmValue:dataList.result}}
                {{ (dataList.alarmContent||dataList.alarmContent)=='红外温度超过阈值'?'℃':'' }}
                <!-- {{ dataList['alarmValue']?dataList['alarmValue']+'℃':'' }} -->
                <i-dropdown
                  v-if="hasSelect && popData['alarmLevel'] && (dataList.alarmContent||dataList.alarmContent)=='红外温度超过阈值'"
                  trigger="click"
                  placement="bottom-start"
                >
                  <div
                    class="table_select"
                    :class="[{'serious': dataList.alarmLevel == 2},{'commonly': dataList.alarmLevel == 1},{'danger': dataList.alarmLevel == 3}]"
                  >
                    <span class="member_operate_div" v-if="dataList.alarmLevelName">
                      <span>{{ dataList.alarmLevelName }}</span>
                    </span>
                    <i class="iconfont icon-xiala" v-if="dataList.alarmLevelName"></i>
                  </div>
                  <i-dropdownMenu slot="list">
                    <i-dropdownItem
                      v-for="(item, index) in selectList"
                      :key="index"
                      @click.native="selectItem(dataList, index)"
                    >
                      <div class="alarmLevel">{{ item }}</div>
                    </i-dropdownItem>
                  </i-dropdownMenu>
                </i-dropdown>
              </p>
              <!-- <p v-else>{{ dataList.alarmValue }}{{ dataList.alarmValue?dataList.unit:'' }}</p> -->
            </div>
            <div class="btn-print">
              <a class="not-print origin" href="javascript:;" @click="clickJudge">结果修订</a>
              <!-- <button-custom
                v-if="showBtn"
                :class="{}"
                class="button"
                :title="titleReturn"
                @click.native="handleReturn"
              />-->
            </div>
            <div
              @click="handleReturn"
              v-if="showBtn"
              :class="titleReturn=='复归'?'showBtn':'showBtnAl'"
            >{{ titleReturn }}</div>
            <div class="from">
              <span>
                来源：
                <a
                  class="origin"
                  href="javascript:;"
                  @click="getJump"
                  style="text-decoration: underline"
                >{{dataList['monitorDeviceName']}}</a>
              </span>
            </div>
          </div>
        </div>
        <div class="handleInfo">
          <p class="monitorTitle">处理记录</p>
          <div>
            <p v-for="(item, index) in handleList" :key="index" class="item">
              <span class="title">{{ item['time'] }}</span>
              <span class="info">{{ item['info'] }}</span>
            </p>
          </div>
        </div>
        <div style="clear: both"></div>
      </el-dialog>
      <personJudge
        :dataList="formData"
        :isTemperture="discriminate"
        @on-close="onClose"
        @on-alter="initData"
        :visible="visibleJudge"
      />
    </div>
  </section>
</template>
<script>
import { Base64 } from "js-base64";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import personJudge from "_c/duno-m/personJudge";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import screenfull from "screenfull";
export default {
  components: { personJudge, KeyMonitor },
  data() {
    return {
      isPhaseAlarm: "",
      isThree: false,
      userNameD: "",
      isdeal: true,
      hasSelect: true,
      // detailsType: "",
      popData: null,
      target: null,
      searchId: "",
      searchType: "",
      visibleJudge: false,
      handleList: [],
      newVisible: false,
      selectList: ["一般", "严重", "危急"],
      alarmLevelT: "",
      alarmLevelN: "",
      newMonitorUrl: "",
      dataList: [],
      discriminate: false,
      isImgVideo: true,
      isTemperture: true,
      formData: {},
      alarmValue: null,
      showBtn: true
    };
  },
  props: {
    detailsType: {},
    userName: {},
    name: {},
    value: {},
    info: {},
    fileType: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    alarmType: {
      type: String,
      default: ""
    },
    handleNotes: {
      type: Array,
      default: () => {
        return [
          { time: "2019-06-31 12:22:32", info: "自定义文字描述" },
          { time: "2019-06-31 12:22:32", info: "自定义文字描述" },
          { time: "2019-06-31 12:22:32", info: "自定义文字描述" },
          { time: "2019-06-31 12:22:32", info: "自定义文字描述" },
          { time: "2019-06-31 12:22:32", info: "自定义文字描述" }
        ];
      }
    },
    // discriminate: {
    //   type: Boolean,
    //   default: () => {
    //     return false;
    //   }
    // },
    alarmLevel: {
      type: [String, Number],
      default: "1"
    },
    visible: {
      type: Boolean
    },
    monitorUrl: {
      type: String,
      default: () => {
        return "";
      }
    },
    warningID: {
      type: String,
      default: () => {
        return "";
      }
    },
    judgeResult: {
      type: String
    },
    origin: {
      type: String | Number,
      default: () => {
        return "";
      }
    },
    handleResult: {
      type: String
    }
  },
  computed: {},
  watch: {
    popData: {
      handler(now) {
        if (now["isPhaseAlarm"]) {
          this.isPhaseAlarm = now["isPhaseAlarm"];
          this.isThree = now["isPhaseAlarm"] == 1;
        }
        this.isRobot = now["isRobot"];
        this.isImgVideo = now["fileType"] == 1;
        if ("alarmId" in now && now["alarmId"]) {
          // this.searchId = now["alarmId"];
          this.searchId = now["taskId"] + "," + now["batchId"];
          this.searchType = "alarmId";
          if (this.isAlarmLog) {
            this.searchId = now["alarmId"];
            this.searchType = "alarmId";
          }
        } else if ("taskId" in now && now["taskId"]) {
          this.searchId = now["taskId"] + "," + now["batchId"];
          this.searchType = "alarmId";
        } else {
          this.searchId = now["resultId"];
          this.searchType = "resultId";
        }
        if (this.detailsType == "alarm") {
          this.searchId = now["id"];
          this.searchType = "id";
        }
        if (this.searchId != "" && !this.isThree) {
          this.initData();
        }
        if ("isRobot" in now && now["isRobot"]) {
          this.searchId = now["taskId"] + "," + now["batchId"];
          this.searchType = "alarmId";
        }
        if (now["isReturn"] == "1") {
          this.titleReturn = "已复归";
        } else {
          this.titleReturn = "复归";
        }
      },
      deep: true,
      immediate: true
    },
    alarmLevel: {
      handler(now) {
        this.alarmLevelN = now;
        this.alarmLevelT = this.selectList[now - 1];
      },
      deep: true,
      immediate: true
    },
    visible(now) {
      this.newVisible = now;
    }
  },
  methods: {
    getCameraPic() {
      let videoPath = this.dataList.fileAddress
        ? this.dataList.fileAddress
        : this.dataList.alarmFileAddress;
      postAxiosData("/lenovo-alarm/api/info/video/pic", {
        videoPath: videoPath,
        positionIndex: ""
      }).then(res => {
        this.ImgScreenshot = res.data.pic;
      });
    },
    handleBtn() {
      if (this.dataList.alarmTypeValue == "设备缺陷类") {
        if (this.dataList.result.indexOf("正常") > -1) {
          this.showBtn = false;
        } else {
          this.showBtn = true;
        }
      }
    },
    toPrint(e) {
      this.target = e.path[5];
    },
    changeFullScreen(target) {
      const that = this;
      screenfull.toggle(target);
    },
    initData() {
      let that = this;
      that.discriminate = false;
      that.hasSelect = true;
      let url = "/lenovo-plan/api/task-result/view";
      if (this.detailsType == "alarm") {
        url = "/lenovo-alarm/api/alarm/phase/view";
      } else if (this.detailsType == "robot") {
        url = "/lenovo-plan/api/information/overview/frame/detail";
      }
      getAxiosData(url, {
        [that.searchType]: that.searchId,
        isPhaseAlarm: that.isPhaseAlarm,
        isRobot: that.isRobot
      }).then(res => {
        that.handleList = [];
        that.dataList = res.data;
        (res.data.dealList || []).forEach(el => {
          let obj = {};
          obj.time = el.dealTime;
          obj.info = el.dealContent;
          that.handleList.push(obj);
        });
        if (
          that.dataList.alarmTypeValue == "动态环境类" ||
          that.dataList.alarmTypeValue == "设备缺陷类"
        ) {
          that.discriminate = true;
        }
        if (that.dataList.result == "正常") {
          that.hasSelect = false;
        }
        if (that.dataList.isReturn == "1") {
          this.titleReturn = "已复归";
        } else {
          this.titleReturn = "复归";
        }
        if (isNaN(that.dataList.alarmValue)) {
          that.alarmValue = that.dataList.alarmValue;
        } else {
          that.alarmValue = that.dataList.alarmValue + that.dataList.unit;
        }
        that.formData = {
          alarmId: that.searchId,
          input: that.dataList.alarmDetailType,
          inputT: that.dataList.alarmValue,
          select: that.dataList.alarmSuperDetailType,
          alarmDetailTypeCode: that.dataList.alarmDetailTypeCode,
          alarmTypeValue: that.dataList.alarmTypeValue,
          result: that.dataList.result,
          isRobot: that.isRobot
        };
        this.handleBtn();
        if (!this.isImgVideo) this.getCameraPic();
        that.$forceUpdate();
      });
    },
    selectItem(item, index) {
      this.psotAlarmData(item, index + 1);
    },
    psotAlarmData(row, No) {
      const that = this;
      const url = "/lenovo-alarm/api/alarm/level-edit";
      let oldLevel;
      let newLevel;
      if (No == "1") {
        newLevel = "一般";
      } else if (No == "2") {
        newLevel = "严重";
      } else {
        newLevel = "危急";
      }
      if (row.alarmLevel == "1") {
        oldLevel = "一般";
      } else if (row.alarmLevel == "2") {
        oldLevel = "严重";
      } else {
        oldLevel = "危急";
      }
      const query = {
        id: row.id,
        alarmLevel: No,
        oldLevel: oldLevel,
        newLevel: newLevel,
        userName: this.userNameD
      };
      putAxiosData(url, query).then(
        res => {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.initData();
          this.$emit("on-fresh");
        },
        error => {}
      );
    },
    handleClose() {
      this.newVisible = false;
      // this.$emit('change-level', item, index+1)
      this.$emit("handleClose");
    },
    getJump() {
      if (!this.$route.meta.isMain) {
        getAxiosData("/lenovo-device/api/preset/type", {
          monitorDeviceId: this.popData.monitorDeviceId
        }).then(res => {
          let supportPreset = res.data["supportPreset"];
          let monitorDeviceType = res.data["monitorDeviceType"];
          if (monitorDeviceType == 1) {
            if (supportPreset) {
              this.$router.push({
                path: "/surveillancePath/detailLight",
                query: {
                  monitorDeviceId: this.popData.monitorDeviceId
                }
              });
            } else {
              this.$router.push({
                path: "/surveillancePath/detailLightN",
                query: {
                  monitorDeviceId: this.popData.monitorDeviceId
                }
              });
            }
          } else if (monitorDeviceType == 2) {
            if (supportPreset) {
              this.$router.push({
                path: "/surveillancePath/detailRed",
                query: {
                  monitorDeviceId: this.popData.monitorDeviceId,
                  typeId: res.data["typeId"]
                }
              });
            } else {
              this.$router.push({
                path: "/surveillancePath/detailRedN",
                query: {
                  monitorDeviceId: this.popData.monitorDeviceId,
                  typeId: res.data["typeId"]
                }
              });
            }
          } else if (monitorDeviceType == 3) {
            this.$router.push({
              path: "/surveillancePath/detailEnv",
              query: {
                monitorDeviceId: this.popData.monitorDeviceId
              }
            });
          }
        });
      } else {
        this.$message.info("已在当前页");
      }
    },
    clickJudge() {
      let that = this;
      this.visibleJudge = true;
    },
    onClose() {
      this.visibleJudge = false;
    },
    handleReturn() {
      const that = this;
      if (that.titleReturn == "已复归") {
        return;
      } else {
        let url = "/lenovo-alarm/api/alarm/deal";
        const query = {
          alarmId: that.dataList.alarmId,
          type: "1"
        };
        postAxiosData(url, query).then(res => {
          if (res.data.isSuccess) {
            that.$message.success(res.msg);
            this.titleReturn = "已复归";
            that.initData();
            this.$emit("on-fresh");
          } else {
            that.$message.error(res.msg);
          }
        });
      }
    }
  },
  mounted() {
    this.searchType = Base64.decode(this.name);
    this.searchId = Base64.decode(this.value);
    this.popData = JSON.parse(Base64.decode(this.info));
    this.detailsType = Base64.decode(this.detailsType);
    this.userNameD = Base64.decode(this.userName);
    this.$store.state.user.userName = this.userNameD;
    // this.target = this.querySelectorAll('.warningDialogN')[1]
    this.newVisible = this.visible;
  }
};
</script>
<style lang="scss">
@media print {
  .not-print {
    opacity: 0;
  }
  .el-dialog__headerbtn {
    display: none;
  }
  .iconfontList {
    display: none;
  }
  .elDialogClass {
    .el-dialog--center {
      width: 710px !important;
    }
  }
  .warningDialogN .handleInfo > div {
    max-height: inherit;
  }
  .el-dialog.el-dialog--center {
    margin-top: 0vh !important;
  }
}
.warningDialogN {
  .el-dialog__close {
    display: none;
  }
  .iconfont.icon-xiala {
    color: #999999;
    font-size: 10px;
    margin-left: 3px;
  }
  .serious {
    span {
      background: #f4a723;
    }
  }
  .commonly {
    span {
      background: #5eb0fc;
    }
  }
  .danger {
    span {
      background: #d0011b;
    }
  }
  .table_select {
    cursor: pointer;
    color: #1d1f26;
    .member_operate_div {
      span {
        font-size: 14px !important;
      }
    }
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 47px !important;
      height: 24px !important;
      border-radius: 20px;
    }
    &.serious {
      span {
        background: #f4a723;
      }
    }
    &.commonly {
      span {
        background: #5eb0fc;
      }
    }
    &.danger {
      span {
        background: #d0011b;
      }
    }
  }
  .main {
    display: flex;
    .monitor {
      width: calc(50% - 25px);
      float: left;
      & > div {
        width: 100%;
        background-color: #000;
        position: relative;
        // height: 480.5px;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
        i {
          position: absolute;
          bottom: 3px;
          color: #ffffff;
          right: 9px;
          cursor: pointer;
        }
      }
    }
    .info {
      width: calc(50% - 25px);
      position: relative;
      margin-left: 50px;
      flex: 1;
      color: #333333;
      font-size: 14px;
      .info_top {
        .monitorTitle {
          font-size: 14px;
          margin-bottom: 30px;
        }
        & > p {
          margin-bottom: 17px;
        }
      }
      .temperature {
        margin-bottom: 30px;
        p {
          font-size: 20px;
          font-weight: bold;
        }
        .monitorTitle {
          margin-bottom: 17px;
        }
        & > p {
          .ivu-dropdown {
            position: relative;
            top: -2px;
            margin-left: 5px;
          }
        }
      }
      .temperature + div a {
        text-decoration: underline;
      }
      .discriminate {
        margin-top: 25px;
        .title {
          margin-bottom: 5px;
        }
        .nr {
          color: #cb0e09;
          font-size: 21px;
          font-weight: bold;
          margin-bottom: 30px;
        }
      }
      .discriminate + div a {
        text-decoration: underline;
      }
      .from {
        position: absolute;
        bottom: 0;
      }
      .origin {
        text-decoration: underline;
      }
    }
  }
  .handleInfo {
    color: #333333;
    .monitorTitle {
      margin: 14px 0;
    }
    .item {
      display: flex;
      line-height: 34px;
      padding: 0 20px;
      .title {
        margin-right: 40px;
      }
      .info {
        flex-grow: 1;
      }
      &:nth-last-child(odd) {
        background: #c7c7c7;
      }
    }
  }
  .el-dialog {
    background: #fff;
    padding: 20px 50px;
  }
  .el-dialog__header {
    background: #fff;
    text-align: left;
    padding-bottom: 0;
  }
  .el-dialog__body {
    background: #fff;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #777777;
    font-size: 22px;
    position: relative;
    top: 5px;
    left: 1px;
  }
  .title_top {
    font-weight: bold;
    text-align: left;
    /*padding-left: 48px;*/
    .iconfontList {
      float: right;
      position: relative;
      top: -3px;
      margin-right: 30px;
      .iconfont {
        font-size: 22px;
        color: #777777;
        margin-left: 12px;
        cursor: pointer;
      }
    }
  }
  .extend {
    font-size: 14px;
    margin-top: 3px;
    padding-left: 6px;
  }
  .keyMonitor {
    width: 100%;
  }
  .showBtn {
    margin-top: 10px;
    cursor: pointer;
    text-align: center;
    color: #fff;
    width: 68px;
    line-height: 32px;
    background: rgba(48, 94, 131, 1);
    opacity: 1;
    border-radius: 16px;
  }
  .showBtnAl {
    margin-top: 10px;
    color: #999;
  }
}
</style>

