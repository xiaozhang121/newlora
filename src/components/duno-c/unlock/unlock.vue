<template>
  <div class="duno-unlock">
    <el-dialog
      title="开锁授权"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :close-on-press-escape="false"
      :show-close="false"
      :center="true"
      width="400px"
      top="30vh"
      :before-close="handleClose"
    >
      <p>
        <span>{{dataList.userId}}</span>
        申请锁具
        <span>{{dataList.devId}}</span>
        开锁授权
      </p>
      <span slot="footer" class="dialog-footer">
        <button-custom class="button" @click.native="handleChick(0)" title="驳回" />
        <button-custom class="button" @click.native="handleChick(1)" title="确定" />
      </span>
    </el-dialog>
  </div>
</template>
<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import { postAxiosData } from "@/api/axiosType";
import qs from "qs";
import axios from "axios";
export default {
  name: "unlock",
  components: {
    buttonCustom
  },
  props: {
    isShow: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    dataList: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  watch: {
    isShow(now) {
      this.dialogVisible = now;
    }
  },
  methods: {
    handleClose() {},
    handleReject() {
      this.$emit("on-close");
    },
    handleChick(item) {
      let that = this;
      let query = {
        ...this.dataList,
        act: item
      };
      let url = "/lenovo-smartlock/permit/grant";
      axios({
        baseURL: "http://10.0.0.164:8080",
        method: "POST",
        headers: {
          Authorization: this.$store.state.user.token,
          "content-type": "application/x-www-form-urlencoded"
        },
        data: qs.stringify(query),
        url: "/lenovo-smartlock/permit/grant"
      })
        .then(function(response) {
          let data = response.data;
          if (data.errorCode == 200) {
            that.$emit("on-close");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss">
.duno-unlock {
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
      .el-dialog__title {
        font-weight: 600;
      }
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