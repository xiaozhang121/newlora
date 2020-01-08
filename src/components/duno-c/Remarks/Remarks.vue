<template>
  <div class="remarks">
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      title="备注"
      :center="true"
      top="20vh"
      :visible.sync="dialogVisible"
      :modal="false"
      width="500px"
      :before-close="beforeClose"
    >
      <el-input type="textarea" placeholder="请输入备注内容" :autosize="{ minRows: 3}" v-model="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <button-custom class="button" @click.native="closeRemarks" title="取消" />
        <button-custom class="button" @click.native="clickRemarks" title="确定" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import { dealRemarks } from "@/api/configuration/configuration.js";
import { postAxiosData, getAxiosData } from "@/api/axiosType";
export default {
  name: "Remarks",
  components: { buttonCustom },
  props: {
    isShow: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    alarmId: {
      type: String | Number,
      default: () => {
        return "";
      }
    },
    overview: {
      type: String
    },
    isRobot: {
      type: String
    }
  },
  data() {
    return {
      dialogVisible: false,
      textarea: ""
    };
  },
  watch: {
    isShow(now) {
      this.dialogVisible = now;
    }
  },
  methods: {
    closeRemarks() {
      this.textarea = "";
      this.$emit("beforeClose");
    },
    beforeClose() {
      this.textarea = "";
      this.$emit("beforeClose");
    },
    clickRemarks() {
      const that = this;
      let query = {
        alarmId: that.alarmId,
        type: "2",
        content: that.textarea,
        isRobot: that.isRobot
      };
      if (that.overview == "overview") {
        let url = "/lenovo-plan/api/information/overview/result/one/day/deal";
        getAxiosData(url).then(res => {
          that.textarea = "";
          if (res.data.isSuccess) that.$message.success(res.msg);
          else that.$message.error(res.msg);
          this.$emit("beforeClose");
          this.$emit("beforeSubmit");
        });
      } else {
        dealRemarks(query).then(res => {
          that.textarea = "";
          if (res.data.isSuccess) that.$message.success(res.msg);
          else that.$message.error(res.msg);
          this.$emit("beforeClose");
        });
      }
    }
  }
};
</script>

<style lang="scss">
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
  .el-dialog {
    background-color: #e0e0e0;
    border: none;
    .el-dialog__header {
      background-color: #e0e0e0;
    }
    .el-dialog__body {
      background-color: #e0e0e0;
    }
    .el-dialog__footer {
      background-color: #e0e0e0;
    }
  }
}
</style>


