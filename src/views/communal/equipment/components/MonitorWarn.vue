<template>
  <div class="alarmLog">
    <div class="img">
      <img :src="remarkData.pic" alt />
    </div>
    <div class="content">
      <div class="top">
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
          <p>
            <span v-for="(item,index) in dealContent.slice(0,1)" :key="index">{{item}}</span>
          </p>
        </div>
      </div>
      <div class="btn">
        <p v-if="isShow">
          拍摄来源:
          <span @click="getJump">{{remarkData.monitorDeviceName}}</span>
          <i @click="dialogVisible = true">备注</i>
          <i v-if="remarkData.isReturn=='0'" @click="addReturn">复归</i>
          <i v-else :disabled="isDisabled">已复归</i>
        </p>
        <p v-else>
          拍摄来源:
          <span @click="getJump">{{remarkData.monitorDeviceName}}</span>
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
        width="30%"
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
  </div>
</template>

<script>
import moment from "moment";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import buttonCustom from "_c/duno-m/buttonCustom";
import { dealRemarks } from "@/api/configuration/configuration.js";
export default {
  name: "AlarmLog",
  components: { KeyMonitor, buttonCustom },
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
      textarea: "",
      dealContent: []
    };
  },
  methods: {
    addReturn() {
      const that = this;
      let query = {
        alarmId: that.remarkData.taskId + "," + that.remarkData.batchId,
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
      this.dialogVisible = false;
      let query = {
        alarmId: that.remarkData.taskId + "," + that.remarkData.batchId,
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
      this.$router.push({
        path: "/surveillancePath/detailLight",
        query: {
          monitorDeviceId: this.remarkData.monitorDeviceId
        }
      });
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
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .content {
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
      margin-top: 5px;
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
      padding-top: 10px;
      line-height: 32px;
      p {
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
