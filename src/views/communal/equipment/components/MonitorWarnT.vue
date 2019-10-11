<template>
  <div class="alarmLogT">
    <div class="img not-print">
      <span class="item">
        <img :src="remarkData.pic.split('||')[0]" alt />
        <span
          :class="{'red': remarkData['phaseData'].split('||')[0].indexOf('\'')>-1}"
        >{{ remarkData['phaseData'].split('||')[0].replace('\'','') }}</span>
      </span>
      <span class="item">
        <img :src="remarkData.pic.split('||')[1]" alt />
        <span
          :class="{'red': remarkData['phaseData'].split('||')[1].indexOf('\'')>-1}"
        >{{ remarkData['phaseData'].split('||')[1].replace('\'','') }}</span>
      </span>
      <span class="item">
        <img :src="remarkData.pic.split('||')[2]" alt />
        <span
          :class="{'red': remarkData['phaseData'].split('||')[2].indexOf('\'')>-1}"
        >{{ remarkData['phaseData'].split('||')[2].replace('\'','') }}</span>
      </span>
    </div>
    <div class="content not-print" @click="handleWain">
      <div class="top not-print">
        <p>
          监测对象:
          <span>{{remarkData.powerDeviceName}}</span>
          <!--<span>4号主变500千伏测压变</span>-->
        </p>
      </div>
      <div class="milldle">
        <div>
          内容:
          <span>{{remarkData.content}}</span>
          <!--<span>三项告警</span>-->
        </div>
      </div>
      <div class="btn">
        <p></p>
        <p v-if="isShow">
          <i @click.stop="openRemarks">备注</i>
          <i v-if="isReturn" @click.stop="addReturn">复归</i>
          <i v-else :disabled="isDisabled" class="gray">已复归</i>
        </p>
        <p v-else>
          <i>查看详情></i>
        </p>
      </div>
    </div>
    <!-- <div class="remarks not-print">
      <el-dialog
        title="备注"
        :center="true"
        top="20vh"
        :visible.sync="dialogVisible"
        :modal="false"
        width="500px"
         :before-close="beforeClose"
      >
        <el-input
          type="textarea"
          placeholder="请输入备注内容"
          :autosize="{ minRows: 3}"
          v-model="textarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <button-custom class="button" @click.native="closeRemarks" title="取消" />
          <button-custom class="button" @click.native="clickRemarks" title="确定" />
        </span>
      </el-dialog>
    </div>-->
    <Remarks
      class="not-print"
      :isShow="dialogVisible"
      :alarmId="alarmId"
      @beforeClose="beforeClose"
    />
    <wraning :popData="remarkData" :visible="visible" @handleClose="handleClose" />
  </div>
</template>

<script>
import { postAxiosData, getAxiosData } from "@/api/axiosType";
import moment from "moment";
import Remarks from "_c/duno-c/Remarks";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import buttonCustom from "_c/duno-m/buttonCustom";
import { dealRemarks } from "@/api/configuration/configuration.js";
export default {
  name: "AlarmLogT",
  components: { KeyMonitor, buttonCustom, Remarks },
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
    }
  },
  data() {
    return {
      isReturn: true,
      alarmId: "",
      address: "",
      isDisabled: true,
      dialogVisible: false,
      visible: false,
      textarea: "",
      dealContent: []
    };
  },
  watch: {
    remarkData: {
      handler(now) {
        if (now.isReturn == "1") {
          this.isReturn = false;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
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
      this.$emit("handleListData");
    },
    // closeRemarks() {
    //   this.dialogVisible = false;
    // },
    openRemarks() {
      this.alarmId = `${this.remarkData.taskId},${this.remarkData.batchId}`;
      this.dialogVisible = true;
    },
    beforeClose() {
      this.dialogVisible = false;
    },
    // clickRemarks() {
    //   const that = this;
    //   this.dialogVisible = false;
    //   let query = {
    //     alarmId: that.remarkData.taskId + "," + that.remarkData.batchId,
    //     type: "2",
    //     content: that.textarea
    //   };
    //   dealRemarks(query).then(res => {
    //       that.textarea = "";
    //     if (res.data.isSuccess) that.$message.success(res.msg);
    //     else that.$message.error(res.msg);
    //     this.$emit("handleListData");
    //   });
    // },
    getJump() {
      getAxiosData("/lenovo-device/api/preset/type", {
        monitorDeviceId: this.remarkData.monitorDeviceId
      }).then(res => {
        let supportPreset = res.data["supportPreset"];
        let monitorDeviceType = res.data["monitorDeviceType"];
        if (monitorDeviceType == 1) {
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
            }else{
                this.$router.push({
                    path: "/surveillancePath/detailRedN",
                    query: {
                        monitorDeviceId: this.remarkData.monitorDeviceId,
                        typeId: res.data["typeId"]
                    }
                });
            }
        } else if (monitorDeviceType == 3) {
          this.$router.push({
            path: "/surveillancePath/detailEnv",
            query: {
              monitorDeviceId: this.remarkData.monitorDeviceId
            }
          });
        }
      });
      /*  this.$router.push({
        path: "/surveillancePath/detailLight",
        query: {
          monitorDeviceId: this.remarkData.monitorDeviceId
        }
      });*/
    }
  },
  mounted() {
    this.remarkData.dealRecord.forEach(el => {
      let str = el.dealContent + " (" + el.dealTime + ")";
      this.dealContent.push(str);
    });
  }
};
</script>


<style lang="scss">
.alarmLogT {
  padding-top: 26px;
  float: left;
  margin-bottom: 20px;
  /*width: calc(50% - 10px);*/
  width: 100%;
  /*margin-left: 20px;*/
  height: 183px;
  background-color: #203644;
  border-radius: 2px;
  display: flex;
  justify-content: space-around;
  .img {
    width: 100%;
    height: 59%;
    display: flex;
    .item {
      width: 100%;
      height: 100%;
      margin-left: 17px;
      text-align: center;
      color: white;
      font-size: 14px;
      .red {
        color: red;
      }
      & > span {
        margin-top: 10px;
      }
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      margin-bottom: 11px;
    }
  }
  .content {
    width: 47%;
    padding: 10px 20px;
    padding-top: 0;
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
      margin-top: 10px;
      div {
        font-size: 13px;
        color: #ffffff;
        display: flex;
        justify-content: flex-start;
        & > span {
          padding-left: 10px;
        }
        i {
          font-style: normal;
        }
        p {
          padding-left: 10px;
          span {
            display: block;
          }
        }
      }
    }
    .btn {
      p {
        padding-top: 10px;
        font-size: 14px;
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
      }
    }
  }
  .remarks {
    .dialog-footer {
      color: #ffffff;
      display: flex;
      justify-content: center;
      .button {
        height: 37px;
        line-height: 31px;
        font-size: 14px;
        &:first-child {
          margin-right: 30px;
        }
      }
    }
  }
}
</style>
