<template>
  <div class="warningDialog robot">
    <el-dialog :close-on-click-modal="false"  class="elDialogClass" :visible="newVisible" width="900px" center @close="handleClose">
      <div slot="title">
        <div class="title_top">
          <span>{{ (warnData.deviceName?warnData.deviceName:'')+'-'+ (warnData.recognType?warnData.recognType:'')}}</span>
          <span class="iconList">
            <i class="iconfont icon-dayin" @click="toPrint($event)"  v-print="target"></i>
            <i class="iconfont icon-wangye" @click="openPage()"></i>
          </span>
        </div>
        <!--<div class="extend">{{ dataList.alarmTypeValue }}</div>-->
      </div>
      <div class="main">
        <div class="monitor">
          <img :src="warnData['taskCurLinkImg']" alt />
        </div>
        <div class="info">
          <div class="info_top">
            <p class="monitorTitle">判定结果:</p>
            <p>{{dataList.alarmType}}</p>
          </div>
          <div v-if="!discriminate" class="temperature">
            <!--<p class="monitorTitle">温度正常</p>-->
            <p>
              {{ warnData['valueShow'] }}
              <!--<i-dropdown-->
                <!--v-if="hasSelect && !discriminate"-->
                <!--trigger="click"-->
                <!--placement="bottom-start"-->
              <!--&gt;-->
                <!--<div-->
                  <!--class="table_select"-->
                  <!--:class="[{'serious': alarmLevelN == 2},{'commonly': alarmLevelN == 1},{'danger': alarmLevelN == 3}]"-->
                <!--&gt;-->
                  <!--<span class="member_operate_div">-->
                    <!--<span>{{ alarmLevelT }}</span>-->
                  <!--</span>-->
                  <!--<i class="iconfont icon-xiala"></i>-->
                <!--</div>-->
                <!--<i-dropdownMenu slot="list">-->
                  <!--<i-dropdownItem-->
                    <!--v-for="(item, index) in selectList"-->
                    <!--:key="index"-->
                    <!--@click.native="selectItem(item, index)"-->
                  <!--&gt;-->
                    <!--<div class="alarmLevel">{{ item }}</div>-->
                  <!--</i-dropdownItem>-->
                <!--</i-dropdownMenu>-->
              <!--</i-dropdown>-->
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
              <a href="javascript:;" @click="getJump">机器人</a>
            </span>
          </div>
        </div>
      </div>
      <div class="handleInfo">
        <div>
          <p class="monitorTitle">处理记录</p>
          <div class="monitorMain">
          <p v-for="(item, index) in warnData['manualJudgeLog']" :key="index" class="item">
            <span class="title">{{ item['createTime'] }}</span>
            <span class="info">{{ item['manualRecognType']+'  '+item['manualValueShow'] }}</span>
          </p>
          </div>
        </div>
      </div>
      <div style="clear: both"></div>
    </el-dialog>
    <personJudge @on-close="onClose" :visible="visibleJudge" :taskCurreny="{taskDeviceId: $route.query.taskDeviceId}" :dataType="warnData['recognType']" :analysisResult="warnData['valueShow']" />
  </div>
</template>
<script>
import { Base64 } from 'js-base64'
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import personJudge  from '_c/duno-m/personJudgeRobot'
export default {
  components: { personJudge },
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
      discriminate: false
    };
  },
  props: {
    dataBread:{},
    warnData:{},
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
      if ("alarmId" in now) {
        this.searchId = now["alarmId"];
        this.searchType = "alarmId";
      } else {
        this.searchId = now["resultId"];
        this.searchType = "resultId";
      }
      this.initData();
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
    openPage(){
        sessionStorage.setItem('datainfo', Base64.encode(JSON.stringify(this.popData)))
        sessionStorage.setItem('info', Base64.encode(JSON.stringify(this.warnData)))
        let routeData = this.$router.resolve({ name: 'newPageRobot', params: { datainfo:Base64.encode(JSON.stringify('1')),info:Base64.encode(JSON.stringify('1')), bread: Base64.encode(JSON.stringify(this.dataBread)), taskDeviceId: this.$route.query.taskDeviceId?this.$route.query.taskDeviceId:' '} });
        window.open(routeData.href, '_blank');
    },
    toPrint(e){
        this.target = e.path[5]
    },
    onClose(){
        this.visibleJudge = false
        this.$emit('on-fresh')
    },
    initData() {
      //   debugger;
      getAxiosData("/lenovo-plan/api/task-result/view", {
        [this.searchType]: this.searchId
      }).then(res => {
        this.dataList = res.data;
        let obj = {};
        res.data.dealList.forEach(el => {
          obj.time = el.dealTime;
          obj.info = el.dealType;
          this.handleList.push(obj);
        });

        if (this.dataList.alarmTypeValue == "动态环境类") {
          this.discriminate = true;
        }
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
      if (this.popData.monitorDeviceType == "1") {
        this.$router.push({
          path: "/surveillancePath/detailLight",
          query: {
            monitorDeviceId: this.popData.monitorDeviceId
          }
        });
      } else if (this.popData.monitorDeviceType == "2") {
        this.$router.push({
          path: "/surveillancePath/detailRed",
          query: {
            monitorDeviceId: this.popData.monitorDeviceId
          }
        });
      }
    },
    clickJudge() {
      //   debugger;
      this.visibleJudge = true;
    }
  },
  mounted() {
    this.newVisible = this.visible;
  }
};
</script>
<style lang="scss">
.robot{
  .el-dialog__close{
    left: 5px;
  }
  .el-dialog__headerbtn{
    right: 14px;
    top: 20px;
  }
}
.warningDialog.robot .handleInfo > div{
  max-height: 200px;
  height: inherit !important;
  overflow-y: auto;
}
.warningDialog {
  @media print {
    .not-print {
      opacity: 0;
    }
    .el-dialog__headerbtn{
      display: none;
    }
    .iconList{
      display: none;
    }
    .elDialogClass {
      .el-dialog--center {
        width: 710px !important;
      }
    }
    .warningDialog .handleInfo > div{
      max-height: inherit;
    }
    .el-dialog.el-dialog--center{
      margin-top: 0vh !important;
    }
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
      width: 540px;
      height: 303.75px;
      background-color: #000;
      float: left;
      img {
        width: 100%;
        height: 100%;
        display: block;
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
    .monitorMain{
      max-height: 300px;
      overflow-y: auto;
    }
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
    .iconList{
      position: absolute;
      right: 33px;
      .iconfont{
        font-size: 22px;
        cursor: pointer;
        color: #909399;
        margin-right: 10px;
      }
    }
  }
  .extend {
    font-size: 14px;
    margin-top: 3px;
  }
}
</style>

