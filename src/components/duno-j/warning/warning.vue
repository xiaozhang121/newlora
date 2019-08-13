<template>
  <section class="warningDialog">
    <div>
      <el-dialog :visible="newVisible" width="900px" center @close="handleClose">
        <div slot="title">
          <div class="title_top">
            <span>{{ dataList.title }}</span>
            <span class="iconfontList">
              <!--<i class="iconfont icon-xiazai"></i>-->
              <i class="iconfont icon-dayin" @click="toPrint($event)" v-print="target"></i>
              <i class="iconfont icon-wangye" @click="openPage()"></i>
            </span>
          </div>
          <div class="extend">{{ dataList.alarmTypeValue }}</div>
        </div>
        <div class="main">
          <div class="monitor" ref="imgContain">
            <img v-if="isImgVideo" :src="dataList.fileAddress" alt />
            <KeyMonitor v-else width="100%" :streamAddr="dataList.fileAddress" />
            <i
              class="fullScreen iconfont icon-quanping"
              @click="changeFullScreen($refs.imgContain)"
            ></i>
          </div>
          <div class="info">
            <div class="info_top">
              <p class="monitorTitle">判定结果:</p>
              <p>{{dataList.powerDeviceName}}</p>
            </div>
            <div v-if="!discriminate" class="temperature">
              <p class="monitorTitle">{{dataList.result}}</p>
              <p>
                {{ popData['alarmValue']?popData['alarmValue']+'℃':'' }}
                <i-dropdown
                  v-if="hasSelect && !discriminate"
                  trigger="click"
                  placement="bottom-start"
                >
                  <div
                    class="table_select"
                    :class="[{'serious': alarmLevelN == 2},{'commonly': alarmLevelN == 1},{'danger': alarmLevelN == 3}]"
                  >
                    <span class="member_operate_div">
                      <span>{{ alarmLevelT }}</span>
                    </span>
                    <i class="iconfont icon-xiala"></i>
                  </div>
                  <i-dropdownMenu slot="list">
                    <i-dropdownItem
                      v-for="(item, index) in selectList"
                      :key="index"
                      @click.native="selectItem(item, index)"
                    >
                      <div class="alarmLevel">{{ item }}</div>
                    </i-dropdownItem>
                  </i-dropdownMenu>
                </i-dropdown>
              </p>
            </div>
            <div v-else class="discriminate">
              <div class="title">识别</div>
              <div class="nr">{{ dataList.result }}</div>
            </div>
            <div>
              <a href="javascript:;" @click="clickJudge">结果修订</a>
            </div>
            <div class="from">
              <span class="origin">
                来源：
                <a href="javascript:;" @click="getJump">{{popData['monitorDeviceId']}}</a>
              </span>
            </div>
          </div>
        </div>
        <div class="handleInfo">
          <!-- <div>
            <p class="monitorTitle">处理记录</p>
            <p v-for="(item, index) in handleList" :key="index" class="item">
              <span class="title">{{ item['time'] }}</span>
              <span class="info">{{ item['info'] }}</span>
            </p>
          </div>-->
        </div>
        <div style="clear: both"></div>
      </el-dialog>
      <personJudge
        :data="formData"
        :isTemperture="isTemperture"
        @on-close="onClose"
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
      formData: {}
    };
  },
  props: {
    fileType: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    popData: {
      type: Object,
      default: () => {
        return {};
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
    hasSelect: {
      type: Boolean,
      default: () => {
        return false;
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
    popData(now) {
      if ("alarmId" in now && now["alarmId"]) {
        // this.searchId = now["alarmId"];
        this.searchId = now["alarmId"];
        this.searchType = "alarmId";
      } else if ("taskId" in now && now["taskId"]) {
        this.searchId = now["taskId"] + "," + now["batchId"];
        this.searchType = "alarmId";
      } else {
        this.searchId = now["resultId"];
        this.searchType = "resultId";
      }
      console.log(this.searchId);
      if (this.searchId != "") {
        this.initData();
      }
    },
    // handleNotes(now) {
    //   this.handleList = [];
    //   let obj = {};
    //   now.forEach(el => {
    //     obj.time = el.dealTime;
    //     obj.info = el.dealType;
    //     this.handleList.push(obj);
    //   });
    // },
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
    openPage() {
      let routeData = this.$router.resolve({
        name: "newPage",
        params: {
          name: Base64.encode(this.searchType),
          value: Base64.encode(this.searchId),
          info: Base64.encode(JSON.stringify(this.popData))
        }
      });
      window.open(routeData.href, "_blank");
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
      getAxiosData("/lenovo-plan/api/task-result/view", {
        [that.searchType]: that.searchId
      }).then(res => {
        debugger;
        that.dataList = res.data;
        let obj = {};
        (res.data.dealList || []).forEach(el => {
          obj.time = el.dealTime;
          obj.info = el.dealType;
          that.handleList.push(obj);
        });
        if (that.dataList.alarmTypeValue == "动态环境类") {
          that.discriminate = true;
        }
        // debugger;
        that.formData = {
          alarmId: that.searchId,
          input: that.dataList.result,
          inputT: that.dataList.alarmValue,
          select: that.dataList.alarmType
        };
      });
    },
    selectItem(item, index) {
      this.alarmLevelT = item;
      this.alarmLevelN = index + 1;
    },
    handleClose() {
      this.newVisible = false;
      // this.$emit('change-level', item, index+1)
      this.$emit("handleClose");
    },
    getJump() {
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
          this.$router.push({
            path: "/surveillancePath/detailRedN",
            query: {
              monitorDeviceId: this.popData.monitorDeviceId
            }
          });
        } else if (monitorDeviceType == 3) {
          this.$router.push({
            path: "/surveillancePath/detailEnv",
            query: {
              monitorDeviceId: this.popData.monitorDeviceId
            }
          });
        }
      });
    },
    clickJudge() {
      if (this.dataList.alarmValue == "") {
        this.isTemperture = false;
      } else {
        this.isTemperture = true;
      }
      this.visibleJudge = true;
    },
    onClose() {
      this.visibleJudge = false;
    }
  },
  mounted() {
    // this.target = this.querySelectorAll('.warningDialog')[1]
    this.newVisible = this.visible;
  }
};
</script>
<style lang="scss">
@media print {
  .not-print {
    opacity: 0;
  }
}
.warningDialog {
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
      width: 540px;
      height: 303.75px;
      background-color: #000;
      position: relative;
      float: left;
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
    .info {
      position: relative;
      margin-left: 25px;
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
    background: #e0e0e0;
  }
  .el-dialog__header {
    text-align: left;
    padding-bottom: 0;
  }
  .title_top {
    font-weight: bold;
    .iconfontList {
      float: right;
      position: relative;
      top: -3px;
      margin-right: 30px;
      .iconfont {
        color: #95939d;
        margin-left: 12px;
        cursor: pointer;
      }
    }
  }
  .extend {
    font-size: 14px;
    margin-top: 3px;
  }
  .keyMonitor {
    width: 100%;
  }
}
</style>

