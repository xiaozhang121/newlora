<template>
  <div class="alarmLog">
    <div class="img" v-if="isShowImg">
      <img
        v-if="isImgVideo"
        class="alarmLogImg"
        :src="remarkData.fileAddress?remarkData.fileAddress:remarkData.alarmFileAddress"
        alt
      />
      <cover v-else :isSecond='false' :srcData="remarkData"></cover>
    </div>
    <div class="contentMain" @click="handleWain">
      <div class="top">
        <p>
           <span v-if="securityType">车牌：</span>
           <span v-else>机器判断：</span>
          <span>{{remarkData.alarmDetailType}}</span>
        </p>
      </div>
      <div class="mainMain">
        <div>
          拍摄时间：
          <span>{{remarkData.alarmTime}}</span>
        </div>
        <div v-if="securityType">
          <i>事件：</i>
          <p>
            <span>{{ remarkData.inOut == 0 ? '入场' : '出场' }}</span>
          </p>
        </div>
        <div v-else>
          <i>处理记录：</i>
          <p>
            <span v-for="(item,index) in dealList.slice(0,2)" :key="index">{{item}}</span>
          </p>
        </div>
      </div>
      <div class="btn" v-if="!securityType">
        <p>
          来源：
          <span @click.stop="getJump" style="text-decoration: underline">{{remarkData.monitorDeviceName}}</span>
        </p>
        <p v-if="isShow">
          <i @click.stop="openRemarks">备注</i>
          <i v-if="isReturn" @click.stop="addReturn">复归</i>
          <i v-else :disabled="isDisabled" class="gray" @click.stop>已复归</i>
        </p>
        <p v-else>
          <i>查看详情></i>
        </p>
      </div>
    </div>
    <Remarks :isShow="dialogVisible" :alarmId="alarmId" @beforeClose="beforeClose" />
    <wraning
      detailsType="alarm"
      :isAlarmLog="true"
      :popData="remarkData"
      :modalBody="false"
      :visible="visible"
      @handleClose="handleClose"
    />
  </div>
</template>

<script>
import { postAxiosData, getAxiosData } from "@/api/axiosType";
import moment from "moment";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Remarks from "_c/duno-c/Remarks";
import cover from "_c/duno-c/cover";
import buttonCustom from "_c/duno-m/buttonCustom";
import wraning from "_c/duno-j/warning";
import { dealRemarks } from "@/api/configuration/configuration.js";
export default {
  name: "AlarmLog",
  components: { KeyMonitor, cover, buttonCustom, Remarks, wraning },
  props: {
    noButton: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    autoplay: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    isShow: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    remarkData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    content: {
      type: String
    }
  },
  data() {
    return {
      isImgVideo: true,
      address: "",
      isDisabled: true,
      dialogVisible: false,
      isShowRemarks: false,
      visible: false,
      isReturn: true,
      isShowImg:true,
      dealList: [],
      alarmId: ""
    };
  },
  computed: {
    securityType(){
      return this.remarkData['securityType'] == 1
    }
  },
  watch: {
    remarkData: {
      handler(now) {
        this.isImgVideo = now["fileType"] == 1;
        if (now.isReturn == "1") {
          this.isReturn = false;
        }
        this.alarmId = `${now.alarmId}`;
        this.dealList = [];
        this.handleDeal(now.dealList);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleDeal(item) {
      item.forEach(el => {
        let str = el.dealType + " (" + el.dealTime + ")";
        this.dealList.push(str);
        this.$forceUpdate;
      });
    },
    openRemarks() {
      this.alarmId = `${this.remarkData.alarmId}`;
      this.dialogVisible = true;
    },
    handleClose() {
      this.visible = false;
    },
    handleWain() {
      this.visible = true;
    },
    addReturn() {
      const that = this;
      const query = {
        alarmId: that.remarkData.alarmId,
        type: "1"
      };
      dealRemarks(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
        this.isReturn = false;
      });
      this.$emit("handleListData");
    },
    beforeClose() {
      this.dialogVisible = false;
      this.$emit("handleListData");
    },
    getJump() {
      getAxiosData("/lenovo-device/api/preset/type", {
        monitorDeviceId: this.remarkData["monitorDeviceId"]
      }).then(res => {
        this.$router.push({
          path: "/surveillancePath/detailEnv",
          query: {
            monitorDeviceId: this.remarkData.monitorDeviceId
          }
        });
      });
    },
    getWidth() {
      let screen = window.screen.availWidth;
      if (screen > 3500) {
        this.isShowImg=false
      }
    }
  },
  mounted() {
    this.getWidth();
  }
};
</script>


<style lang="scss">
.alarmLog {
  float: left;
  margin-bottom: 20px;
  width: calc(50% - 10px);
  margin-left: 20px;
  height: 180px;
  background-color: #203644;
  border-radius: 2px;
  display: flex;
  justify-content: space-around;
  .img {
    width: 40%;
    height: 180px;
    position: relative;
    .alarmLogImg {
      width: 100%;
      height: 100%;
      background: grey;
      position: absolute;
    }
    .keyMonitor {
      width: 100% !important;
    }
    .cover {
      height: 180px;
      &>div:first-child{
        position: static;
      } 
    }
  }
  .contentMain {
    cursor: pointer;
    width: 60%;
    /*padding: 20px 10px;*/
    padding: 0px 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    @media screen and (min-width: 3000px) {
        width: 100%;
        padding: 20px;
    }
    @media screen and (max-width: 1366px) {
        width: 100%;
        padding: 20px;
    }
    .top {
      p {
        font-size: 16px;
        color: #ffffff;
        span {
          // padding-left: 5px;
        }
      }
    }
    .mainMain {
      margin-top: 5px;
      div {
        font-size: 12px;
        color: #ffffff;
        display: flex;
        justify-content: flex-start;
        white-space: nowrap;
        i {
          font-style: normal;
        }
        p {
          span {
            display: block;
          }
        }
      }
      & > div:nth-child(2) {
        margin-top: 2px;
        height: 36px;
        i {
          width: 56px;
        }
        p {
          width: 88%;
          margin-left: 4px;
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .btn {
      margin-top: 5px;
      line-height: 32px;
      p {
        font-size: 13px;
        color: #ffffff;
        span {
          cursor: pointer;
          color: #3baddf;
          padding-left: 5px;
        }
        i {
          cursor: pointer;
          float: right;
          font-style: normal;
          display: block;
          padding: 0 15px;
          background-color: #3a81a1;
          border-radius: 16px;
          margin-left: 10px;
          text-align: center;
        }
        i:last-child {
          background-color: #305e83;
        }
        .gray {
          background-color: #979797 !important;
          color: #767676;
        }
      }
    }
  }
}
</style>
