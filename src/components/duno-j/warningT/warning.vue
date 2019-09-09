<template>
  <div class="warningDialog three warningT" v-if="newVisible && isThree && Object.keys(dataList).length">
    <el-dialog destroy-on-close :close-on-click-modal="false"  class="elDialogClass" :visible="newVisible" width="900px" center @close="handleClose">
      <div slot="title">
        <div class="title_top">
          <span>
            <p>{{ dataList['title'] }}</p>
            <p>{{ dataList['alarmTypeValue']}}</p>
          </span>
          <span class="iconList">
            <i class="iconfont icon-dayin" @click="toPrint($event)"  v-print="target"></i>
            <i class="iconfont icon-wangye" @click="openPage()"></i>
          </span>
        </div>
        <!--<div class="extend">{{ dataList.alarmTypeValue }}</div>-->
      </div>
      <div class="main">
        <div class="monitor">
          <span class="img"><img :src="dataList['alarmFileAddress'].split('||')[0]" alt /></span>
          <span class="img"><img :src="dataList['alarmFileAddress'].split('||')[1]" alt /></span>
          <span class="img"><img :src="dataList['alarmFileAddress'].split('||')[2]" alt /></span>
        </div>
        <div class="info">
          <div class="info_item">
            <div class="info_title">
              判定结果：
            </div>
            <div class="info_main">
              <p>{{ dataList.alarmDetailType }}</p>
              <p class="bold">
                <span :class="{'red': dataList['phaseData'].split('||')[0].indexOf('\'')>-1}">{{ dataList['phaseData'].split('||')[0].replace('\'','') }}</span>
                <span :class="{'red': dataList['phaseData'].split('||')[1].indexOf('\'')>-1}">{{ dataList['phaseData'].split('||')[1].replace('\'','') }}</span>
                <span :class="{'red': dataList['phaseData'].split('||')[2].indexOf('\'')>-1}">{{ dataList['phaseData'].split('||')[2].replace('\'','') }}</span>
              </p>
              <p class="alarmType">
                <span v-if="dataList['alarmContent']">{{ dataList['alarmContent'] }}</span>
                <span class="from" @click="clickJudge()">结果修订</span>
                <span style="visibility: hidden" class="from" @click="showDiff()">差值修订</span>
              </p>
            </div>
          </div>
          <div class="info_item">
            <div class="info_title">
              来源：
            </div>
            <div class="info_main">
              <p class="from" @click="getJump">{{dataList['monitorDeviceName']}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="handleInfo">
        <div>
          <p class="monitorTitle">处理记录</p>
          <div class="monitorMain">
          <p v-for="(item, index) in handleList" :key="index" class="item">
            <span class="title">{{ item['time'] }}</span>
            <span class="info">{{ item['info'] }}</span>
          </p>
          </div>
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
    <diff-panel :visible="visibleDiff" @on-close="closeDiff" />
  </div>
</template>
<script>
import { Base64 } from 'js-base64'
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import personJudge from "_c/duno-m/personJudge";
import diffPanel  from '_c/duno-m/diffPanel'
export default {
  components: { personJudge, diffPanel },
  data() {
    return {
      formData: {},
      isPhaseAlarm: '',
      visibleDiff: false,
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
      dataList: {},
      alarmValue: '',
      hasSelect: false,
      discriminate: false
    };
  },
  props: {
    isThree:{
        type: Boolean,
        default: () => {
            return false;
        }
    },
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
    },
    detailsType: {
        type: String,
        default: () => {
            return "task";
        }
    }
  },
  computed: {},
  watch: {
    popData(now) {
        this.isPhaseAlarm = now['isPhaseAlarm']
        if ("alarmId" in now && now["alarmId"]) {
            // this.searchId = now["alarmId"];
            this.searchId = now["taskId"] + "," + now["batchId"];
            this.searchType = "alarmId";
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
        if (this.searchId != "" && this.isThree) {
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
    showDiff(){
        this.visibleDiff = true
    },
    closeDiff(){
        this.visibleDiff = false
        if(this.isThree)
          this.initData()
    },
    openPage(){
        let routeData = this.$router.resolve({
            name: "newPageT",
            params: {
                name: Base64.encode(this.searchType),
                value: Base64.encode(this.searchId),
                info: Base64.encode(JSON.stringify(this.popData)),
                detailsType: Base64.encode(this.detailsType),
                userName: Base64.encode(this.$store.state.user.userName)
            }
        });
        window.open(routeData.href, "_blank");
    },
    toPrint(e){
        this.target = e.path[5]
    },
    onClose(){
        this.visibleJudge = false
        if(this.isThree)
          this.initData()
        this.$emit('on-fresh')
    },
    initData() {
          let that = this;
          that.discriminate = false;
          that.hasSelect = true;
          let url = "/lenovo-plan/api/task-result/view";
          if (this.detailsType == "alarm") {
              url = "/lenovo-alarm/api/alarm/phase/view";
          }
          getAxiosData(url, {
              [that.searchType]: that.searchId,
              'isPhaseAlarm': that.isPhaseAlarm
          }).then(res => {
              that.handleList = [];
              if(res.data['fileAddress'])
                res.data['alarmFileAddress'] =  res.data['fileAddress']
              that.dataList = res.data;
              (res.data.dealList || []).forEach(el => {
                  let obj = {};
                  obj.time = el.dealTime;
                  obj.info = el.dealType;
                  that.handleList.push(obj);
              });
              console.log(that.handleList);
              if (that.handleList.length < 1) {
                  that.isdeal = false;
              }
              if (that.dataList.alarmTypeValue == "动态环境类") {
                  that.discriminate = true;
              }
              if (that.dataList.result == "温度正常") {
                  that.hasSelect = false;
              }
              if (isNaN(that.dataList.alarmValue)) {
                  that.alarmValue = that.dataList.alarmValue;
              } else {
                  that.alarmValue = that.dataList.alarmValue + "℃";
              }
              that.formData = {
                  alarmId: that.searchId,
                  input: that.dataList.alarmDetailType,
                  inputT: that.dataList.alarmValue,
                  select: that.dataList.alarmSuperDetailType,
                  alarmDetailTypeCode: that.dataList.alarmDetailTypeCode,
                  result: that.dataList.result
              };
              that.$forceUpdate();
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
                          monitorDeviceId: this.popData.monitorDeviceId,
                          typeId: res.data["typeId"]
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
      //   debugger;
      this.visibleJudge = true;
    }
  },
  beforeDestroy(){
      this.dataList = {}
  },
  mounted() {
    this.newVisible = this.visible;
  }
};
</script>
<style lang="scss">
.three{
  .el-dialog__close{
    left: 5px;
  }
  .el-dialog__headerbtn{
    right: 14px;
    top: 20px !important;
  }
}
.warningDialog.three .handleInfo > div{
  max-height: 200px;
  height: inherit !important;
  overflow-y: hidden;
}
.warningDialog.three {
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
  .el-dialog__body{
    padding: 25px 21px 30px !important;
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
    flex-direction: column;
    .monitor {
      width: 85%;
      height: 130px;
      background-color: inherit !important;
      display: flex;
      .img{
        width: 100%;
        max-width: 230px;
        height: 100%;
        margin-right: 20px;
        display: block;
        background: black;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
    .info {
      position: relative;
      margin-left: 0px;
      flex: 1;
      color: #333333;
      font-size: 14px;
      .from{
        color: #3774fe;
        text-decoration: underline;
        position: inherit;
        cursor: pointer;
        bottom: inherit;
      }
      .info_item{
        display: flex;
        margin-top: 20px;
        line-height: 31px;
        .info_title{
          text-align: right;
          width: 71px;
          margin-right: 30px;
        }
        .info_main{
            .bold{
              font-size: 20px;
              font-weight: bold;
              margin: 4px 0;
              .red{
                color: red;
              }
              span{
                margin-right: 40px;
              }
            }
          .alarmType{
            span{
              margin-right: 40px;
              &.from{
                cursor: pointer;
              }
            }
          }
        }
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
      margin-top: 40px;
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
    text-align: left;
    & > span:first-child{
        p:last-child{
          color: #969696;
          font-size: 15px;
        }
    }
    .iconList{
      position: absolute;
      right: 33px;
      top: 20px;
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

