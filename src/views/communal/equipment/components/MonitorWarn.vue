<template>
  <div class="alarmLog">
    <div class="img not-print">
      <img :src="remarkData.pic" alt />
    </div>
    <div class="content not-print" @click="handleWain">
      <div class="top not-print">
        <p>
          监测对象:
          <span>{{remarkData.powerDeviceName}}</span>
        </p>
      </div>
      <div class="milldle">
        <div>
          部位:
          <span>{{remarkData.part}}</span>
        </div>
        <div>
          内容:
          <span>{{remarkData.content}}</span>
        </div>
        <div>
          <i>记录:</i>
          <el-tooltip class="item" effect="dark" :content="dealContent[0]" placement="top">
            <p>
              <span v-for="(item,index) in dealContent.slice(0,1)" :key="index">{{item}}</span>
            </p>
          </el-tooltip>
        </div>
      </div>
      <div class="btn">
        <p>
          来源:
          <el-tooltip :content="remarkData.monitorDeviceName" placement="top">
            <span @click.stop="getJump" style="text-decoration: underline">{{remarkData.monitorDeviceName}}</span>
          </el-tooltip>
        </p>
        <p v-if="remarkData.isAlarm==1">
          <i @click.stop="openRemarks">备注</i>
          <i v-if="isReturn" @click.stop="addReturn">复归</i>
          <i v-else :disabled="isDisabled" @click.stop class="gray">已复归</i>
        </p>
        <p v-else>
          <i>查看详情></i>
        </p>
      </div>
    </div>
    <Remarks
      :isShow="dialogVisible"
      :overview="overview"
      :alarmId="alarmId"
      :isRobot="isRobot"
      @beforeClose="beforeClose"
    />
    <wraning v-if="visible" :popData="remarkData" :visible="visible" @handleClose="handleClose" />
  </div>
</template>

<script>
import { postAxiosData, getAxiosData } from "@/api/axiosType";
import moment from "moment";
import Remarks from "_c/duno-c/Remarks";
import wraning from "_c/duno-j/warning";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import buttonCustom from "_c/duno-m/buttonCustom";
import { dealRemarks } from "@/api/configuration/configuration.js";
export default {
  name: "AlarmLog",
  components: { KeyMonitor, buttonCustom, wraning, Remarks },
  props: {
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
    },
    overview: {
      type: String
    }
  },
  watch: {
    remarkData: {
      handler(now) {
        if (now.isReturn == "1") {
          this.isReturn = false;
        }
        this.alarmId = `${now.taskId},${now.batchId}`;
        this.isRobot = now.isRobot;
        // this.dealList = now.dealList;
        this.handleDeal(now.dealList);
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      address: "",
      isDisabled: true,
      dialogVisible: false,
      visible: false,
      isReturn: true,
      alarmId: "",
      isRobot: "",
      dealContent: []
    };
  },
  methods: {
    handleDeal(item) {
      if (item) {
        item.forEach(el => {
          let str = el.dealType + " (" + el.dealTime + ")";
          this.dealList.push(str);
        });
      }
    },
    openRemarks() {
      this.alarmId = `${this.remarkData.taskId},${this.remarkData.batchId}`;
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
      let query = {
        alarmId: that.remarkData.taskId + "," + that.remarkData.batchId,
        type: "1"
      };
      dealRemarks(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
        this.isReturn = false;
      });
      this.$emit("beforeClose");
    },
    beforeClose() {
      this.dialogVisible = false;
      this.$emit("handleListData");
    },
    getJump() {
      getAxiosData("/lenovo-device/api/preset/type", {
        monitorDeviceId: this.remarkData.monitorDeviceId
      }).then(res => {
        let supportPreset = res.data["supportPreset"];
        let monitorDeviceType = res.data["monitorDeviceType"];
        if (monitorDeviceType == 1  || monitorDeviceType == 5) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailLight",
              query: {
                monitorDeviceId: this.remarkData.monitorDeviceId
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailLightN",
              query: {
                monitorDeviceId: this.remarkData.monitorDeviceId
              }
            });
          }
        } else if (monitorDeviceType == 2) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailRed",
              query: {
                monitorDeviceId: this.remarkData.monitorDeviceId,
                typeId: res.data["typeId"]
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailRedN",
              query: {
                monitorDeviceId: this.remarkData.monitorDeviceId,
                typeId: res.data["typeId"]
              }
            });
          }
        } else if (monitorDeviceType == 3  || monitorDeviceType == 9) {
          this.$router.push({
            path: "/surveillancePath/detailEnv",
            query: {
              monitorDeviceId: this.remarkData.monitorDeviceId
            }
          });
        }else if (monitorDeviceType == 6) {
          this.$router.push({
            path: "/surveillancePath/detailUbiquitou",
            query: {
              monitorDeviceId: this.remarkData.monitorDeviceId
            }
          });
        }
      });
    },
    handledata() {
      if (this.remarkData.dealRecord) {
        this.remarkData.dealRecord.forEach(el => {
          let str = el.dealContent + (el.dealTime?" (" + el.dealTime + ")":'');
          this.dealContent.push(str);
        });
      }
    }
  },
  mounted() {
    this.handledata();
  }
};
</script>


<style lang="scss">
.alarmLog {
  float: left;
  margin-bottom: 20px;
  width: calc(50% - 10px);
  margin-left: 20px;
  height: 200px;
  background-color: #203644;
  border-radius: 2px;
  display: flex;
  justify-content: space-around;
  .img {
    width: 40%;
    height: 100%;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .content {
    cursor: pointer;
    width: 60%;
    padding: 10px 20px;
    .top {
      p {
        font-size: 16px;
        color: #ffffff;
        span {
          padding-left: 5px;
        }
      }
    }
    .milldle {
      div {
        font-size: 13px;
        color: #ffffff;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        & > span {
          padding-left: 10px;
        }
        i {
          white-space: nowrap;
          font-style: normal;
          width: 32px;
        }
        .item {
          p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        p {
          width: 90%;
          padding-left: 8px;
          span {
            display: block;
          }
        }
      }
    }
    .btn {
      p {
        // padding-top: 10px;
        font-size: 14px;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
          //   width: 68px;
          padding: 0 20px;
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
      & > p:nth-child(2) {
        line-height: 32px;
        margin-top: 18px;
        @media screen and (max-width: 1366px) {
        margin-top: 5px;
      }
      @media screen and (min-width: 3500px) {
        margin-top: 5px;
      }
      }
    }
  }
}
</style>
