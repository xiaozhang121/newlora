<template>
  <div class="remarks">
    <el-dialog
      title="备注"
      :center="true"
      top="20vh"
      :visible.sync="dialogVisible"
      :modal="false"
      width="30%"
    >
      <el-input type="textarea" placeholder="请输入备注内容" :autosize="{ minRows: 3}" v-model="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <button-custom class="button" @click.native="dialogVisible = false" title="取消" />
        <button-custom class="button" @click="clickRemarks" title="确定" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
export default {
  name: "Remarks",
  components: { buttonCustom },
  props: {
    isShow: {
      type: Boolean,
      default: () => {
        return true;
      }
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
}
</style>


