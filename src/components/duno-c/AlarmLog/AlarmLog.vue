<template>
  <div class="alarmLog">
    <div class="img">
      <KeyMonitor
        :streamAddr="remarkData.alarmFileAddress"
        :imgAdress="remarkData.pic"
        :monitorInfo="remarkData"
        :isNav="false"
      />
    </div>
    <div class="content">
      <div class="top">
        <p>
          机器判断:
          <span>{{remarkData.machineJudge}}</span>
        </p>
      </div>
      <div class="mainMain">
        <div>
          拍摄时间:
          <span>{{remarkData.alarmTime}}</span>
        </div>
        <div>
          <i>处理记录:</i>
          <p>
            <span v-for="(item,index) in dealList.slice(0,2)" :key="index">{{item}}</span>
          </p>
        </div>
      </div>
      <div class="btn">
        <p>
          拍摄来源:
          <span @click="getJump">{{remarkData.monitorDeviceName}}</span>
        </p>
        <p v-if="isShow">
          <i @click="dialogVisible = true">备注</i>
          <i v-if="remarkData.isReturn=='0'" @click="addReturn">复归</i>
          <i v-else :disabled="isDisabled" class="gray">已复归</i>
        </p>
        <p v-else>
          <i>查看详情></i>
        </p>
      </div>
    </div>
    <div class="remarks">
      <el-dialog
        title="备注"
        :center="true"
        top="20vh"
        :visible.sync="dialogVisible"
        :modal="false"
        width="500px"
      >
        <el-input
          type="textarea"
          placeholder="请输入备注内容"
          :autosize="{ minRows: 3}"
          v-model="textarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <button-custom class="button" @click.native="dialogVisible = false" title="取消" />
          <button-custom class="button" @click.native="clickRemarks" title="确定" />
        </span>
      </el-dialog>
    </div>
    <!-- <Remarks :isShow="isShowRemarks" /> -->
  </div>
</template>

<script>
import { postAxiosData, getAxiosData } from "@/api/axiosType";
import moment from "moment";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Remarks from "_c/duno-c/Remarks";
import buttonCustom from "_c/duno-m/buttonCustom";
import { dealRemarks } from "@/api/configuration/configuration.js";
export default {
  name: "AlarmLog",
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
      address: "",
      isDisabled: true,
      dialogVisible: false,
      isShowRemarks: false,
      textarea: "",
      dealList: []
    };
  },
  methods: {
    addReturn() {
      const that = this;
      const query = {
        alarmId: that.remarkData.alarmId,
        type: "1"
      };
      dealRemarks(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
        this.showReturn = false;
      });
      this.$emit("handleListData");
    },
    clickRemarks() {
      const that = this;
      that.dialogVisible = false;
      let query = {
        alarmId: that.remarkData.alarmId,
        type: "2",
        content: that.textarea
      };
      dealRemarks(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
        this.$emit("handleListData");
      });
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
      /* if (this.remarkData.monitorDeviceType == "1") {
        this.$router.push({
          path: "/surveillancePath/detailLight",
          query: {
            monitorDeviceId: this.remarkData.monitorDeviceId
          }
        });
      } else if (this.remarkData.monitorDeviceType == "2") {
        this.$router.push({
          path: "/surveillancePath/detailRed",
          query: {
            monitorDeviceId: this.remarkData.monitorDeviceId
          }
        });
      }*/
    }
  },
  mounted() {
    this.remarkData.dealList.forEach(el => {
      let str = el.dealType + " (" + el.dealTime + ")";
      this.dealList.push(str);
    });
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
    height: 100%;
    // position: relative;
    .keyMonitor {
      width: 100% !important;
    }
    // img {
    //   display: block;
    //   height: 100%;
    //   width: 100%;
    // }
    // i {
    //   position: absolute;
    //   top: 39%;
    //   left: 45%;
    //   font-size: 30px;
    //   color: #ffffff;
    // }
  }
  .content {
    width: 60%;
    padding: 20px 10px;
    .top {
      p {
        font-size: 16px;
        color: #ffffff;
        span {
          padding-left: 5px;
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
        height: 36px;
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
          background-color: #979797!important;
          color: #767676;
        }
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
